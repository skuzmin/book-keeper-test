import { TestBed } from '@angular/core/testing';
import { BookService } from './book.service';
import { Book } from '../models/book.model';

const TEST_BOOK: Book = { author: 'test777', title: 'test777', pages: 777 };
const NEW_TEST_BOOK: Book = { author: 'test', title: 'test', pages: 1 };
describe('BookService', () => {
  let service: BookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BookService);
    service['booksState'].set([TEST_BOOK]);
  });

  describe('Book CRUD', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });

    it('should add the book', () => {
      service.addBook(NEW_TEST_BOOK);
      expect(service.getBooks()().length).toEqual(2);
    });

    it('should remove test book', () => {
      service.removeBook(TEST_BOOK);
      expect(service.getBooks()().length).toEqual(0);
    });

    it('should update test book', () => {
      service.updateBook(TEST_BOOK, NEW_TEST_BOOK);
      const result = service.getBooks()();
      expect(result.length).toEqual(1);
      expect(result[0].author).toBe(NEW_TEST_BOOK.author);
      expect(result[0].title).toBe(NEW_TEST_BOOK.title);
      expect(result[0].pages).toBe(NEW_TEST_BOOK.pages);
    });
  });

  describe('Book validation', () => {
    it('should validate if book already exist', () => {
      const result = service.validate(TEST_BOOK);
      expect(result).toBeFalsy();
    });

    it('should check if books are the same', () => {
      const result = service.isBookTheSame(TEST_BOOK, TEST_BOOK);
      expect(result).toBeTruthy();
    });

    it('should generate correct Book-Key', () => {
      const result = service.generateBookKey(TEST_BOOK);
      expect(result).toBe('["test777","test777",777]');
    });
  });

  describe('Bood Import', () => {
    it('should return status: ERROR (bad file)', () => {
      const result = service.tryImportXML('TEST');
      expect(result).toBe('error');
    });

    it('should return status: ERROR (bad data)', () => {
      const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
                      <books>
                        <book>
                          <title>test777</title>
                          <author>test777</author>
                          <pages>aaa</pages>
                        </book>
                      </books>
                      `;
      const result = service.tryImportXML(xmlData);
      expect(result).toBe('error');
    });

    it('should return status: WARNING', () => {
      const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
                      <books>
                        <book>
                          <title>test777</title>
                          <author>test777</author>
                          <pages>777</pages>
                        </book>
                      </books>
                      `;
      const result = service.tryImportXML(xmlData);
      expect(result).toBe('warning');
    });

    it('should return status: SUCCESS', () => {
      const xmlData = `<?xml version="1.0" encoding="UTF-8"?>
                      <books>
                        <book>
                          <title>test</title>
                          <author>test</author>
                          <pages>7</pages>
                        </book>
                      </books>
                      `;
      const result = service.tryImportXML(xmlData);
      expect(result).toBe('success');
    });
  });
});
