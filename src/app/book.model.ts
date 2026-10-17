export interface Book {
  title: string;
  author: string;
  pages: number;
}

export type SortDirection = 'asc' | 'desc';

export interface SortKey {
  field: keyof Book;
  dir: SortDirection;
}