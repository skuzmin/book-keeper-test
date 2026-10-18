import { Service, Signal, signal, WritableSignal } from '@angular/core';
import { XMLParser } from 'fast-xml-parser';
import XMLBuilder from 'fast-xml-builder';

import { Book } from '../models/book.model';

type ImportStatus = 'success' | 'warning' | 'error';

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

  updateBook(oldBook: Book, newBook: Book): void {
    const books = this.books();
    const index = books.findIndex((b: Book) => this.isBookTheSame(b, oldBook));
    if (index !== -1) {
      const copy = [...books];
      copy[index] = newBook;
      this.booksState.set(copy);
    }
  }

  isBookTheSame(b1: Book, b2: Book): boolean {
    return b1.author === b2.author && b1.pages === b2.pages && b1.title === b2.title;
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

  tryImportXML(xml: string): ImportStatus {
    let status: ImportStatus = 'success';
    const data = this.xmlParser.parse(xml);
    const items: Array<any> = data?.books?.book ?? [];

    if (!items.length) {
      return 'error';
    }

    this.booksState.update((books: Array<Book>) => {
      const existedBooks = new Set(books.map((b: Book) => this.generateBookKey(b)));
      const result = [...books];

      for (const item of items) {
        const newBook: Book = {
          title: String(item.title ?? '').trim(),
          author: String(item.author ?? '').trim(),
          pages: Number(item.pages)
        }
        const key = this.generateBookKey(newBook);
        if (!existedBooks.has(key)) {
          existedBooks.add(key);
          result.push(newBook);
        } else {
          status = 'warning';
        }
      }

      return result;
    });

    return status;
  }

  generateBookKey(b: Book): string {
    return JSON.stringify([b.author.toLowerCase().trim(), b.title.toLowerCase().trim(), b.pages]);
  }
}
