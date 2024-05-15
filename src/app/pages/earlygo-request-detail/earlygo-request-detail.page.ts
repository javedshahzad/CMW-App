import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Constants } from 'src/app/constant/constants';
import { OfferStatus } from 'src/app/models/role-model';
import { OfferService } from 'src/app/services/offer/offer.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-earlygo-request-detail',
  templateUrl: './earlygo-request-detail.page.html',
  styleUrls: ['./earlygo-request-detail.page.scss'],
})
export class EarlygoRequestDetailPage implements OnInit {
  public EarlyOutData: any;
  offerStatus = OfferStatus;
  isConfirmed = false;
  public myOffer: any;
  constructor(
    public router: Router,
    public alertController: AlertController,
    public utilityService: UtilityService,
    public offerService: OfferService,
    public modal: ModalController,
    private datePipe: DatePipe
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.EarlyOutData = JSON.parse(
      localStorage.getItem(Constants.EARLY_OUT_DATA)
    );
    console.log(this.EarlyOutData);
  }

  async onClickDelete(data: any) {
    console.log(data);
    const alert = await this.alertController.create({
      cssClass: 'delete-popo-up-class',
      message: ' <b>Are you sure you want to Delete ?</b>',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('cancel');
          },
        },
        {
          text: 'Yes',
          role: 'delete()',
          handler: () => {
            this.delete(data.offerId);
            this.isConfirmed = true;
          },
        },
      ],
    });
    await alert.present();
  }

  delete(id) {
    this.isConfirmed = false;
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoadingwithoutDuration();
    this.offerService.deleteOffer(id).then(
      (res) => {
        if (res['Success']) {
          this.utilityService.hideLoading();
          this.utilityService.showSuccessToast(
            Constants.OFFER_DELETE_SUCCESS_MSG
          );
          //this.setPage({ offset: 0 });
          this.router.navigate(['tabs/early-go-requests']);
        } else {
          this.utilityService.hideLoading();
          this.utilityService.showErrorToast(res['Message']);
        }
      },
      (err) => {
        this.utilityService.hideLoading();
      }
    );
  }
  async openModal(data: any) {
    if (data) {
      this.myOffer = data;
    } else {
      this.myOffer = null;
    }
    localStorage.setItem(
      Constants.EARLY_OUT_DATA,
      JSON.stringify(this.myOffer)
    );
    const navigationExtras: NavigationExtras = {
      queryParams: {
        Offer: this.myOffer,
        action: 'edit'
      },
      replaceUrl: true,
    };
    this.router.navigate(['tabs/add-edit-early-go-request'], navigationExtras);
    // const modal = await this.modal.create({
    //   component: AddEditEarlyGoRequestPage,
    //   cssClass: 'add-request-swap_class',
    //   componentProps: {
    //     'Offer': this.myOffer
    //   }
    // });
    // // modal.onDidDismiss().then((dataReturned) => {
    // //   if (dataReturned !== null) {
    // //     if (dataReturned.data != undefined) {
    // //       this.accept(dataReturned.data)
    // //     }
    // //   }
    // // });
    // return await modal.present();
  }
  goBack() {
    this.router.navigate(['tabs/early-go-requests']);
  }
  convertDateToSkipShortDate(record) {
    const date = record.dateToSkipShortDate.split('/');
    const vtoStartTime = record.vtoStartTime.split(':');
    const dateToSkipHH = vtoStartTime[0];
    const dateToSkipMin = vtoStartTime[1];
    const dateToSkipMM = parseInt(date[0]);
    const dateToSkipDD = parseInt(date[1]);
    const dateToSkipYYYY = parseInt(date[2]);
    // if (record.IsDateCrossOver) {
    //   return this.datePipe.transform(
    //     new Date(
    //       dateToSkipYYYY,
    //       dateToSkipMM - 1,
    //       dateToSkipDD - 1,
    //       dateToSkipHH,
    //       dateToSkipMin
    //     ),
    //     'MM/dd/yyyy hh:mm a'
    //   );
    // }
    return this.datePipe.transform(
      new Date(
        dateToSkipYYYY,
        dateToSkipMM - 1,
        dateToSkipDD,
        dateToSkipHH,
        dateToSkipMin
      ),
      'MM/dd/yyyy hh:mm a'
    );
  }
}
