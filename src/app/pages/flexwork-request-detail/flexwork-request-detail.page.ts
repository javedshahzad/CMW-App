import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { Constants } from 'src/app/constant/constants';
import { OfferStatus } from 'src/app/models/role-model';
import { EventsService } from 'src/app/services/events/events.service';
import { FlexRequestService } from 'src/app/services/flexRequest/flex-request.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-flexwork-request-detail',
  templateUrl: './flexwork-request-detail.page.html',
  styleUrls: ['./flexwork-request-detail.page.scss'],
})
export class FlexworkRequestDetailPage implements OnInit {
  public FlexWorkData: any;
  offerStatus = OfferStatus;
  constructor(
    public router: Router,
    public events: EventsService,
    public alertController: AlertController,
    public utilityService: UtilityService,
    public flexService: FlexRequestService
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.FlexWorkData = JSON.parse(
      localStorage.getItem(Constants.FLEX_WORK_DATA)
    );
    console.log(this.FlexWorkData);
  }
  goBack() {
    const selectedTab = localStorage.getItem('selected_tab');
    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: this.FlexWorkData.action,
      },
      replaceUrl:true
    };
    localStorage.setItem('selected_tab', selectedTab);
    this.events.publish('selected_tab', selectedTab);
    this.router.navigate(['tabs/flex-work-requests'], navigationExtras);
  }
  async openModal(data) {
    console.log(data);
    const alert = await this.alertController.create({
      cssClass: 'delete-popo-up-class',
      message: ' <b>Are you sure you want to Accept ?</b>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {},
        },
        {
          text: 'Yes',
          role: 'accept',
          handler: () => {
            this.accept(data.offerId);
          },
        },
      ],
    });
    await alert.present();
  }
  accept(id) {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoadingwithoutDuration();
    this.flexService.acceptFlexOffer(id).then(
      (response) => {
        if (response['Success']) {
          this.utilityService.hideLoading();
          this.utilityService.showSuccessToast(
            Constants.FLEX_REQUEST_ACCEPT_SUCCESS_MSG
          );
          setTimeout(() => {
            const navigationExtras: NavigationExtras = {
              queryParams: {
                action: this.FlexWorkData.action,
              },
              replaceUrl:true
            };
            const selectedTab = localStorage.getItem('selected_tab');
            localStorage.setItem('selected_tab', selectedTab);
            this.events.publish('selected_tab', selectedTab);
            this.router.navigate(['tabs/flex-work-requests'], navigationExtras);
          }, 500);
        } else {
          this.utilityService.hideLoading();
          this.utilityService.showErrorToast(response['Message']);
        }
      },
      (err) => {}
    );
  }
}
