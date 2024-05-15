import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { Constants, SubscriptionType } from 'src/app/constant/constants';
import { OfferStatus } from 'src/app/models/role-model';
import { AlertController } from '@ionic/angular';
import { OfferService } from '../../services/offer/offer.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { Offer } from '../../models/offer.model';
import { CallInRequestService } from 'src/app/services/call-in-request/call-in-request.service';

@Component({
  selector: 'app-vot-request-detail',
  templateUrl: './vot-request-detail.page.html',
  styleUrls: ['./vot-request-detail.page.scss'],
})
export class VotRequestDetailPage implements OnInit {
  public votData: any;
  offerStatus = OfferStatus;
  isConfirmed = false;
  myOffer: Offer;
  public HourLate: any = {};
  public HourEarly: any = {};
  subscriptionType = SubscriptionType;
  public settingList: any = [];
  public moduleId: any;
  companyId;
  constructor(
    public alertController: AlertController,
    public router: Router,
    private offerService: OfferService,
    private utilityService: UtilityService,
    private callInRequstService: CallInRequestService,
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.votData = JSON.parse(localStorage.getItem(Constants.VOT_DATA));
    console.log(this.votData);
    this.companyId = localStorage.getItem(Constants.COMPANYID);
    await this.getSettingByCompanyID();
  }
  goBack() {
    this.router.navigate(['tabs/vot-requests']);
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
          this.router.navigate(['tabs/vot-requests']);
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
    localStorage.setItem(Constants.VOT_DATA, JSON.stringify(this.myOffer));
    const navigationExtras: NavigationExtras = {
      queryParams: {
        offer: this.myOffer,
        action: 'edit',
      },
      replaceUrl:true
    };
    this.router.navigate(['tabs/add-vot-request'], navigationExtras);
  }

  async getSettingByCompanyID() {
    let that = this;
    let module = SubscriptionType.filter((item) => {
      return item.value === 'VOT Request Module';
    });
    this.moduleId = module[0].id;
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }

    await this.callInRequstService
      .getSettingByCompanyID(this.moduleId, this.companyId)
      .then(
        async (res: any) => {
          if (res['Success']) {
            that.settingList = res.Data;

            console.log(that.settingList);
            if (that.settingList.length > 0) {
              that.settingList.map((item) => {
                if (item.SettingType === 'Hour Early') {
                  item.Name = 'An Hour Early';
                  that.HourEarly = item;
                } else if (item.SettingType === 'Hour Late') {
                  item.Name = 'An Hour Late';
                  that.HourLate = item;
                }
              });
            }
          } else {
            that.settingList = [];
          }
        },
        (err) => {
          that.settingList = [];
        }
      );
  }
}
