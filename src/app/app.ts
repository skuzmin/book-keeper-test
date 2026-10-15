import { Component } from '@angular/core';
import { BookService } from './book.service';
import { Book } from './book.model';

@Component({
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  providers: [BookService]
})
export class App {
  public books: Array<Book>;
  constructor(service: BookService) {
    this.books = service.getBooks();
  }

  onImportInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
  }
}
