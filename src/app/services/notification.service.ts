
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  showNotification: boolean = false;
  notificationMessage: string = '';
  typeOfNotification: boolean = false;

  handleNotification(message: string, isSuccess: boolean): void {
    this.notificationMessage = message;
    this.typeOfNotification = isSuccess;
    this.showNotification = true;
    setTimeout(() => {
      this.showNotification = false;
    }, 5000);
  }
}
