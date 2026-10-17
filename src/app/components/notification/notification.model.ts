import { NotificationTypes } from './notification.constant';


export interface NotificationPayload {
  type: NotificationTypes;
  mainText?: string;
}