import { Component, Signal, WritableSignal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { filter } from 'rxjs';

import { BookService } from './book.service';
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

  onImportInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
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
}
