import { Component, Signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { filter } from 'rxjs';

import { BookService } from './services';
import { Book } from './book.model';
import { BookDialogComponent } from './components/book-dialog.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  imports: [MatDialogModule, CommonModule]
})
export class App {
  public books: Signal<Book[]>;
  constructor(private service: BookService, private dialog: MatDialog) {
    this.books = service.getBooks();
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

  async onImportInputChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.service.importXML(await file.text());
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
