import { Component, OnInit } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { Constants } from 'src/app/constant/constants';
import { OfferStatus, Role } from 'src/app/models/role-model';
import { OfferService } from 'src/app/services/offer/offer.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { Offer } from '../../models/offer.model';

@Component({
  selector: 'app-callin-request-detail',
  templateUrl: './callin-request-detail.page.html',
  styleUrls: ['./callin-request-detail.page.scss'],
})
export class CallinRequestDetailPage implements OnInit {
  public CallinData: any;
  UpdatedCallinData: any;
  dataIsUpdated: boolean;
  offerStatus = OfferStatus;
  totalItems: any;
  myOffer: Offer;
  rowsOnPage = Constants.ROWS_ON_PAGE;
  currentPage = Constants.CURRENT_PAGE;
  page: any;
  deleteId: string;
  role: number;
  roleEnum = Role;
  searchSort: any;
  columns = [];
  isShowLink = false;
  requestType: any;
  totalApprovedHours = 0;
  totalDeniedHours = 0;
  shiftList = [];
  departmentList = [];
  filterValue = [];
  companyId: number;
  isConfirmed = false;
  IsCoverMyWork = false;
  constructor(
    public router: Router,
    public alertController: AlertController,
    private modal: ModalController,
    public utilityService: UtilityService,
    public offerService: OfferService
  ) {
    this.IsCoverMyWork =
      localStorage.getItem(Constants.APP_NAME) === 'CoverMyWork' ? true : false;
  }

  ngOnInit() {}
  ionViewWillEnter() {
    this.CallinData = JSON.parse(localStorage.getItem(Constants.CALL_IN_DATA));
  }

  async openModal(data: any) {
    if (data) {
      this.myOffer = data;
    } else {
      this.myOffer = null;
    }
    localStorage.setItem(Constants.CALL_IN_DATA, JSON.stringify(this.myOffer));
    const navigationExtras: NavigationExtras = {
      queryParams: {
        offer: this.myOffer,
        action: 'edit',
      },
      replaceUrl: true,
    };
    this.router.navigate(['tabs/add-edit-call-in-request'], navigationExtras);
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
          this.router.navigate(['tabs/call-in-requests']);
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
  goBack() {
    this.router.navigate(['tabs/call-in-requests']);
  }
}
