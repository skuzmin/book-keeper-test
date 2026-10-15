import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { Book } from '../book.model';

@Component({
  selector: 'app-book-dialog',
  templateUrl: './book-dialog.component.html',
  styleUrl: './book-dialog.component.scss',
  imports: [FormsModule, MatDialogModule],
})

export class BookDialogComponent {
  public book: Book;
  public isError: boolean;
  constructor(private dialogRef: MatDialogRef<BookDialogComponent>) {
    this.book = {
      author: '',
      title: '',
      pages: 0
    };
    this.isError = false;
  }

  validation(book: Book): boolean {
    return !!book.author.trim() && !!book.title.trim() && !!book.pages;
  }

  addBook(): void {
    this.isError = !this.validation(this.book);
    if (!this.isError) {
      this.dialogRef.close(this.book);
    }
  }
}