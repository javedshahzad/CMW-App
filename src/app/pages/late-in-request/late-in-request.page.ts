import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Constants } from 'src/app/constant/constants';
import { Role, OfferStatus } from 'src/app/models/role-model';
import { LateInService } from 'src/app/services/lateIn/late-in.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import * as moment from 'moment';

@Component({
  selector: 'app-late-in-request',
  templateUrl: './late-in-request.page.html',
  styleUrls: ['./late-in-request.page.scss'],
})
export class LateInRequestPage implements OnInit {
  @ViewChild('filterTextValue', { static: false }) filterTextValue;
  @Input() requestType: string;
  role: number;
  roleEnum = Role;
  page: any;
  searchSort: any;
  userName: string;
  columns = [];
  offerStatus = OfferStatus;
  isShowLink = false;
  companyId: number;
  userId: number;
  rowsOnPage = Constants.ROWS_ON_PAGE;
  currentPage = Constants.CURRENT_PAGE;
  public totalItems: any;
  timeOffRequest: any;
  isConfirmed = false;
  deleteId: string;
  public action: any;
  public isData: boolean;
  public loadmore = false;
  IsCoverMyWork = false;
  public searchfield: any;
  public lateInRequestList: any = [];

  constructor(
    public lateInService: LateInService,
    public router: Router,
    public modal: ModalController,
    public utilityService: UtilityService
  ) {}

  ngOnInit() {}
  async ionViewWillEnter() {
    this.columns = [
      'createdByObj.name',
      'dateToSkipShortDate',
      'vtoStartTime',
      'uTOHours',
      'ReasonObj.name',
      'offerStatusStr',
      'VtoStartTime12Hours',
      'processedByObj.name',
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
    await this.setPage({ offset: 0 });
  }
  async setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    await this.getLateInList(this.page.pageNumber + 1);
  }
  async searchRequest(event) {
    this.filterTextValue = event.detail.value;
    await this.getLateInList(this.page.pageNumber);
  }

  async getLateInList(currentPage: any) {
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
      const getMethod = this.lateInService.getLateInRequestList(
        currentPage,
        this.rowsOnPage
      );
      await getMethod.then(
        (res: any) => {
          if (res['Success']) {
            
            if (res.Data && res.Data.results.length > 0) {
              this.lateInRequestList = res.Data.results;
              if (res.Data.results) {
                this.isData = true;
              }
              if (this.lateInRequestList.length > Constants.ROWS_ON_PAGE) {
                this.loadmore = true;
              } else {
                this.loadmore = false;
              }
              this.totalItems =
                res.Data.totalNumberOfRecords === 0
                  ? undefined
                  : res.Data.totalNumberOfRecords;
              for (var i = 0; i < this.lateInRequestList.length; i++) {
                this.lateInRequestList[i].startTimeToShow = moment(
                  this.lateInRequestList[i].vtoStartTime,
                  'HH:mm:ss A'
                ).format('hh:mm A');
                this.lateInRequestList[i].endTimeToShow = moment(
                  this.lateInRequestList[i].vtoEndTime,
                  'HH:mm:ss A'
                ).format('hh:mm A');
                if (
                  this.lateInRequestList[i].status == this.offerStatus.proceed
                ) {
                  this.lateInRequestList[i].statusClass = 'success';
                } else if (
                  this.lateInRequestList[i].status ==
                  this.offerStatus.pendingProceed
                ) {
                  this.lateInRequestList[i].statusClass = 'danger';
                } else if (
                  this.lateInRequestList[i].status ==
                  this.offerStatus.hrApproval
                ) {
                  this.lateInRequestList[i].statusClass = 'danger';
                }
              }
            } else {
              this.lateInRequestList = [];
              this.totalItems = undefined;
            }
          } else {
            this.lateInRequestList = [];
            this.totalItems = undefined;
          }
          this.utilityService.hideLoading();
        },
        (err) => {
          this.utilityService.hideLoading();
          this.lateInRequestList = [];
          this.totalItems = undefined;
        }
      );
    }
  }

  loadData(event) {
    setTimeout(async () => {
      if (this.lateInRequestList.length > 0) {
        // if (!this.loadmore) {
        //   event.target.disabled = true;
        // }
        this.page.pageNumber += 1;
        console.log('page no', this.page.pageNumber);

        await this.getLateInList(this.page.pageNumber);

        event.target.complete();
      }
    }, 100);
  }

  async filterData() {
    this.utilityService.showLoadingwithoutDuration();
    const filterMethod = this.lateInService.getUserRequestFilterData(
      this.searchSort
    );

    await filterMethod.then(
      (res) => {
        if (res['data'] && res['data'].length > 0) {
          this.lateInRequestList = res['data'];
          this.totalItems =
            res['recordsFiltered'] === 0 ? undefined : res['recordsFiltered'];
          for (var i = 0; i < this.lateInRequestList.length; i++) {
            this.lateInRequestList[i].startTimeToShow = moment(
              this.lateInRequestList[i].vtoStartTime,
              'HH:mm:ss A'
            ).format('hh:mm A');
            this.lateInRequestList[i].endTimeToShow = moment(
              this.lateInRequestList[i].vtoEndTime,
              'HH:mm:ss A'
            ).format('hh:mm A');
            if (this.lateInRequestList[i].status == this.offerStatus.proceed) {
              this.lateInRequestList[i].statusClass = 'success';
            } else if (
              this.lateInRequestList[i].status ==
              this.offerStatus.pendingProceed
            ) {
              this.lateInRequestList[i].statusClass = 'primary';
            } else if (
              this.lateInRequestList[i].status == this.offerStatus.hrApproval
            ) {
              this.lateInRequestList[i].statusClass = 'info';
            }
          }
        } else {
          this.totalItems = undefined;
          this.lateInRequestList = [];
        }
        this.utilityService.hideLoading();
      },
      (err) => {
        this.utilityService.hideLoading();
        this.lateInRequestList = [];
        this.totalItems = undefined;
      }
    );
  }
  goToLateInDetail(lateInDetail: any) {
    lateInDetail.action = this.action;
    localStorage.setItem(Constants.LATE_IN_DATA, JSON.stringify(lateInDetail));
    this.router.navigate(['tabs/latein-request-detail']);
  }
  async openLateInRequests(data: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: 'add',
      },
      replaceUrl: true,
    };
    this.router.navigate(['tabs/add-edit-late-in-request'], navigationExtras);
  }
  goBack() {
    this.router.navigate(['/tabs/my-requests']);
  }
}
