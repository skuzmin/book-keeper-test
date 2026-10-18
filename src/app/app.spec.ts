import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { BookService } from './services/book.service';
import { App } from './app';
import { BookDialogComponent } from './components/book-dialog/book-dialog.component';
import { NotificationService } from './components/notification/notification.service';
import { Book } from './models/book.model';
import { SORT_ORDER_ICONS } from './constants/book.constant';

const TEST_BOOK: Book = { author: 'test777', title: 'test777', pages: 777 };
describe('App', () => {
  let component: App;
  let fixture: ComponentFixture<App>;
  let service: BookService;
  let notification: NotificationService;
  const dialogMock = {
    open: vi.fn().mockReturnValue({ afterClosed: () => of(undefined) }),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).overrideProvider(MatDialog, { useValue: dialogMock })
      .compileComponents();

    service = TestBed.inject(BookService);
    notification = TestBed.inject(NotificationService);

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  describe('General', () => {
    it('should create the app', () => {
      expect(component).toBeTruthy();
    });

    it('should open Add Book Dialog', () => {
      component.addBook();
      expect(dialogMock.open).toHaveBeenCalledWith(BookDialogComponent);
    });

    it('should open Edit Book Dialog', () => {
      component.editBook(TEST_BOOK);
      expect(dialogMock.open).toHaveBeenCalledWith(BookDialogComponent, {
        data: { book: TEST_BOOK },
      });
    });

    it('should remove the book and show a notification', () => {
      const removeSpy = vi.spyOn(service, 'removeBook').mockImplementation(() => { });
      const successSpy = vi.spyOn(notification, 'success').mockImplementation(() => { });
      component.removeBook(TEST_BOOK);
      expect(removeSpy).toHaveBeenCalledWith(TEST_BOOK);
      expect(successSpy).toHaveBeenCalled();
    });

    it('should update the view when filtering', () => {
      const updateViewSpy = vi.spyOn(component, 'updateView').mockImplementation(() => { });
      component.filterBooks('test');
      expect(component.filterText).toBe('test');
      expect(updateViewSpy).toHaveBeenCalled();
    });
  });

  describe('Import Books', () => {
    it('should skip import(no file)', async () => {
      const event = { target: { files: [] } } as any;
      const importSpy = vi.spyOn(service, 'tryImportXML');
      await component.onImportInputChange(event);
      expect(importSpy).not.toHaveBeenCalled();
    });

    it('should show [ERROR] during import', async () => {
      const event = { target: { files: [{ text: () => Promise.resolve('') }] } } as any;
      const notificationSpy = vi.spyOn(notification, 'error').mockImplementation(() => { });
      vi.spyOn(service, 'tryImportXML').mockReturnValue('error');
      await component.onImportInputChange(event);
      expect(notificationSpy).toHaveBeenCalled();
    });

    it('should show [WARNING] during import', async () => {
      const event = { target: { files: [{ text: () => Promise.resolve('') }] } } as any;
      const notificationSpy = vi.spyOn(notification, 'warning').mockImplementation(() => { });
      vi.spyOn(service, 'tryImportXML').mockReturnValue('warning');
      await component.onImportInputChange(event);
      expect(notificationSpy).toHaveBeenCalled();
    });

    it('should show [SUCCESS] during import', async () => {
      const event = { target: { files: [{ text: () => Promise.resolve('') }] } } as any;
      const notificationSpy = vi.spyOn(notification, 'success').mockImplementation(() => { });
      vi.spyOn(service, 'tryImportXML').mockReturnValue('success');
      await component.onImportInputChange(event);
      expect(notificationSpy).toHaveBeenCalled();
    });
  });

  describe('Sorting', () => {
    let updateViewSpy: ReturnType<typeof vi.spyOn>;
    beforeEach(() => {
      component['sortKeys'] = [];
      updateViewSpy = vi.spyOn(component as any, 'updateView').mockImplementation(() => { });
    });

    it('should sort by non-author column ASC', () => {
      component.headerSort('title');
      expect(component['sortKeys']).toEqual([{ field: 'title', dir: 'asc' }]);
      expect(updateViewSpy).toHaveBeenCalled();
    });

    it('should sort by non-author column DESC', () => {
      component['sortKeys'] = [{ field: 'title', dir: 'asc' }];
      component.headerSort('title');
      expect(component['sortKeys']).toEqual([{ field: 'title', dir: 'desc' }]);
      expect(updateViewSpy).toHaveBeenCalled();
    });

    it('should remove sorting', () => {
      component['sortKeys'] = [{ field: 'title', dir: 'desc' }];
      component.headerSort('title');
      expect(component['sortKeys']).toEqual([]);
      expect(updateViewSpy).toHaveBeenCalled();
    });

    it('should sort by author as primary sort', () => {
      component['sortKeys'] = [{ field: 'title', dir: 'asc' }];
      component.headerSort('author');
      expect(component['sortKeys']).toEqual([{ field: 'author', dir: 'asc' }]);
      expect(updateViewSpy).toHaveBeenCalled();
    });

    it('should keep author sorting(primary) when add secondary sorting', () => {
      component['sortKeys'] = [{ field: 'author', dir: 'desc' }];
      component.headerSort('pages');
      expect(component['sortKeys']).toEqual([{ field: 'author', dir: 'desc' }, { field: 'pages', dir: 'asc' }]);
      expect(updateViewSpy).toHaveBeenCalled();
    });
  });

  describe('Get sorting direction', () => {
    it('should return null when the column is not sorted', () => {
      component['sortKeys'] = [];
      expect(component.getSortDirection('title')).toBeNull();
    });

    it('should return the direction when the column is sorted', () => {
      component['sortKeys'] = [{ field: 'title', dir: 'desc' }];
      expect(component.getSortDirection('title')).toBe('desc');
    });
  });

  describe('Get sorting direction icon', () => {
    it('should return no icon when there is no sorting', () => {
      component['sortKeys'] = [];
      expect(component.getSortDirectionIcon('title')).toBe('');
    });

    it('should return correct sort direction icon', () => {
      component['sortKeys'] = [{ field: 'title', dir: 'asc' }];
      expect(component.getSortDirectionIcon('title')).toBe(SORT_ORDER_ICONS['asc']);
    });
  });

  describe('Update View', () => {
    const testBook1 = { author: 'Test555', title: '333', pages: 300 };
    const testBook2 = { author: 'Test555', title: '555', pages: 500 };
    const testBook3 = { author: 'Test777', title: '777', pages: 700 };

    beforeEach(() => {
      service['booksState'].set([testBook1, testBook2, testBook3]);
      component.filterText = '';
      component['sortKeys'] = [];
    });

    it('should filter by title', () => {
      component.filterText = '  333 ';
      component.updateView();
      expect(component.booksDataSource).toEqual([testBook1]);
    });

    it('should should skip sorting', () => {
      component.updateView();
      expect(component.booksDataSource).toEqual([testBook1, testBook2, testBook3]);
    });

    it('should sort ASC', () => {
      service['booksState'].set([testBook3, testBook2, testBook1]);
      component['sortKeys'] = [{ field: 'pages', dir: 'asc' }];
      component.updateView();
      expect(component.booksDataSource).toEqual([testBook1, testBook2, testBook3]);
    });

    it('should sort DESC', () => {
      component['sortKeys'] = [{ field: 'title', dir: 'desc' }];
      component.updateView();
      expect(component.booksDataSource).toEqual([testBook3, testBook2, testBook1]);
    });

    it('should sort by two columns', () => {
      component['sortKeys'] = [{ field: 'author', dir: 'desc' }, { field: 'title', dir: 'asc' }];
      component.updateView();
      expect(component.booksDataSource).toEqual([testBook3, testBook1, testBook2]);
    });

    it('should return 0 when columns are equal', () => {
      component['sortKeys'] = [{ field: 'author', dir: 'desc' }];
      component.updateView();
      expect(component.booksDataSource).toEqual([testBook3, testBook1, testBook2]);
    });
  });
});
