import { Service, Signal, signal, WritableSignal } from '@angular/core';
import { Book } from './book.model';

@Service()
export class BookService {
  private booksState: WritableSignal<Book[]> = signal([]);
  private readonly books: Signal<Book[]> = this.booksState.asReadonly();

  getBooks(): Signal<Book[]> {
    return this.books;
  }

  addBook(book: Book): void {
    this.booksState.update(books => [...books, book]);
  }

  removeBook(book: Book): void {
    this.booksState.update(books => books.filter((b: Book) => !this.isBookTheSame(b, book)));
  }

  updateBook(book: Book): void {
    const books = this.books();
    const index = books.findIndex((b: Book) => this.isBookTheSame(b, book));
    if (index !== -1) {
      const copy = [...books];
      copy[index] = book;
      this.booksState.set(copy);
    }
  }

  isBookTheSame(b1: Book, b2: Book): boolean {
    return b1.author === b2.author && b1.pages === b2.pages && b1.title == b2.title;
  }

  validate(book: Book): boolean {
    return !this.books().some((b: Book) => this.isBookTheSame(b, book));
  }

  exportXML(): void {
    return;
  }

  importXML(): void {
    return;
  }
}
