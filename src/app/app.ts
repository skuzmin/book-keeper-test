import { ChangeDetectorRef, Component, effect, Signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { filter } from 'rxjs';

import { BookService } from './services';
import { Book } from './book.model';
import { BookDialogComponent } from './components/book-dialog.component';

@Component({
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  imports: [MatDialogModule, CommonModule, MatTableModule, MatMenuModule, MatIconModule, FormsModule]
})
export class App {
  public displayedColumns: Array<string>;
  public books: Signal<Book[]>;
  public booksDataSource: Array<Book>;
  public filterText: string;
  constructor(private service: BookService, private dialog: MatDialog, private cdr: ChangeDetectorRef) {
    this.books = service.getBooks();
    this.displayedColumns = ['author', 'title', 'pages', 'actions'];
    this.booksDataSource = this.books();
    effect(() => this.booksDataSource = this.books());
    this.filterText = '';
  }

  addBook() {
    this.dialog.open(BookDialogComponent)
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((book: Book) => {
        if (this.service.validate(book)) {
          this.service.addBook(book);
        } else {
          alert('Book already exists!');
        }
      });
  }

  editBook(book: Book): void {
    this.dialog.open(BookDialogComponent, {
      data: { book }
    })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((res: { old: Book, new: Book }) => {
        this.service.updateBook(res.old, res.new);
      });
  }

  removeBook(book: Book): void {
    this.service.removeBook(book);
  }

  async onImportInputChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.service.importXML(await file.text());
  }

  filterBooks(): void {
    this.booksDataSource = this.books().filter((b: Book) => b.title.toLowerCase().includes(this.filterText.toLowerCase().trim()));
    this.cdr.markForCheck();
  }

  clearFilter(): void {
    this.filterText = '';
    this.filterBooks();
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
