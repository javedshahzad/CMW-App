import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { OfferStatus, Role } from 'src/app/models/role-model';
import * as moment from 'moment';
import { Constants, timeList, SubscriptionType } from 'src/app/constant/constants';
import { ShiftService } from '../../services/shift/shift.service'
import { DepartmentService } from 'src/app/services/department/department.service';
import { VotRequestService } from 'src/app/services/vot-request/vot-request.service';
import { CallInRequestService } from 'src/app/services/call-in-request/call-in-request.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { ModalController, Platform } from '@ionic/angular';
import { AddVotRequestPage } from '../../pages/add-vot-request/add-vot-request.page';

@Component({
  selector: 'app-vot-requests',
  templateUrl: './vot-requests.page.html',
  styleUrls: ['./vot-requests.page.scss'],
})
export class VotRequestsPage implements OnInit {
  public isData: boolean;
  public votRequestList: any = [];
  @ViewChild('filterTextValue', { static: false }) filterTextValue;
  public searchfield: any;
  totalItems: any;
  rowsOnPage = Constants.ROWS_ON_PAGE;
  currentPage = Constants.CURRENT_PAGE;
  page: any;
  deleteId: string;
  role: number;
  roleEnum = Role;
  offerStatus = OfferStatus;
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
  public HourEarly: any = {};
  public HourLate: any = {};
  public settingList: any = {};
  public moduleId: any;
  public isHiddenColumn: boolean = false;
  userId: number;
  isConfirmed = false;
  timeList = timeList;
  public loadmore: boolean = false;
  public action = {};
  constructor(public router: Router,
    public modal: ModalController,
    public shiftService: ShiftService,
    public departmentService: DepartmentService,
    public votRequestService: VotRequestService,
    public callInRequstService: CallInRequestService,
    public utilityService: UtilityService
  ) { }

  ngOnInit() {
  }
  async ionViewWillEnter() {
    this.columns = [
      'dateToWork',
      'departmentId',
      'shiftToWork',
      'timeType',
      'dateToWorkDateStr',
      'department.departmentName',
      'shiftToWorkTitle',
      'timeTypeStr',
      'offerStatusStr',
      'dateToWork',
      'shiftToWork',
      'timeType',
      'createdByUsername',
      'isHourEarly',
      'isHourLate',
    ];
    this.page = {
      pageNumber: 0,
      size: this.rowsOnPage,
    };
    this.searchSort = {
      Page: this.page.pageNumber + 1,
      PageSize: Constants.ROWS_ON_PAGE,
      Columns: [
      ],
      Search: {
        Value: '',
        ColumnNameList: [],
        Regex: 'string'
      },
      Order: [{
        Column: 0,
        ColumnName: '',
        Dir: 'asc'
      }]
    };
    this.userId = Number(localStorage.getItem(Constants.USERID));
    this.searchfield = '';
    this.isConfirmed = false;
    this.role = Number(localStorage.getItem(Constants.ROLE));
    this.companyId = Number(localStorage.getItem(Constants.COMPANYID));
    this.setPage({ offset: 0 });
    if (this.role === this.roleEnum.manager) {
      await this.getShiftList();
      await this.getDepartmentList();
    }
  }

