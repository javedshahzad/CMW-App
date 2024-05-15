import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { ToastController } from '@ionic/angular';



@Injectable({
  providedIn: 'root',
})
export class UtilityService {
  public isLoading: boolean = false;
  constructor(
    public loadingController: LoadingController,
    public toastController: ToastController
  ) {}

  // async showLoading() {
  //   const loading = await this.loadingController.create({
  //     cssClass: 'my-custom-class',
  //     message: 'Please wait...',

  //   });
  //   await loading.present();
  // }

  async presentToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 2000,
    });
    toast.present();
  }

  // async hideLoading() {
  //   return await this.loadingController.dismiss().then(() => console.log('loading dismissed'));
  // }

  async showLoading() {

    if(!this.isLoading){
      this.isLoading = true;
      return await this.loadingController
        .create({
          cssClass: 'my-custom-class',
          message: 'Please wait...',
          duration: 5000,
        })
        .then((a) => {
          a.present().then(() => {
            if (!this.isLoading) {
              a.dismiss().then(() => {});
            }
          });
        });
    }
    return null;
  }
  async showLoadingwithThreeSec() {
    if(!this.isLoading){
    this.isLoading = true;
    return await this.loadingController
      .create({
        cssClass: 'my-custom-class',
        message: 'Please wait...',
        duration: 3000,
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then(() => {});
          }
        });
      });
    }
    return null;
  }
  async showLoadingwithoutDuration() {
    if(!this.isLoading){
    this.isLoading = true;
    return await this.loadingController
      .create({
        cssClass: 'my-custom-class',
        message: 'Please wait...',
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then(() => {});
          }
        });
      });
    }
    return null;
  }
  async showLoadingwithcustomDuration(count: any) {
    if(!this.isLoading){
    this.isLoading = true;
    return await this.loadingController
      .create({
        cssClass: 'my-custom-class',
        message: 'Please wait...',
        duration: count,
      })
      .then((a) => {
        a.present().then(() => {
          if (!this.isLoading) {
            a.dismiss().then(() => {});
          }
        });
      });
    }
    return null;
  }

  async hideLoading() {
    if (this.isLoading) {
      this.isLoading = false;
      await this.loadingController.getTop().then(async (res) => {
        if (!!res) {
          return await this.loadingController.dismiss().then(() => {});
        }
        return null;
      });
    }

    return null;
  }

  async showErrorToast(msg, count=3000) {
    const toast = await this.toastController.create({
      message: msg,
      duration: count,
      color: 'danger',
      position: 'bottom',
      cssClass: 'custom_error_class',
    });
    toast.present();
  }

  async showSuccessToast(msg) {
    const toast = await this.toastController.create({
      message: msg,
      duration: 3000,
      color: 'success',
      position: 'bottom',
      cssClass: 'custom_success_class',
    });
    toast.present();
  }

  async showToast(msg, conut = 2000) {
    const toast = await this.toastController.create({
      message: msg,
      duration: conut,
      color: 'danger',
      position: 'bottom',
    });
    toast.present();
  }
}
