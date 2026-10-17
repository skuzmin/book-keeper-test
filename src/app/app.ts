import { ANGULAR_IMPORTS } from './shared/common.imports';
import { MATERIAL_IMPORTS } from './shared/material.imports';
import { Component, effect, Signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { filter } from 'rxjs';

import { BookService } from './services';
import { Book, SortDirection, SortKey } from './book.model';
import { BookDialogComponent } from './components/book-dialog.component';
import { SORT_ORDER_ICONS } from './book.constant';

@Component({
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
  imports: [ANGULAR_IMPORTS, MATERIAL_IMPORTS]
})
export class App {
  public displayedColumns: Array<string>;
  public dataColumns: Array<keyof Book>;
  public books: Signal<Book[]>;
  public booksDataSource: Array<Book>;
  public filterText: string;
  private sortKeys: Array<SortKey>;
  constructor(private service: BookService, private dialog: MatDialog) {
    this.books = service.getBooks();
    this.dataColumns = ['author', 'title', 'pages'];
    this.displayedColumns = [...this.dataColumns, 'actions'];
    this.sortKeys = [];
    this.booksDataSource = [];
    effect(() => this.updateView());
    this.filterText = '';
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

  editBook(book: Book): void {
    this.dialog.open(BookDialogComponent, {
      data: { book }
    })
      .afterClosed()
      .pipe(filter(Boolean))
      .subscribe((res: { old: Book, new: Book }) => {
        this.service.updateBook(res.old, res.new);
      });
  }

  removeBook(book: Book): void {
    this.service.removeBook(book);
  }

  async onImportInputChange(event: Event): Promise<void> {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      return;
    }
    this.service.importXML(await file.text());
  }

  filterBooks(): void {
    this.updateView();
  }

  clearFilter(): void {
    this.filterText = '';
    this.filterBooks();
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
