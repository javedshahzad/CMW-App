import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { NavigationExtras,Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Constants } from 'src/app/constant/constants';
import { OfferStatus, Role } from 'src/app/models/role-model';
import { TimeOffService } from 'src/app/services/timeOff/time-off.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-time-off-request',
  templateUrl: './time-off-request.page.html',
  styleUrls: ['./time-off-request.page.scss'],
})
export class TimeOffRequestPage implements OnInit {
  @ViewChild('filterTextValue', { static: false }) filterTextValue;

  @Input() requestType: string;
  // modalRef: BsModalRef;
  role: number;
  roleEnum = Role;
  page: any;
  searchSort: any;
  userName: string;
  columns = [];
  offerStatus = OfferStatus;
  isShowLink = false;
  // public myOffer: timeOffRequestModel;
  timeOffRequestList: any = [];
  rowsOnPage = Constants.ROWS_ON_PAGE;
  currentPage = Constants.CURRENT_PAGE;
  public totalItems: any;
  timeOffRequest: any;
  isConfirmed = false;
  deleteId: string;
  public action: any;
  public isData: boolean;
  public loadmore = false;

  constructor(
    public timeOffService: TimeOffService,
    public router: Router,
    public modal: ModalController,
    public utilityService: UtilityService
  ) {}

  ngOnInit() {}
  async ionViewWillEnter() {
    this.columns = [
      'userName',
      'TimeOffStartDateStr',
      'TimeOffEndDateStr',
      'Status',
      'CreatedDateStr',
      'createdBy',
      'timeOffId',
      'TimeOffDifference',
      'StatusStr',
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
    this.role = Number(localStorage.getItem(Constants.ROLE));
    this.userName = localStorage.getItem(Constants.USERNAME);
    await this.setPage({ offset: 0 });
  }

  async setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    await this.getUserTimeOffList(this.page.pageNumber + 1);
  }

  async getUserTimeOffList(currentPage) {
    if (!!this.filterTextValue) {
      this.searchSort.Search.Value = this.filterTextValue;
      this.searchSort.Search.ColumnNameList = this.columns;
      this.searchSort.Page = currentPage;
      await this.filterData();
    } else {
      if (!navigator.onLine) {
        return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      }
      this.utilityService.showLoading();
      const getMethod = this.timeOffService.getTimeOffUser(
        currentPage,
        this.userName
      );
      await getMethod.then(
        (res: any) => {
          if (res['Success']) {
            this.timeOffRequestList = res.Data.results;
            if (res.Data.results) {
              this.isData = true;
            }
            if (this.timeOffRequestList.length > Constants.ROWS_ON_PAGE) {
              this.loadmore = true;
            } else {
              this.loadmore = false;
            }
            this.totalItems =
              res.Data.totalNumberOfRecords === 0
                ? undefined
                : res.Data.totalNumberOfRecords;
            for (var i = 0; i < this.timeOffRequestList.length; i++) {
              if (
                this.timeOffRequestList[i].Status == this.offerStatus.proceed ||
                this.timeOffRequestList[i].Status ==
                  this.offerStatus.scheduleUpdated
              ) {
                this.timeOffRequestList[i].statusClass = 'success';
              } else if (
                this.timeOffRequestList[i].Status ==
                this.offerStatus.pendingProceed
              ) {
                this.timeOffRequestList[i].statusClass = 'primary';
              } else if (
                this.timeOffRequestList[i].Status == this.offerStatus.hrApproval
              ) {
                this.timeOffRequestList[i].statusClass = 'danger';
              } else if (
                this.timeOffRequestList[i].Status == this.offerStatus.rejected
              ) {
                this.timeOffRequestList[i].statusClass = 'danger';
              }
            }
          } else {
            this.timeOffRequestList = [];
            this.totalItems = undefined;
            this.isData = false;
          }
          this.utilityService.hideLoading();
        },
        (err) => {
          this.utilityService.hideLoading();
          this.timeOffRequestList = [];
          this.isData = false;
        }
      );
    }
  }
  async searchRequest(event) {
    this.filterTextValue = event.detail.value;
    await this.getUserTimeOffList(this.page.pageNumber);
  }
  loadData(event) {
    setTimeout(async () => {
      if (this.timeOffRequestList.length > 0) {
        // if (!this.loadmore) {
        //   event.target.disabled = true;
        // }
        this.page.pageNumber += 1;
        console.log('page no', this.page.pageNumber);

        await this.getUserTimeOffList(this.page.pageNumber);

        event.target.complete();
      }
    }, 100);
  }
  async filterData() {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    const filterMethod = this.timeOffService.getUserRequestFilterData(
      this.searchSort
    );

    this.utilityService.showLoading();
    await filterMethod.then(
      (res) => {
        if (res['data'] && res['data'].length > 0) {
          this.timeOffRequestList = res['data'];
          if (res['data']) {
            this.isData = true;
          }
          this.totalItems =
            res['recordsFiltered'] === 0 ? undefined : res['recordsFiltered'];
          for (var i = 0; i < this.timeOffRequestList.length; i++) {
            if (
              this.timeOffRequestList[i].Status == this.offerStatus.proceed ||
              this.timeOffRequestList[i].Status ==
                this.offerStatus.scheduleUpdated
            ) {
              this.timeOffRequestList[i].statusClass = 'success';
            } else if (
              this.timeOffRequestList[i].Status ==
              this.offerStatus.pendingProceed
            ) {
              this.timeOffRequestList[i].statusClass = 'primary';
            } else if (
              this.timeOffRequestList[i].Status == this.offerStatus.hrApproval
            ) {
              this.timeOffRequestList[i].statusClass = 'danger';
            } else if (
              this.timeOffRequestList[i].Status == this.offerStatus.rejected
            ) {
              this.timeOffRequestList[i].statusClass = 'danger';
            }
          }
        } else {
          this.totalItems = undefined;
          this.timeOffRequestList = [];
          this.isData = false;
        }
        this.utilityService.hideLoading();
      },
      (err) => {
        this.utilityService.hideLoading();
        this.timeOffRequestList = [];
        this.totalItems = undefined;
        this.isData = false;
      }
    );
  }
  goToTimeOffDetail(timeDetail: any) {
    timeDetail.action = this.action;
    localStorage.setItem(Constants.TIME_OFF_DATA, JSON.stringify(timeDetail));
    this.router.navigate(['tabs/timeoff-request-detail']);
  }

  goToTimeOffBank() {
    this.router.navigate(['tabs/timeoff-bank']);
  }
  async openTimeOffRequests(data: any) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: 'add',
      },
      replaceUrl: true,
    };
    this.router.navigate(['tabs/add-timeoff-request'], navigationExtras);
  }
  goBack() {
    this.router.navigate(['/tabs/my-requests']);
  }
}
