import { SortDirection } from './book.model';

export const SORT_ORDER_ICONS: Record<SortDirection, string> = {
  asc: 'arrow_upward',
  desc: 'arrow_downward'
} as const;