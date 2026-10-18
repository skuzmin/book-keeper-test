import { ANGULAR_IMPORTS } from './imports/common.imports';
import { MATERIAL_IMPORTS } from './imports/material.imports';
import { Component, effect, Signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';

import { BOOK_IMPORTS } from './imports/book.imports';
import { BookService } from './services/book.service';
import { NotificationService } from './components/notification/notification.service';
import { Book, SortDirection, SortKey } from './models/book.model';
import { SORT_ORDER_ICONS } from './constants/book.constant';
import { BookDialogComponent } from './components/book-dialog/book-dialog.component';

@Component({
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  imports: [ANGULAR_IMPORTS, MATERIAL_IMPORTS, BOOK_IMPORTS]
})
export class App {
  public displayedColumns: Array<string>;
  public dataColumns: Array<keyof Book>;
  public books: Signal<Book[]>;
  public booksDataSource: Array<Book>;
  public filterText: string;
  private sortKeys: Array<SortKey>;
  constructor(private service: BookService, private dialog: MatDialog, private notification: NotificationService) {
    this.books = service.getBooks();
    this.dataColumns = ['author', 'title', 'pages'];
    this.displayedColumns = [...this.dataColumns, 'actions'];
    this.sortKeys = [];
    this.booksDataSource = [];
    this.filterText = '';
    effect(() => this.updateView());
  }

  addBook() {
    this.dialog.open(BookDialogComponent)
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((book: Book) => {
        if (this.service.validate(book)) {
          this.service.addBook(book);
          this.notification.success('Book has been successfully added.')
        } else {
          this.notification.error('Book already exists in the list.');
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
        const result = this.service.validate(res.new);
        if (result) {
          this.service.updateBook(res.old, res.new);
          this.notification.success('Book has been successfully updated.');
        } else {
          this.notification.error('This book already exists.');
        }
      });
  }

  removeBook(book: Book): void {
    this.service.removeBook(book);
    this.notification.success('Book has been removed from the list.')
  }

  async onImportInputChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (!file) {
      return;
    }

    const result = this.service.tryImportXML(await file.text());
    switch (result) {
      case 'error':
        this.notification.error('Bad file format or data.');
        break;
      case 'warning':
        this.notification.warning('Imported partially, duplicates removed.');
        break;
      default:
        this.notification.success('Books have been successfully imported.');
    }
  }

  filterBooks(event: string): void {
    this.filterText = event;
    this.updateView();
  }

  headerSort(field: keyof Book): void {
    const existingSortIndex = this.sortKeys.findIndex((sk: SortKey) => sk.field === field);

    if (existingSortIndex !== -1) {
      if (this.sortKeys[existingSortIndex].dir === 'asc') {
        this.sortKeys[existingSortIndex].dir = 'desc';
      } else {
        this.sortKeys.splice(existingSortIndex, 1);
      }
    } else {
      if (field === 'author') {
        this.sortKeys = [{ field, dir: 'asc' }];
      } else {
        this.sortKeys = this.sortKeys.filter(k => k.field === 'author');
        this.sortKeys.push({ field, dir: 'asc' });
      }
    }

    this.updateView();
  }

  updateView(): void {
    const text = this.filterText.toLowerCase().trim();
    const rows = this.books().filter(b => b.title.toLowerCase().includes(text));

    if (this.sortKeys.length) {
      rows.sort((a, b) => {
        for (const { field, dir } of this.sortKeys) {
          const x = a[field];
          const y = b[field];

          let result = 0;
          if (x < y) {
            result = -1;
          } else if (x > y) {
            result = 1;
          }

          if (result !== 0) {
            return dir === 'asc' ? result : -result;
          }
        }
        return 0;
      });
    }

    this.booksDataSource = rows;
  }

  getSortDirection(col: keyof Book): SortDirection | null {
    const sortKey = this.sortKeys.find((sk: SortKey) => sk.field === col);
    return sortKey ? sortKey.dir : null;
  }

  getSortDirectionIcon(col: keyof Book): string {
    const dir = this.getSortDirection(col);
    return dir ? SORT_ORDER_ICONS[dir] : '';
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
