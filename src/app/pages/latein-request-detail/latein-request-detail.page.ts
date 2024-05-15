import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Constants } from 'src/app/constant/constants';
import { OfferStatus } from 'src/app/models/role-model';
import { OfferService } from 'src/app/services/offer/offer.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-latein-request-detail',
  templateUrl: './latein-request-detail.page.html',
  styleUrls: ['./latein-request-detail.page.scss'],
})
export class LateinRequestDetailPage implements OnInit {
  public LateInData: any;
  offerStatus = OfferStatus;
  isConfirmed = false;
  public myOffer: any;
  constructor(
    public router: Router,
    public alertController: AlertController,
    public utilityService: UtilityService,
    public offerService: OfferService,
    public modal: ModalController
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.LateInData = JSON.parse(localStorage.getItem(Constants.LATE_IN_DATA));
    console.log(this.LateInData);
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
    this.utilityService.showLoading();
    this.offerService.deleteOffer(id).then(
      (res) => {
        if (res['Success']) {
          this.utilityService.hideLoading();
          this.utilityService.showSuccessToast(
            Constants.OFFER_DELETE_SUCCESS_MSG
          );
          //this.setPage({ offset: 0 });
          this.router.navigate(['tabs/late-in-request']);
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
    localStorage.setItem(Constants.LATE_IN_DATA, JSON.stringify(this.myOffer));
    const navigationExtras: NavigationExtras = {
      queryParams: {
        Offer: this.myOffer,
        action: 'edit',
      },
      replaceUrl: true,
    };
    this.router.navigate(['tabs/add-edit-late-in-request'], navigationExtras);
  }
  goBack() {
    this.router.navigate(['tabs/late-in-request']);
  }
}
