import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationExtras } from '@angular/router';
import { Constants, Role } from 'src/app/constant/constants';
import { EventsService } from 'src/app/services/events/events.service';
import { AlertController } from '@ionic/angular';
import { OfferStatus } from 'src/app/models/role-model';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { VtoService } from 'src/app/services/vto/vto.service';

@Component({
  selector: 'app-vto-request-detail',
  templateUrl: './vto-request-detail.page.html',
  styleUrls: ['./vto-request-detail.page.scss'],
})
export class VtoRequestDetailPage implements OnInit {
  public action: any;
  public VTOData: any;
  public myOffer: any;
  offerStatus = OfferStatus;
  role = Role;
  isConfirmed = false;
  public selectedtab: any;
  public detailsobj: any = {};
  roleTest = localStorage.getItem("role");

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public events: EventsService,
    public alertController: AlertController,
    private vtoService: VtoService,
    public utilityService: UtilityService,
    public activeRoute: ActivatedRoute
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.VTOData = JSON.parse(localStorage.getItem(Constants.VTO_DATA));
    console.log(this.VTOData);
  }

  goBack() {
    const selectedTab = localStorage.getItem('selected_tab');
    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: this.VTOData.action,
      },
      replaceUrl: true,
    };
    localStorage.setItem('selected_tab', selectedTab);
    this.events.publish('selected_tab', selectedTab);
    this.router.navigate(['tabs/vto-requests'], navigationExtras);
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

  acceptVtoOffer(offer){
    this.vtoService.acceptVtoRequestOffer(offer.offerId)
    .then(response => {
      if (response['Success']){
        this.utilityService.hideLoading();
          this.utilityService.showSuccessToast(
            Constants.VTO_REQUEST_PROCESS_SUCCESS_MSG
          );
          const navigationExtras: NavigationExtras = {
            queryParams: {
              action: this.VTOData.action,
            },
            replaceUrl: true,
          };
          if (this.VTOData.action === 'isAvailableOffer') {
            this.selectedtab = 'available_request';
          } else {
            this.selectedtab = 'my_request';
          }
          localStorage.setItem('selected_tab', this.selectedtab);
          this.events.publish('selected_tab', this.selectedtab);
          this.router.navigate(['/tabs/vto-requests'], navigationExtras);
      } else {
        this.utilityService.hideLoading();
        this.utilityService.showErrorToast(response['Message']);
      }
    })
  }

  delete(id) {
    this.isConfirmed = false;
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoading();
    this.vtoService.deleteOffer(id).then(
      (res) => {
        if (res['Success']) {
          this.utilityService.hideLoading();
          this.utilityService.showSuccessToast(
            Constants.OFFER_DELETE_SUCCESS_MSG
          );
          const navigationExtras: NavigationExtras = {
            queryParams: {
              action: this.VTOData.action,
            },
            replaceUrl: true,
          };
          if (this.VTOData.action === 'isAvailableOffer') {
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

  async openModal(data: any) {
    if (data) {
      this.myOffer = data;
    } else {
      this.myOffer = null;
    }
    localStorage.setItem(Constants.VTO_DATA, JSON.stringify(this.myOffer));
    const navigationExtras: NavigationExtras = {
      queryParams: {
        Offer: this.myOffer,
        action: 'edit',
      },
      replaceUrl: true
    };
    this.router.navigate(['tabs/add-vto-request'], navigationExtras);
  }
}
