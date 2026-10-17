import { MatSnackBarConfig } from '@angular/material/snack-bar';

export const NOTIFICATION_DURATION = 2 * 1000;

export enum NotificationTypes {
  Error = 'error',
  Warning = 'warning',
  Success = 'success'
}

export const NOTIFICATION_ICONS: Record<NotificationTypes, string> = {
  error: 'cancel',
  warning: 'warning',
  success: 'check_circle'
} as const;

export const NOTIFICATION_TITLES: Record<NotificationTypes, string> = {
  error: 'Error',
  warning: 'Warning',
  success: 'Success'
} as const;

export const NOTIFICATION_CONFIG: MatSnackBarConfig = {
  duration: NOTIFICATION_DURATION,
  horizontalPosition: 'right',
  verticalPosition: 'top',
  panelClass: 'books-snack-bar'
} as const;
