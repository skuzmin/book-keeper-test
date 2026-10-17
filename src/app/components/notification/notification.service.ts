import { inject, Service } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

import { NOTIFICATION_CONFIG, NotificationTypes } from './notification.constant';
import { NotificationPayload } from './notification.model';
import { NotificationComponent } from './notification.component';

@Service()
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  success(text: string): void {
    this.showNotification({ type: NotificationTypes.Success, mainText: text });
  }

  error(text: string): void {
    this.showNotification({ type: NotificationTypes.Error, mainText: text });
  }

  warning(text: string): void {
    this.showNotification({ type: NotificationTypes.Warning, mainText: text });
  }

  private showNotification(payload: NotificationPayload): void {
    this.snackBar.openFromComponent(NotificationComponent, {
      ...NOTIFICATION_CONFIG,
      data: payload
    })
      .afterDismissed()
      .subscribe();
  }
}