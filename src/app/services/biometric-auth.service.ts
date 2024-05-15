import { Injectable } from '@angular/core';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class BiometricAuthService {

  constructor(
    private faio: FingerprintAIO, 
    private alertController:AlertController
  ) { }
  async BiometricAuthentication() {
    return new Promise((resolve,reject) => {
    this.faio.isAvailable().then((result: any) => {
            console.log(result)
            this.faio.show({
                    cancelButtonTitle: 'Cancel',
                    description: "Biometric authrization",
                    disableBackup: true,
                    title: 'CoverMyWork',
                    fallbackButtonTitle: 'FB Back Button',
                   // subtitle: 'Authrization',
                })
                .then(async (Data: any) => {
                  console.log(Data)
                  resolve('Success');
                })
                .catch((error: any) => {
                    console.log(error)
                    this.presentAlertMatchNotFound('Biometric authrization failed','Could not match!');
                    let data = {
                      error : error,
                      message:"Biometric not match"
                    }
                    reject(data);
                });

        })
        .catch((error: any) => {
            console.log(error);
            let data = {
              error : error,
              message:"Biometric not available"
            }
            reject(data);
            var IsEnabledBiometric = localStorage.getItem('IsEnabledBiometric') ? localStorage.getItem('IsEnabledBiometric') : "";
            if(!IsEnabledBiometric){
              this.presentAlertMatchNotFound('Biometric not available','Biometric not configured. Please configure biometric from your device settings!');
            }
           
        });
      });
}
checkBiometric(){
  this.faio.isAvailable().then((result: any) => {
    console.log(result)
  })
  .catch((error: any) => {
      console.log(error);
      this.presentAlertMatchNotFound('Biometric not available','Biometric not configured. Please configure biometric from your device settings!');
  });
}
async presentAlertMatchNotFound(Head,msg) {
  const alert = await this.alertController.create({
      header: Head,
      message: msg,
      mode: "ios",
      buttons: [{
          text: 'OK',
          role: 'confirm',
          handler: () => {
              console.log("confirm")
          }
      }]
  });

  await alert.present();
}
async presentAlertBiometricNotAvailabel(Head,msg) {
  const alert = await this.alertController.create({
      header: Head,
      message: msg,
      mode: "ios",
      buttons: [{
          text: 'OK',
          role: 'confirm',
          handler: () => {
              console.log("confirm")
          }
      }]
  });

  await alert.present();
}
}