  async openVotRequests(value) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
         action:'add'
      }
  };
    this.router.navigate(['tabs/add-vot-request'], navigationExtras);
  }

  async getShiftList() {
    if (!navigator.onLine) {
      return  this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    await this.shiftService.getShiftListByCompanyId(null, Number(localStorage.getItem(Constants.COMPANYID)))
      .then(response => {
        this.shiftList = response['Data'];
      }, err => { this.shiftList = []; });
  }

  async getDepartmentList() {
    if (!navigator.onLine) {
      return  this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    await this.departmentService.getDepartmentListByCompanyId(null, Number(localStorage.getItem(Constants.COMPANYID))).then(res => {
      if (res['Success']) {
        this.departmentList = res['Data'];
      } else { this.departmentList = []; }
    }, err => { this.departmentList = []; });
  }
  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.getVotRequestList(this.page.pageNumber + 1);
  }
  async getVotRequestList(currentPage) {
    if (!!this.filterTextValue) {
      this.isShowLink = true;
      this.searchSort.Search.Value = this.filterTextValue;
      this.searchSort.Search.ColumnNameList = this.columns;
      this.searchSort.Page = currentPage;
      await this.filterData();
    } else {
      if (!navigator.onLine) {
        return  this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      }
      this.utilityService.showLoadingwithoutDuration();
      const getMethod = this.role === this.roleEnum.manager ?
      this.votRequestService.getVotClosedRequestedOfferList(currentPage, this.rowsOnPage) :
      this.votRequestService.getVotRequestList(currentPage, this.rowsOnPage);

      await getMethod.then(async (res: any) => {
        await this.getSettingByCompanyID();
        if (res['Success']) {
          if (this.role === this.roleEnum.manager) {
            if (!!res['Data'].pagedResults && res['Data'].pagedResults.results.length > 0) {
              this.votRequestList = res['Data'].pagedResults.results;
              if (res.Data.results) {
                this.isData = true;
              }
              this.totalItems = res.Data.pagedResults.totalNumberOfRecords === 0 ? undefined : res.Data.pagedResults.totalNumberOfRecords;
              for (var i = 0; i < this.votRequestList.length; i++) {
                this.votRequestList[i].startTimeToShow = moment(this.votRequestList[i].vtoStartTime, "HH:mm:ss A").format('hh:mm A');
                this.votRequestList[i].endTimeToShow = moment(this.votRequestList[i].vtoEndTime, "HH:mm:ss A").format('hh:mm A');
              }
            } else {
              this.votRequestList = [];
              this.isData = false;
              this.totalItems = undefined;
            }
            this.totalApprovedHours = res.Data.approvalHours.totalHoursApproved;
            this.totalDeniedHours = res.Data.approvalHours.totalHoursDenied;
          } else {

            this.votRequestList = res.Data.results;
            if (res.Data.results) {
              this.isData = true;
            }
            if (this.votRequestList.length > Constants.ROWS_ON_PAGE) {
              this.loadmore = true;
            }
            else {
              this.loadmore = false;
            }
            this.totalItems = res.Data.totalNumberOfRecords === 0 ? undefined : res.Data.totalNumberOfRecords;
            for (var i = 0; i < this.votRequestList.length; i++) {
              this.votRequestList[i].startTimeToShow = moment(this.votRequestList[i].vtoStartTime, "HH:mm:ss A").format('hh:mm A');
              this.votRequestList[i].endTimeToShow = moment(this.votRequestList[i].vtoEndTime, "HH:mm:ss A").format('hh:mm A');
              if (this.votRequestList[i].status == 0 || this.votRequestList[i].status == 7 || this.votRequestList[i].status == 2) {
                this.votRequestList[i].statusClass = "success";
              }
              else if (this.votRequestList[i].status == 3 || this.votRequestList[i].status == 1) {
                this.votRequestList[i].statusClass = "danger";
              }
            }
            console.log('list is', this.votRequestList);
          }
        } else {
          this.votRequestList = [];
          this.totalItems = undefined;
          this.isData = false;
        }
        this.utilityService.hideLoading();
      }, err => {
        this.utilityService.hideLoading();
        this.votRequestList = [];
      });
    }
  }
  async filterData() {
    if (!navigator.onLine) {
      return  this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }

    this.utilityService.showLoadingwithoutDuration();

    const filterMethod = this.role === this.roleEnum.manager ? this.votRequestService.closedVotOfferDataFilter(this.searchSort) :
    this.votRequestService.votRequestOfferDataFilter(this.searchSort);
    await filterMethod.then(res => {
      if (this.role === this.roleEnum.manager) {
        if (res['offerlist'].data && res['offerlist'].data.length > 0) {
          this.votRequestList = res['offerlist'].data;
          this.totalItems = res['offerlist']['recordsFiltered'] === 0 ? undefined : res['offerlist']['recordsFiltered'];
        } else {
          this.votRequestList = []; this.totalItems = undefined;
        }
        this.totalApprovedHours = res['approvehours'].totalHoursApproved;
        this.totalDeniedHours = res['approvehours'].totalHoursDenied;
      } else {
        if (res['data'] && res['data'].length > 0) {
          this.votRequestList = res['data'];
          if (res['data']) {
            this.isData = true;
          }
          for (var i = 0; i < this.votRequestList.length; i++) {
            this.votRequestList[i].startTimeToShow = moment(this.votRequestList[i].vtoStartTime, "HH:mm:ss A").format('hh:mm A');
            this.votRequestList[i].endTimeToShow = moment(this.votRequestList[i].vtoEndTime, "HH:mm:ss A").format('hh:mm A');
            if (this.votRequestList[i].status == 2) {
              this.votRequestList[i].statusClass = "success";
            }
            else if (this.votRequestList[i].status == 1) {
              this.votRequestList[i].statusClass = "primary";
            }
            else if (this.votRequestList[i].status == 3) {
              this.votRequestList[i].statusClass = "danger";
            }
          }
          this.totalItems = res['recordsFiltered'] === 0 ? undefined : res['recordsFiltered'];
        } else { this.votRequestList = []; this.totalItems = undefined; this.isData = false; }
      }
      this.utilityService.hideLoading();
    }, err => {
      this.votRequestList = [];
      this.totalItems = undefined;
      this.utilityService.hideLoading();
    });
  }
  async getSettingByCompanyID() {
    const module = SubscriptionType.filter((item) => {
      return item.value === 'VOT Request Module';
    });
    this.moduleId = module[0].id;
    if (!navigator.onLine) {
      return  this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    
    const getMethod = this.callInRequstService.getSettingByCompanyID(this.moduleId, this.companyId, false);
    await getMethod.then((res: any) => {
      if (res['Success']) {
    
        this.settingList = res.Data;
        if (this.settingList.length > 0) {
          this.settingList.map((item) => {
            if (item.SettingType === "Hour Early") {
              item.Name = "An Hour Early";
              this.HourEarly = item;
              console.log("early", this.HourEarly);
            }
            else if (item.SettingType === "Hour Late") {
              item.Name = "An Hour Late";
              this.HourLate = item;
              console.log("late", this.HourLate);
            }
          });
        }
      } else {
        this.settingList = [];
      }
    }, err => { this.settingList = []; });
  }
  async searchRequest(event) {
    this.filterTextValue = event.detail.value;
    await this.getVotRequestList(this.page.pageNumber);
  }
  loadData(event) {

    setTimeout(async () => {
      if (this.votRequestList.length > 0) {
        // if (!this.loadmore) {
        //   event.target.disabled = true;
        // }
        this.page.pageNumber += 1;
        console.log('page no', this.page.pageNumber);

        await this.getVotRequestList(this.page.pageNumber);

        event.target.complete();
      }
    }, 100);
  }

  goBack() {
    this.router.navigate(['/tabs/my-requests']);
  }
  goToVotDetail(votdata: any) {
    if (this.HourEarly.Enable) {
      if (votdata.isHourEarly === false) {
        votdata.isHourEarly = 'false';
        votdata.isHourEarlyShow = 'Nope';
      }
      else {
        votdata.isHourEarly = 'true';
        votdata.isHourEarlyShow = 'Yes';
      }
    }
    else {
      votdata.isHourEarly = false;
    }
    if (this.HourLate.Enable) {
      if (votdata.isHourLate === false) {
        votdata.isHourLate = 'false';
        votdata.isHourLateShow = 'Nope';
      }
      else {
        votdata.isHourLate = 'true';
        votdata.isHourLateShow = 'Yes';
      }
    }
    else {
      votdata.isHourLate = false;
    }
    localStorage.setItem(Constants.VOT_DATA, JSON.stringify(votdata));
    this.router.navigate(['tabs/vot-request-detail']);
  }
}
