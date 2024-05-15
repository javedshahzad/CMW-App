import { Injectable } from '@angular/core';
import {
  Capacitor
} from '@capacitor/core';
import { Router } from '@angular/router';

import { ActionPerformed, PushNotification, PushNotificationSchema, PushNotifications, Token } from '@capacitor/push-notifications';
import { Constants } from '../constant/constants';

@Injectable({
  providedIn: 'root'
})
export class FcmService {
  token: string;

  constructor(private router: Router) { }

  initPush() {
    if (Capacitor.getPlatform() !== 'web') {
      this.registerPush();
    }
  }

  private registerPush() {
    PushNotifications.requestPermissions().then((permission) => {
      if (permission.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
        PushNotifications.addListener(
          'registration',
          (token: Token) => {
            console.log('My token: ' + JSON.stringify(token));
            console.log("Token= " ,token.value);
            this.token = token.value;
            localStorage.setItem(Constants.DEVICETOKEN, this.token);
          }
        );
    
        PushNotifications.addListener('registrationError', (error: any) => {
          console.log('Error: ' + JSON.stringify(error));
        });
    
        PushNotifications.addListener(
          'pushNotificationReceived',
          async (notification: PushNotificationSchema) => {
            console.log('Push received: ' + JSON.stringify(notification));
          }
        );
    
        PushNotifications.addListener(
          'pushNotificationActionPerformed',
          async (notification: ActionPerformed) => {
            const data = notification.notification.data;
            console.log(data,notification)
          }
        );
      } else {
        // No permission for push granted
      }
    });

   
  }
}