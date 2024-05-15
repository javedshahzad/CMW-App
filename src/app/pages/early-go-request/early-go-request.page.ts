import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { Constants } from 'src/app/constant/constants';
import { OfferStatus, Role } from 'src/app/models/role-model';
import { EarlyOutService } from 'src/app/services/earlyOut/early-out.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-early-go-request',
  templateUrl: './early-go-request.page.html',
  styleUrls: ['./early-go-request.page.scss'],
})
export class EarlyGoRequestPage implements OnInit {
  // public earlyList:any=[];
  @ViewChild('filterTextValue', { static: false }) filterTextValue;
  offerStatus = OfferStatus;
  public myOffer: any;
  totalItems: any;
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
  userId: number;
  isConfirmed = false;
  totalRequestedHours = 0;
  public callInRequestList: any = [];
  public isData: boolean;
  public loadmore = false;
  public moduleId: any;
  public settingList: any = [];
  public paidTimeOff: any = {};
  public flma: any = {};
  IsCoverMyWork = false;
  public searchfield: any;
  public earlyOutRequestList: any = [];
  constructor(
    public router: Router,
    public modal: ModalController,
    private datePipe: DatePipe,
    public earlyOutService: EarlyOutService,
    public utilityService: UtilityService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    this.columns = [
      'createdByObj.name',
      'dateToSkipShortDate',
      'vtoStartTime',
      'uTOHours',
      'ReasonObj.name',
      'offerStatusStr',
      'VtoStartTime12Hours',
      'processedByObj.name',
      "depatureTime"
    ];
    this.page = {
      pageNumber: 0,
      size: this.rowsOnPage,
    };
    this.searchSort = {
      Page: this.page.pageNumber + 1,
      PageSize: Constants.ROWS_ON_PAGE,
      Columns: [],
      Search: {
        Value: '',
        ColumnNameList: [],
        Regex: 'string',
      },
      Order: [
        {
          Column: 0,
          ColumnName: '',
          Dir: 'asc',
        },
      ],
    };
    this.IsCoverMyWork =
      localStorage.getItem(Constants.APP_NAME) === 'CoverMyWork' ? true : false;

    this.userId = Number(localStorage.getItem(Constants.USERID));
    this.isConfirmed = false;
    this.role = Number(localStorage.getItem(Constants.ROLE));
    this.companyId = Number(localStorage.getItem(Constants.COMPANYID));
    this.searchfield = '';
    this.setPage({ offset: 0 });
  }
  async setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    await this.getEarlyList(this.page.pageNumber + 1);
  }
  async getEarlyList(currentPage: any) {
    if (!!this.filterTextValue) {
      this.searchSort.Search.Value = this.filterTextValue;
      this.searchSort.Search.ColumnNameList = this.columns;
      this.searchSort.Page = currentPage;
      await this.filterData();
    } else {
      if (!navigator.onLine) {
        return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      }
      this.utilityService.showLoadingwithoutDuration();
      const getMethod =
        this.role === this.roleEnum.manager
          ? this.earlyOutService.getEarlyOutClosedManagerRequestList(
              currentPage,
              this.rowsOnPage
            )
          : this.earlyOutService.getEarlyOutRequestList(
              currentPage,
              this.rowsOnPage
            );
      await getMethod.then(
        (res: any) => {
          if (res['Success']) {
            if (res.Data && res.Data.results.length > 0) {
              this.earlyOutRequestList = res.Data.results;
              if (res.Data.results) {
                this.isData = true;
              }
              if (this.earlyOutRequestList.length > Constants.ROWS_ON_PAGE) {
                this.loadmore = true;
              } else {
                this.loadmore = false;
              }
              this.totalItems =
                res.Data.totalNumberOfRecords === 0
                  ? undefined
                  : res.Data.totalNumberOfRecords;
              for (var i = 0; i < this.earlyOutRequestList.length; i++) {
                this.earlyOutRequestList[i].startTimeToShow = moment(
                  this.earlyOutRequestList[i].vtoStartTime,
                  'HH:mm:ss A'
                ).format('hh:mm A');
                this.earlyOutRequestList[i].endTimeToShow = moment(
                  this.earlyOutRequestList[i].vtoEndTime,
                  'HH:mm:ss A'
                ).format('hh:mm A');
                if (
                  this.earlyOutRequestList[i].status == this.offerStatus.proceed
                ) {
                  this.earlyOutRequestList[i].statusClass = 'success';
                } else if (
                  this.earlyOutRequestList[i].status ==
                  this.offerStatus.pendingProceed
                ) {
                  this.earlyOutRequestList[i].statusClass = 'danger';
                } else if (
                  this.earlyOutRequestList[i].status ==
                  this.offerStatus.hrApproval
                ) {
                  this.earlyOutRequestList[i].statusClass = 'danger';
                }
              }
            } else {
              this.earlyOutRequestList = [];
              this.totalItems = undefined;
            }
          } else {
            this.earlyOutRequestList = [];
            this.totalItems = undefined;
          }
          this.utilityService.hideLoading();
        },
        (err) => {
          this.utilityService.hideLoading();
          this.earlyOutRequestList = [];
          this.totalItems = undefined;
        }
      );
    }
  }
  async filterData() {
    this.utilityService.showLoadingwithoutDuration();

    const filterMethod =
      this.role === this.roleEnum.user
        ? this.earlyOutService.userEarltyOutOfferDataFilter(this.searchSort)
        : this.earlyOutService.managerClosedEarltyOutOfferDataFilter(
            this.searchSort
          );
    await filterMethod.then(
      (res) => {
        if (res['data'] && res['data'].length > 0) {
          this.earlyOutRequestList = res['data'];
          this.totalItems =
            res['recordsFiltered'] === 0 ? undefined : res['recordsFiltered'];
          for (var i = 0; i < this.earlyOutRequestList.length; i++) {
            if (
              this.earlyOutRequestList[i].status == this.offerStatus.proceed
            ) {
              this.earlyOutRequestList[i].statusClass = 'success';
            } else if (
              this.earlyOutRequestList[i].status ==
              this.offerStatus.pendingProceed
            ) {
              this.earlyOutRequestList[i].statusClass = 'primary';
            } else if (
              this.earlyOutRequestList[i].status == this.offerStatus.hrApproval
            ) {
              this.earlyOutRequestList[i].statusClass = 'info';
            }
          }
          this.utilityService.hideLoading();
        } else {
          this.totalItems = undefined;
          this.earlyOutRequestList = [];
          this.utilityService.hideLoading();
        }
      },
      (err) => {
        this.earlyOutRequestList = [];
        this.totalItems = undefined;
        this.utilityService.hideLoading();
      }
    );
  }
  async searchRequest(event) {
    this.filterTextValue = event.detail.value;
    await this.getEarlyList(this.page.pageNumber);
  }
  loadData(event) {
    setTimeout(async () => {
      if (this.earlyOutRequestList.length > 0) {
        // if (!this.loadmore) {
        //   event.target.disabled = true;
        // }
        this.page.pageNumber += 1;
        console.log('page no', this.page.pageNumber);
        await this.getEarlyList(this.page.pageNumber);
        event.target.complete();
      }
    }, 100);
  }

  goToEarlyDetail(earlyDetail: any) {
    localStorage.setItem(Constants.EARLY_OUT_DATA, JSON.stringify(earlyDetail));
    this.router.navigate(['tabs/earlygo-request-detail']);
  }
  goBack() {
    this.router.navigate(['/tabs/my-requests']);
  }
  async openearlyRequests(data: any) {
    // const modal = await this.modal.create({
    //   component: AddEditEarlyGoRequestPage,
    //   cssClass:'add-request-swap_class',
    //   componentProps: {
    //     'model_type': data
    //   }
    // });
    // modal.onDidDismiss().then((dataReturned) => {
    //   if (dataReturned !== null) {
    //     if (dataReturned.data != undefined) {
    //       console.log(dataReturned.data);
    //       this.getEarlyList(this.page.pageNumber);
    //     }
    //   }
    // });
    // return await modal.present();
    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: 'add',
      },
      replaceUrl: true,
    };
    this.router.navigate(['tabs/add-edit-early-go-request'], navigationExtras);
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
        dateToSkipDD ,
        dateToSkipHH,
        dateToSkipMin
      ),
      'MM/dd/yyyy hh:mm a'
    );
  }
}
