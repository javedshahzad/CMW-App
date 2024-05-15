import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Constants } from 'src/app/constant/constants';
import { Role } from 'src/app/models/role-model';
import { ClockInOutService } from 'src/app/services/clock-in-out.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { ClockInOutFilterPage } from 'src/app/pages/clock-in-out-filter/clock-in-out-filter.page';
import { AvailableLocationsPage } from '../available-locations/available-locations.page';

@Component({
  selector: 'app-clock-in-out-request',
  templateUrl: './clock-in-out-request.page.html',
  styleUrls: ['./clock-in-out-request.page.scss'],
})
export class ClockInOutRequestPage implements OnInit {
  @ViewChild('filterTextValue', { static: false }) filterTextValue;
  @ViewChild('punchInDate', { static: false }) punchInDate;
  @ViewChild('punchEndDate', { static: false }) punchEndDate;
  @ViewChild('complianceValue', { static: false }) complianceValue;
  public searchfield: any;
  public loadmore = false;
  rowsOnPage = Constants.ROWS_ON_PAGE;
  currentPage = Constants.CURRENT_PAGE;
  page: any;
  deleteId: string;
  role: number;
  roleEnum = Role;
  searchSort: any;
  userId = Number(localStorage.getItem(Constants.USERID));
  columns = [];
  clockInOutRequest = [];
  dataReturned: any;
  filterValue = [];
  locationUrl: any;
  pageNo: any;
  totalClockInOutRequests: any;
  oldData = [];
  meter;
  constructor(
    public router: Router,
    public utilityService: UtilityService,
    public clockInOutServic: ClockInOutService,
    public modalController: ModalController
  ) { }

  ngOnInit() { }
  ionViewWillEnter() {
    this.columns = [
      'PunchTime',
      'ComplianceStr',
      'PunchTypeStr',
      'PunchLocationStr',
      'SourceStr',
    ];
    this.page = {
      pageNumber: 0,
      size: this.rowsOnPage,
    };
    this.userId = Number(localStorage.getItem(Constants.USERID));
    this.setPage({ offset: 0 });
  }

  goBack() {
    this.router.navigate(['tabs/clock-in-out']);
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.clockInOutRequest = [];
    this.oldData = [];
    this.getClockInOutList(this.page.pageNumber + 1, this.userId);
  }

  getClockInOutList(currentPage, userId) {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoadingwithoutDuration();
    const getMethod = this.clockInOutServic.getClockInOutRequestList(
      currentPage,
      userId
    );
    getMethod.then(
      (res: any) => {
        if (res['Success']) {
          this.clockInOutRequest = res.Data.results;

          this.pageNo = res['Data'].pageNumber
          for (var i = 0; i <= this.clockInOutRequest.length - 1; i++) {
            this.oldData.push(this.clockInOutRequest[i]);
          }
          this.totalClockInOutRequests =
            res['Data'].totalNumberOfRecords === 0
              ? undefined
              : res['Data'].totalNumberOfRecords;
          if (currentPage < res['Data'].totalNumberOfPages) {
            this.loadmore = true;
            this.clockInOutRequest = this.oldData;
          } else {
            this.loadmore = false;
            this.clockInOutRequest = this.oldData;
          }
          // for (let i = 0; i < res.Data.results.length; i++) {
          //   if (parseInt(res.Data.results[i].FeetStr) > 1000) {
          //     this.meter = res.Data.results[i].MileStr;
          //   } else {
          //     this.meter = res.Data.results[i].FeetStr;
          //   }
          // }
        }
        else {
          this.clockInOutRequest = [];
          this.loadmore = false;
        }
        this.utilityService.hideLoading();
      },
      (err) => {
        this.utilityService.hideLoading();
        this.clockInOutRequest = [];
      }
    );
  }
  getDistance(data) {
    if (!!data.FeetStr && parseInt(data.FeetStr.split(' ')[0]) > 1000) {
      return data.MileStr;
    }
    return data.FeetStr;
  }
  async openCardModal() {
    const modal = await this.modalController.create({
      component: ClockInOutFilterPage,
      componentProps: { clockInOutRequest: this.clockInOutRequest },
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned && dataReturned.data !== null) {
        this.clockInOutRequest = dataReturned.data;
      }
    });
    return await modal.present();
  }

  loadData(event) {
    setTimeout(() => {
      if (this.clockInOutRequest.length > 0) {
        // this.page.pageNumber += 1;
        console.log('page no', this.page.pageNumber);
        this.pageNo += 1
        this.getClockInOutList(this.pageNo, this.userId);

        event.target.complete();
      }
    }, 100);
  }

  goToMap(geoLocation) {
    this.openAvaliableLocationModal(geoLocation);
  }

  async openAvaliableLocationModal(geoLocation) {
    const modal = await this.modalController.create({
      component: AvailableLocationsPage,
      cssClass: 'terms_class',
      componentProps: {
        locationDetail: geoLocation,
      },
    });
    return await modal.present();
  }
  addPunch() {
    this.router.navigate(['/tabs/add-time-punch']);
  }

  viewPunches() {
    this.router.navigate([`/tabs/edited-time-punch`]);
  }

  goToClockIn(punchDetail: any) {
    localStorage.setItem(Constants.TIME_PUNCH_DATA, JSON.stringify(punchDetail));
    this.router.navigate([`/tabs/clock-in-out-detail`]);
  }
}
