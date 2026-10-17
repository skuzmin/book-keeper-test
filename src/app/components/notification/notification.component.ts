import { Component, Inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { NOTIFICATION_ICONS, NOTIFICATION_TITLES, NotificationTypes } from './notification.constant';
import { NotificationPayload } from './notification.model';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  imports: [MatIconModule, CommonModule]
})

export class NotificationComponent {
  public type: NotificationTypes;
  public icon: string;
  public title: string;
  public mainText: string;
  constructor(
    public snackBarRef: MatSnackBarRef<NotificationComponent>,
    @Inject(MAT_SNACK_BAR_DATA) public data: NotificationPayload) {
    this.type = this.data.type;
    this.title = NOTIFICATION_TITLES[this.data.type];
    this.mainText = this.data.mainText || '';
    this.icon = NOTIFICATION_ICONS[this.data.type];
  }
}