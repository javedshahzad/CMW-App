import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { OfferService } from 'src/app/services/offer/offer.service';
import { Constants } from 'src/app/constant/constants';
import { Offer } from 'src/app/models/offer.model';
import { OfferStatus } from 'src/app/models/role-model';
import { AlertController } from '@ionic/angular';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { EventsService } from 'src/app/services/events/events.service';
@Component({
  selector: 'app-time-punch-detail',
  templateUrl: './time-punch-detail.page.html',
  styleUrls: ['./time-punch-detail.page.scss'],
})
export class TimePunchDetailPage implements OnInit {
  public timePunchdata: any;
  offerStatus = OfferStatus;
  isConfirmed = false;
  public myOffer: any;
  @Input() Offer: Offer;
  public selectedtab: any;

  constructor(private router: Router,
    public offerService: OfferService,
    public alertController: AlertController,
    public utilityService: UtilityService,
    public events: EventsService) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.timePunchdata = JSON.parse(localStorage.getItem(Constants.TIME_PUNCH_DATA));
    console.log(this.timePunchdata);
  }

  goBack() {
    this.router.navigate(['/tabs/edited-time-punch']);
  }

  async openModal(data: any) {
    if (data) {
      this.myOffer = data;
    } else {
      this.myOffer = null;
    }
    localStorage.setItem(
      Constants.TIME_PUNCH_DATA,
      JSON.stringify(this.myOffer)
    );
    const navigationExtras: NavigationExtras = {
      queryParams: {
        Offer: this.myOffer,
        action: 'edit'
      },
      replaceUrl: true,
    };
    this.router.navigate(['tabs/add-time-punch'], navigationExtras);
  }

  async onClickDelete(data: any) {
    console.log("abc",data);
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
            this.delete(data.id);
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
          const navigationExtras: NavigationExtras = {
            queryParams: {
              action: this.timePunchdata.action,
            },
            replaceUrl: true,
          };
          if (this.timePunchdata.action === 'isAvailableOffer') {
            this.selectedtab = 'available_request';
          } else {
            this.selectedtab = 'my_request';
          }
          localStorage.setItem('selected_tab', this.selectedtab);
          this.events.publish('selected_tab', this.selectedtab);
          this.router.navigate(['/tabs/vto-requests'], navigationExtras);
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
}
