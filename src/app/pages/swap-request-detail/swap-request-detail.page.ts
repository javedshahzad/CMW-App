import { Component, ViewChild, OnInit, TemplateRef } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { OfferStatus } from 'src/app/models/role-model';
import { ModalController, AlertController } from '@ionic/angular';
import { TermsConditionPage } from '../terms-condition/terms-condition.page';
import { OfferService } from 'src/app/services/offer/offer.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { Constants } from 'src/app/constant/constants';
import { EventsService } from 'src/app/services/events/events.service';
import { Offer } from '../../models/offer.model';


@Component({
  selector: 'app-swap-request-detail',
  templateUrl: './swap-request-detail.page.html',
  styleUrls: ['./swap-request-detail.page.scss'],
})
export class SwapRequestDetailPage implements OnInit {
  @ViewChild('filterTextValue', { static: false }) filterTextValue;
  @ViewChild('template', { static: true }) input: TemplateRef<any>;
  public selectedtab: any;
  acceptOfferId: number;
  offerStatus = OfferStatus;
  myOffer: Offer;
  deleteId: string;
  isConfirmed = false;
  page: any;
  userId: number;
  public detailsobj: any = {};
  constructor(
    public alertController: AlertController,
    private events: EventsService,
    private utility: UtilityService,
    private offerService: OfferService,
    private modal: ModalController,
    public location: Location,
    public router: Router,
    public activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    if (this.activeRoute.snapshot.data['special']) {
      this.detailsobj = this.activeRoute.snapshot.data.special;
      console.log(this.detailsobj.acceptedBy);
    }

    console.log(this.activeRoute.snapshot.data['special']);
    if (this.isEmpty(this.detailsobj)) {
      if (localStorage.getItem('detail_obj')) {
        const details = localStorage.getItem('detail_obj');
        this.detailsobj = JSON.parse(details);
      }
    }
  }

  isEmpty(obj) {
    return Object.keys(obj).length === 0;
  }

  goBack() {
    const selectedTab = localStorage.getItem('selected_tab');

    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: this.detailsobj.action,
      },
    };

    localStorage.setItem('selected_tab', selectedTab);
    this.events.publish('selected_tab', selectedTab);
    this.router.navigate(['/tabs/swap-requests'], navigationExtras);
  }

  async openModalTerms(type: any, data: any) {
    this.acceptOfferId = data.offerId;
    const modal = await this.modal.create({
      component: TermsConditionPage,
      cssClass: 'terms_class',
      componentProps: {
        offerId: this.acceptOfferId,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        if (dataReturned.data !== undefined) {
          this.accept(dataReturned.data);
        }
      }
    });
    return await modal.present();
  }

  async openModal(data: any) {
    if (data) {
      this.myOffer = data;
    } else {
      this.myOffer = null;
    }
    localStorage.setItem(Constants.SWAP_DATA, JSON.stringify(this.myOffer));
    const navigationExtras: NavigationExtras = {
      queryParams: {
        offer: this.myOffer,
        action: 'edit',
      },
      replaceUrl: true,
    };
    this.router.navigate(['tabs/add-swap-request'], navigationExtras);
    // const modal = await this.modal.create({
    //   component: AddRequestSwapPage,
    //   cssClass: 'add-request-swap_class',
    //   componentProps: {
    //     'offer': this.myOffer
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
          },
        },
      ],
    });
    await alert.present();
  }

  delete(id) {
    this.isConfirmed = false;
    if (!navigator.onLine) {
      return this.utility.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utility.showLoading();
    this.offerService.deleteOffer(id).then(
      (res) => {
        if (res['Success']) {
          this.utility.hideLoading();
          this.utility.showSuccessToast(Constants.OFFER_DELETE_SUCCESS_MSG);
          const navigationExtras: NavigationExtras = {
            queryParams: {
              action: this.detailsobj.action,
            },
            replaceUrl: true,
          };
          if (this.detailsobj.action === 'isAvailableOffer') {
            this.selectedtab = 'available_request';
          } else {
            this.selectedtab = 'my_request';
          }
          localStorage.setItem('selected_tab', this.selectedtab);
          this.events.publish('selected_tab', this.selectedtab);
          this.router.navigate(['/tabs/swap-requests'], navigationExtras);
        } else {
          this.utility.hideLoading();
          this.utility.showErrorToast(res['Message']);
        }
      },
      (err) => {
        this.utility.hideLoading();
      }
    );
  }

  accept(id) {
    if (!navigator.onLine) {
      return this.utility.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utility.showLoading();
    this.offerService.acceptOffer(id).then(
      (res) => {
        if (res['Success']) {
          this.utility.hideLoading();
          // this.toaster.success(Constants.OFFER_ACCEPT_MSG);
          this.utility.showSuccessToast(Constants.OFFER_ACCEPT_MSG);
          this.selectedtab = 'available_request';
          localStorage.setItem('selected_tab', this.selectedtab);
          this.events.publish('selected_tab', this.selectedtab);
          const navigationExtras: NavigationExtras = {
            queryParams: {
              action: 'isAvailableOffer',
            },
            replaceUrl: true
          };
          this.router.navigate(['/tabs/swap-requests'], navigationExtras);
        } else {
          this.utility.hideLoading();
          this.utility.showErrorToast(res['Message']);
        }
      },
      (err) => {
        this.utility.hideLoading();
      }
    );
  }
}
