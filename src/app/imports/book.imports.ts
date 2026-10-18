import { FilterBarComponent } from '../components/filter-bar/filter-bar.component';
import { NoBooksComponent } from '../components/no-books/no-books.component';
import { TitleBarActionsComponent } from '../components/title-bar-actions/title-bar-actions.component';

export const BOOK_IMPORTS = [
  NoBooksComponent,
  FilterBarComponent,
  TitleBarActionsComponent
] as const;
