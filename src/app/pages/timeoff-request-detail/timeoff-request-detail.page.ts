import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
import { Constants } from 'src/app/constant/constants';
import { OfferStatus } from 'src/app/models/role-model';
import { TimeOffService } from 'src/app/services/timeOff/time-off.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-timeoff-request-detail',
  templateUrl: './timeoff-request-detail.page.html',
  styleUrls: ['./timeoff-request-detail.page.scss'],
})
export class TimeoffRequestDetailPage implements OnInit {
  public timeOffData: any;
  offerStatus = OfferStatus;
  isConfirmed = false;
  public myOffer: any;
  public action: any;
  constructor(
    public router: Router,
    public timeOffService: TimeOffService,
    public alertController: AlertController,
    public utilityService: UtilityService,
    public modal: ModalController
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.timeOffData = JSON.parse(
      localStorage.getItem(Constants.TIME_OFF_DATA)
    );
    console.log(this.timeOffData);
  }
  async onClickDelete(data: any) {
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
            this.delete(data.TimeOffUserRequestId);
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
    this.timeOffService.deleteTimeOffRequest(id).then(
      (res) => {
        if (res['Success']) {
          this.utilityService.hideLoading();
          this.utilityService.showSuccessToast(
            Constants.TIME_OFF_REQ_DELETE_MSG
          );
          this.router.navigate(['tabs/time-off-requests']);
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
    localStorage.setItem(Constants.TIME_OFF_DATA, JSON.stringify(this.myOffer));
    const navigationExtras: NavigationExtras = {
      queryParams: {
        timeOffRequestModel: this.myOffer,
        action: 'edit',
      },
      replaceUrl: true
    };
    this.router.navigate(['tabs/add-timeoff-request'], navigationExtras);
  }

  goBack() {
    this.router.navigate(['tabs/time-off-requests']);
  }
}
