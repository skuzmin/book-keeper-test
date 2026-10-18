import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-dialog',
  templateUrl: './book-dialog.component.html',
  styleUrl: './book-dialog.component.scss',
  imports: [FormsModule, MatDialogModule],
})

export class BookDialogComponent {
  public book: Book;
  private bookBckp: Book;
  public isError: boolean;
  public isEditMode: boolean;
  constructor(private dialogRef: MatDialogRef<BookDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: { book: Book }) {
    this.isEditMode = !!this.data?.book;
    this.book = data?.book ? Object.assign({}, data.book) : {
      author: '',
      title: '',
      pages: 0
    };
    this.bookBckp = Object.assign({}, this.book);
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

  updateBook(): void {
    this.isError = !this.validation(this.book);
    if (!this.isError) {
      this.dialogRef.close({ old: this.bookBckp, new: this.book });
    }
  }
}