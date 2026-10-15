import { Service } from '@angular/core';
import { Book } from './book.model';

@Service()
export class BookService {
  private books: Array<Book> = [];

  getBooks(): Array<Book> {
    return this.books;
  }

  addBook(book: Book): void {
    this.books.push(book);
  }

  removeBook(book: Book): void {
    this.books = this.books.filter((b: Book) => !this.isBookTheSame(b, book));
  }

  updateBook(book: Book): void {
    const index = this.books.findIndex((b: Book) => this.isBookTheSame(b, book));
    if (index !== -1) {
      this.books[index] = book;
    }
  }

  isBookTheSame(b1: Book, b2: Book): boolean {
    return b1.author === b2.author && b1.pages === b2.pages && b1.title == b2.title;
  }

  exportXML(): void {
    return;
  }

  importXML(): void {
    return;
  }
}
