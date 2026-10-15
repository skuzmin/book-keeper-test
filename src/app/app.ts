import { ChangeDetectorRef, Component, Signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';

import { BookService } from './services';
import { Book } from './book.model';
import { BookDialogComponent } from './components/book-dialog.component';

@Component({
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  imports: [MatDialogModule, CommonModule, MatTableModule]
})
export class App {
  public displayedColumns: Array<string>;
  public books: Signal<Book[]>;
  public booksDataSource: Array<Book>;
  private filterTimer: number | undefined;
  constructor(private service: BookService, private dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.books = service.getBooks();
    this.displayedColumns = ['title', 'author', 'pages', 'actions'];
    this.booksDataSource = this.books();
    this.filterTimer = undefined;
  }

  addBook() {
    this.dialog.open(BookDialogComponent)
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((book: Book) => {
        if (this.service.validate(book)) {
          this.service.addBook(book);
          this.booksDataSource = this.books();
        } else {
          alert('Book already exists!');
        }
      });
  }

  async onImportInputChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.service.importXML(await file.text());
    this.booksDataSource = this.books();
  }

  filterBooks(event: InputEvent): void {
    clearTimeout(this.filterTimer);
    this.filterTimer = setTimeout(() => {
      const { value } = event.target as HTMLInputElement;
      this.booksDataSource = this.books().filter((b: Book) => b.title.toLowerCase().includes(value.toLowerCase().trim()));
      this.cdr.markForCheck();
    }, 300);
  }

  exportBooks(): void {
    const xml = this.service.exportXML();
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'books.xml';
    a.click();
    URL.revokeObjectURL(url);
  }
}
