import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, IonItemSliding } from '@ionic/angular';
import * as moment from 'moment';
import { Constants } from 'src/app/constant/constants';
import { Offer } from 'src/app/models/offer.model';
import { OfferStatus, Role } from 'src/app/models/role-model';
import { FlexRequestService } from 'src/app/services/flexRequest/flex-request.service';
import { OfferService } from 'src/app/services/offer/offer.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
@Component({
  selector: 'app-flex-work-request',
  templateUrl: './flex-work-request.page.html',
  styleUrls: ['./flex-work-request.page.scss'],
})
export class FlexWorkRequestPage implements OnInit {
  offerStatus = OfferStatus;
  @ViewChild('filterTextValue', { static: false }) filterTextValue;
  @ViewChild(IonItemSliding) slidingItem: IonItemSliding;
  public action: any;
  public isData: boolean;
  public loadmore = false;
  selected = [];
  allRowsSelected = [];
  selectedRecords = [];
  flexRequestList = [];
  totalItems: any;
  rowsOnPage = Constants.ROWS_ON_PAGE;
  currentPage = Constants.CURRENT_PAGE;
  page: any;
  columns = [];
  searchSort: any;
  role: number;
  roleEnum = Role;
  companyId: number;
  today = new Date();
  nextweekDate = new Date(this.today.getTime() + 7 * 24 * 60 * 60 * 1000);
  nextDate: any;
  searchDate: any;
  filterValue = [];
  shiftList = [];
  departmentList = [];
  statusList = [
    { id: 4, name: 'Available' },
    { id: 7, name: 'Accepted' },
  ];
  deleteId: string;
  isConfirmed = false;
  flexOffer: Offer;
  showAllCheckbox = false;
  public searchfield: any;
  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public flexService: FlexRequestService,
    public utilityService: UtilityService,
    private datepipe: DatePipe,
    public alertController: AlertController,
    public offerService: OfferService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.action = params.action;
    });
  }

  ngOnInit() {}
  ionViewWillEnter() {
    if (this.action === 'isRequestedOffer') {
      this.columns = [
        'departmentId',
        'dateToSkip',
        'shiftToSkip',
        'departmentName',
        'offerStatusStr',
        'dateToSkipShortDate',
        'timeTypeStr',
        'FlexWorkType',
        'vtoStartTime',
        'vtoEndTime',
        'FlexTypestr',
        'createdByUsername',
        'acceptedByUsername',
        'approvedByObj.companyUsername',
        'acceptedByShift',
        'shiftToSkipTitle',
        'processedByObj.companyUsername',
      ];
    } else {
      this.columns = [
        'departmentId',
        'dateToSkip',
        'shiftToSkip',
        'status',
        'departmentName',
        'FlexTypestr',
        'dateToSkipShortDate',
        'vtoStartTime',
        'vtoEndTime',
        'vtoCount',
        'createdByUsername',
        'offerStatusStr',
        'timeTypeStr',
      ];
    }
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
    this.role = Number(localStorage.getItem(Constants.ROLE));
    this.companyId = Number(localStorage.getItem(Constants.COMPANYID));
    this.searchfield = '';
    this.flexRequestList = [];
    this.setPage({ offset: 0 });
  }
  async setPage(pageInfo) {
    this.selected = [];
    this.selectedRecords = [];
    this.page.pageNumber = pageInfo.offset;
    if (this.action === 'isRequestedOffer') {
      await this.getMyflexList(this.page.pageNumber + 1);
    } else {
      await this.getFlexWorkList(this.page.pageNumber + 1);
    }
  }
  async searchRequest(event) {
    this.filterTextValue = event.detail.value;
    if (this.action === 'isRequestedOffer') {
      await this.getMyflexList(this.page.pageNumber + 1);
    } else {
      await this.getFlexWorkList(this.page.pageNumber + 1);
    }
  }
  goToFlexDetail(flexDetail: any) {
    flexDetail.action = this.action;
    localStorage.setItem(Constants.FLEX_WORK_DATA, JSON.stringify(flexDetail));
    this.router.navigate(['tabs/flexwork-request-detail']);
  }
  goBack() {
    const selectedTab = localStorage.getItem('selected_tab');
    if (selectedTab === 'my_request') {
      this.router.navigate(['/tabs/my-requests']);
    } else {
      this.router.navigate(['/tabs/available-requests']);
    }
  }
  public async getFlexWorkList(currentPage) {
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
      this.nextDate = this.datepipe.transform(
        this.setnewDate(this.nextweekDate),
        'yyyy-MM-dd'
      );
      const getMehod =
        this.role === this.roleEnum.hrAdmin
          ? this.flexService.getHrAdminAvailableFlexRequestList(
              currentPage,
              this.rowsOnPage,
              this.nextDate
            )
          : this.flexService.getAvailableFlexRequestList(
              currentPage,
              this.rowsOnPage,
              this.companyId
            );
      await getMehod.then(
        (res: any) => {
          // if (JSON.parse(localStorage.getItem(Constants.IS_TERMS_UPDATE))) {
          //   this.utilityService.showLoading();
          // }
          if (res['Success']) {
            this.flexRequestList = res.Data.results;
            if (this.flexRequestList.length > Constants.ROWS_ON_PAGE) {
              this.loadmore = true;
            } else {
              this.loadmore = false;
            }
            this.totalItems =
              res.Data.totalNumberOfRecords === 0
                ? undefined
                : res.Data.totalNumberOfRecords;
            this.showAllCheckbox = this.flexRequestList.some(
              (x) => x.status === this.offerStatus.accepted
            );
            this.getTimings(this.flexRequestList);
          } else {
            this.flexRequestList = [];
            this.totalItems = undefined;
          }
          this.utilityService.hideLoading();
        },
        (err) => {
          this.flexRequestList = [];
          this.utilityService.hideLoading();
        }
      );
    }
  }
  public async getMyflexList(currentPage) {
    if (!!this.filterTextValue) {
      this.searchSort.Search.Value = this.filterTextValue;
      this.searchSort.Search.ColumnNameList = this.columns;
      this.searchSort.Page = currentPage;
      await this.filterData();
    } else {
      if (!navigator.onLine) {
        return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      } else {
        this.utilityService.showLoadingwithoutDuration();
        if (this.role === this.roleEnum.hrAdmin) {
          this.nextDate = this.datepipe.transform(
            this.setnewDate(this.nextweekDate),
            'yyyy-MM-dd'
          );
        } else {
          this.nextDate = null;
        }
        await this.flexService
          .getMyFlexRequestList(currentPage, this.rowsOnPage, this.nextDate)
          .then(
            (res: any) => {
              if (res['Success']) {
                this.flexRequestList = res.Data.results;
                if (this.flexRequestList.length > Constants.ROWS_ON_PAGE) {
                  this.loadmore = true;
                } else {
                  this.loadmore = false;
                }
                this.getTimings(this.flexRequestList);
                this.totalItems =
                  res.Data.totalNumberOfRecords === 0
                    ? undefined
                    : res.Data.totalNumberOfRecords;
              } else {
                this.flexRequestList = [];
                this.totalItems = undefined;
              }
              this.utilityService.hideLoading();
            },
            (err) => {
              this.flexRequestList = [];
              this.utilityService.hideLoading();
            }
          );
      }
    }
  }
  getTimings(list: any) {
    for (var i = 0; i < list.length; i++) {
      list[i].startTimeToShow = moment(
        list[i].vtoStartTime,
        'HH:mm:ss A'
      ).format('hh:mm A');
      list[i].endTimeToShow = moment(list[i].vtoEndTime, 'HH:mm:ss A').format(
        'hh:mm A'
      );
      if (list[i].status == this.offerStatus.accepted) {
        list[i].statusClass = 'success';
      } else if (
        list[i].status == this.offerStatus.pendingProceed ||
        list[i].status == this.offerStatus.proceed
      ) {
        list[i].statusClass = 'primary';
      } else if (list[i].status == this.offerStatus.available) {
        list[i].statusClass = 'info';
      } else if (list[i].status == this.offerStatus.expired) {
        list[i].statusClass = 'danger';
      }
    }
  }
  setnewDate(date) {
    const dateObj = {
      year: +this.datepipe.transform(date, 'yyyy'),
      month: +this.datepipe.transform(date, 'MM'),
      day: +this.datepipe.transform(date, 'dd'),
    };
    return new Date(dateObj['year'], dateObj['month'] - 1, dateObj['day']);
  }
  async filterData() {
    let filterMethod;
    this.utilityService.showLoadingwithoutDuration();
    if (this.action !== 'isRequestedOffer') {
      filterMethod =
        this.role === this.roleEnum.hrAdmin
          ? this.flexService.flexHrAdminrAvailableRequestDataFilter(
              this.searchSort,
              this.role === this.roleEnum.hrAdmin
                ? !!this.searchDate
                  ? this.searchDate
                  : this.nextDate
                : this.nextDate
            )
          : this.flexService.flexAvailableRequestOfferDataFilter(
              this.searchSort
            );
    } else {
      filterMethod = this.flexService.flexRequestOfferDataFilter(
        this.searchSort,
        this.role === this.roleEnum.hrAdmin
          ? !!this.searchDate
            ? this.searchDate
            : this.nextDate
          : null
      );
    }
    await filterMethod.then(
      (res) => {
        if (res['data'] && res['data'].length > 0) {
          this.flexRequestList = res['data'];
          this.getTimings(this.flexRequestList);
          this.totalItems =
            res['recordsFiltered'] === 0 ? undefined : res['recordsFiltered'];
          this.showAllCheckbox = this.flexRequestList.some(
            (x) => x.status === this.offerStatus.accepted
          );
        } else {
          this.flexRequestList = [];
          this.totalItems = undefined;
        }
        this.utilityService.hideLoading();
      },
      (err) => {
        this.flexRequestList = [];
        this.totalItems = undefined;
        this.utilityService.hideLoading();
      }
    );
  }
  async onClickAccept(data: any) {
    console.log(data);
    const alert = await this.alertController.create({
      cssClass: 'delete-popo-up-class',
      message: ' <b>Are you sure you want to Accept ?</b>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // slidingItem.close();
            this.slidingItem.closeOpened();
          },
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
          this.getFlexWorkList(this.page.pageNumber);
        } else {
          this.utilityService.hideLoading();
          this.utilityService.showErrorToast(response['Message']);
        }
      },
      (err) => {}
    );
  }
  loadData(event) {
    setTimeout(async () => {
      if (this.flexRequestList.length > 0) {
        this.page.pageNumber += 1;
        console.log('page no', this.page.pageNumber);

        if (this.action == 'isRequestedOffer') {
          await this.getMyflexList(this.page.pageNumber);
        } else {
          await this.getFlexWorkList(this.page.pageNumber);
        }
        event.target.complete();
      }
    }, 100);
  }
}
