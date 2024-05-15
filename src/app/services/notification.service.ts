import { Injectable } from '@angular/core';
import { API } from 'src/app/routes/api-routes';
import { ApiService } from './api/api.service';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(public apiService: ApiService) {}

  getNotifications(userId,currentPage){
    return this.apiService.get(
      `${API.NOTIFICATION.get}?userId=` +
        userId+
        `&page=` +
        currentPage,
      true,
      true
    );
  }

  getNotificationCount(userId){
    return this.apiService.get(
      `${API.NOTIFICATION.getNotificationCount}?userId=` +
        userId,
      true,
      true
    );
  }
}