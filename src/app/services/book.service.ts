import { Service, Signal, signal, WritableSignal } from '@angular/core';
import { XMLParser } from 'fast-xml-parser';
import XMLBuilder from 'fast-xml-builder';

import { Book } from '../book.model';

@Service()
export class BookService {
  private booksState: WritableSignal<Book[]> = signal([]);
  private readonly books: Signal<Book[]> = this.booksState.asReadonly();
  private xmlParser: XMLParser = new XMLParser({
    isArray: (tagName) => tagName === 'book',
    parseTagValue: false,
  });
  private xmlBuilder = new XMLBuilder({
    format: true,
  });

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

  exportXML(): string {
    const xml = this.xmlBuilder.build({
      books: {
        book: this.books().map((b: Book) => ({ title: b.title, author: b.author, pages: b.pages }))
      }
    });
    return `<?xml version="1.0" encoding="UTF-8"?>\n${xml}`;
  }

  importXML(xml: string): void {
    const data = this.xmlParser.parse(xml);
    const items = data?.books?.book ?? [];
    const importedBooks = items.map((item: any) => ({
      title: String(item.title ?? '').trim(),
      author: String(item.author ?? '').trim(),
      pages: Number(item.pages)
    }));
    this.booksState.update(books => [...books, ...importedBooks])
  }
}
