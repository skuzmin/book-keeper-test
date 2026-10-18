import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatIconTestingModule } from '@angular/material/icon/testing';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BookDialogComponent } from './book-dialog.component';
import { Book } from '../../models/book.model';

describe('BookDialogComponent', () => {
  let component: BookDialogComponent;
  let fixture: ComponentFixture<BookDialogComponent>;
  const dialogRefMock = { close: vi.fn() };
  const book = { title: 'Test', author: 'Test', pages: 1 } as Book;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BookDialogComponent,
        MatIconTestingModule,
        FormsModule,
      ], providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: { book } },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookDialogComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  describe('General', () => {
    it('should create the component', () => {
      expect(component).toBeTruthy();
    });

    describe('Validation', () => {
      it('should validate form: true', () => {
        const testBook: Book = {
          author: 'Test',
          title: 'Test',
          pages: 1
        };
        const result = component.validation(testBook);
        expect(result).toBeTruthy();
      });

      it('should bvalidate form: false', () => {
        const testBook: Book = {
          author: '',
          title: '',
          pages: 0
        };
        const result = component.validation(testBook);
        expect(result).toBeFalsy();
      });
    });
  });
});
