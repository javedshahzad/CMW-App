import { Component, OnInit, ViewChild } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { Constants, SubscriptionType } from 'src/app/constant/constants';
import { OfferStatus, Role } from 'src/app/models/role-model';
import { CallInRequestService } from 'src/app/services/call-in-request/call-in-request.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-call-in-request',
  templateUrl: './call-in-request.page.html',
  styleUrls: ['./call-in-request.page.scss'],
})
export class CallInRequestPage implements OnInit {
  @ViewChild('filterTextValue', { static: false }) filterTextValue;

  offerStatus = OfferStatus;
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

  constructor(public modal: ModalController, private router: Router, public callInRequestService: CallInRequestService,
    public utilityService: UtilityService
  ) { }

  ngOnInit() {
  }
  ionViewWillEnter() {
    this.columns = [
      'dateToSkip',
      'departmentId',
      'shiftToSkip',
      'shiftId',
      'dateToSkipDateStr',
      'createdByObj.companyUsername',
      'ReasonObj.name',
      'OtherReason',
      'departmentName',
      'shiftToSkipNavigation.title',
      'IsPaidOff',
      'offerStatusStr',
      'approvedByObj.name',
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
    this.IsCoverMyWork = localStorage.getItem(Constants.APP_NAME) === 'CoverMyWork' ? true : false;

    this.userId = Number(localStorage.getItem(Constants.USERID));
    this.isConfirmed = false;
    this.role = Number(localStorage.getItem(Constants.ROLE));
    this.companyId = Number(localStorage.getItem(Constants.COMPANYID));
    this.searchfield = '';
    this.setPage({ offset: 0 });
  }
  async setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    await this.getCallOffOfferList(this.page.pageNumber + 1);
  }

  async getCallOffOfferList(currentPage) {
    if ((!!this.filterTextValue)) {
      this.searchSort.Search.Value = this.filterTextValue;
      this.searchSort.Search.ColumnNameList = this.columns;
      this.searchSort.Page = currentPage;
      await this.filterData();
    }
    else {
      if (!navigator.onLine) {
        return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      }
      this.utilityService.showLoadingwithoutDuration();
      const getMethod =
        this.role === this.roleEnum.manager
          ? this.callInRequestService.GetCallOffListForManager(
              currentPage,
              this.rowsOnPage
            )
          : this.callInRequestService.getCallOffRequestList(
              currentPage,
              this.rowsOnPage
            );
      await getMethod.then(async (res: any) => {
        await this.getSettingByCompanyID();
        if (res['Success']) {
          
          if (res.Data.pagedResults && res.Data.pagedResults.results.length > 0) {
            this.callInRequestList = res.Data.pagedResults.results;
            if (res.Data.pagedResults.results) {
              this.isData = true;
            } 
            if (this.callInRequestList.length > Constants.ROWS_ON_PAGE) {
              this.loadmore = true;
            }
            else {
              this.loadmore = false;
            }
            this.totalItems = res.Data.pagedResults.totalNumberOfRecords === 0 ? undefined : res.Data.pagedResults.totalNumberOfRecords;
            this.totalRequestedHours = this.role == this.roleEnum.manager ? res.Data.totalHours.totalHoursApproved : 0;
            for (var i = 0; i < this.callInRequestList.length; i++) {

              if (this.callInRequestList[i].status == 2 || this.callInRequestList[i].status == 6) {
                this.callInRequestList[i].statusClass = "success";
              }
              else if (this.callInRequestList[i].status == 5) {
                this.callInRequestList[i].statusClass = "danger";
              }
            }
          } else {
            this.callInRequestList = [];
            this.isData = false;
            this.totalItems = undefined;
          }
          this.utilityService.hideLoading();
        } else {
          this.utilityService.hideLoading();
          this.callInRequestList = [];
          this.isData = false;
          this.totalItems = undefined;
        }
      }, err => {
        this.utilityService.hideLoading();
        this.callInRequestList = [];
        this.totalItems = undefined;
      });
    }
  }
  async filterData() {
    if (this.role === this.roleEnum.user) {
      if (!navigator.onLine) {
        return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      }
      this.utilityService.showLoadingwithoutDuration();
      const filterMethod = this.callInRequestService.userCallOffRequestsDataFilter(this.searchSort)
      await filterMethod.then(res => {
        
        if (res['data'] && res['data'].length > 0) {
          this.callInRequestList = res['data'];
          if (res['data']) {
            this.isData = true;
          }
          this.totalItems = res['recordsFiltered'] === 0 ? undefined : res['recordsFiltered'];
          for (var i = 0; i < this.callInRequestList.length; i++) {

            if (this.callInRequestList[i].status == 2) {
              this.callInRequestList[i].statusClass = "success";
            }
            else if (this.callInRequestList[i].status == 6) {
              this.callInRequestList[i].statusClass = "success";
            }
            else if (this.callInRequestList[i].status == 5) {
              this.callInRequestList[i].statusClass = "danger";
            }
          }
        } else {
          this.totalItems = undefined;
          this.isData = false;
          this.callInRequestList = [];
        }
        this.utilityService.hideLoading();
      }, err => {
        this.callInRequestList = [];
        this.totalItems = undefined;
        this.isData = false;
        this.utilityService.hideLoading();
      });
    }
    if (this.role === this.roleEnum.manager) {
      if (!navigator.onLine) {
        return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      }
      this.utilityService.showLoadingwithoutDuration();
      const filterMethod = this.callInRequestService.managerCallOffOfferDataFilter(this.searchSort);
      await filterMethod.then(
        (res) => {
          if (res['offerlist'].data && res['offerlist'].data.length > 0) {
            this.callInRequestList = res['offerlist'].data;
            this.totalItems =
              res['offerlist'].recordsFiltered === 0
                ? undefined
                : res['offerlist'].recordsFiltered;
            this.totalRequestedHours =
              res['totalhours'] === 0 ? 0 : res['totalhours'];
            for (var i = 0; i < this.callInRequestList.length; i++) {
              if (this.callInRequestList[i].status == 2) {
                this.callInRequestList[i].statusClass = 'success';
              } else if (this.callInRequestList[i].status == 6) {
                this.callInRequestList[i].statusClass = 'success';
              } else if (this.callInRequestList[i].status == 5) {
                this.callInRequestList[i].statusClass = 'danger';
              }
            }
          } else {
            this.totalItems = undefined;
            this.totalRequestedHours = 0;
          }
          this.utilityService.hideLoading();
        },
        (err) => {
          this.callInRequestList = [];
          this.totalItems = undefined;
          this.utilityService.hideLoading();
        }
      );
    }
  }
  goToCallinDetail(callData: any) {
    if (this.IsCoverMyWork && this.paidTimeOff.Enable === true) {
      callData.IsPaidOfftoShow = true;
    }
    else {
      callData.IsPaidOfftoShow = false;
    }
    if (this.flma.Enable === true) {
      callData.IsFMLAtoShow = true;
    }
    else {
      callData.IsFMLAtoShow = false;
    }
    localStorage.setItem(Constants.CALL_IN_DATA, JSON.stringify(callData));
    this.router.navigate(['tabs/callin-request-detail']);
  }
  searchRequest(event) {
    this.filterTextValue = event.detail.value;
    this.getCallOffOfferList(this.page.pageNumber);

  }
  loadData(event) {

    setTimeout(async () => {
      if (this.callInRequestList.length > 0) {
        // if (!this.loadmore) {
        //   event.target.disabled = true;
        // }
        this.page.pageNumber += 1;
        console.log('page no', this.page.pageNumber);
        await this.getCallOffOfferList(this.page.pageNumber);
        event.target.complete();
      }
    }, 100);
  }
  goBack() {
    this.router.navigate(['/tabs/my-requests']);
  }

  async openCalloff(data: any) {
    let navigationExtras: NavigationExtras = {
      queryParams: {
         action:'add'
      },
      replaceUrl: true
  };
    this.router.navigate(['tabs/add-edit-call-in-request'], navigationExtras);
    // const modal = await this.modal.create({
    //   component: AddEditCallInRequestPage,
    //   cssClass: 'add-request-swap_class',
    //   componentProps: {
    //     'model_type': value
    //   }
    // });
    // modal.onDidDismiss().then((dataReturned) => {
    //   //  setTimeout(() => {
    //   if (dataReturned !== null) {
    //     if (dataReturned.data != undefined) {
    //       console.log(dataReturned.data);
    //       this.callInRequestList = [];
    //       this.getCallOffOfferList(this.page.pageNumber);
    //     }
    //   }
    //   //  }, 2000);
    // });
    // return await modal.present();
  }
  async getSettingByCompanyID() {
    const module = SubscriptionType.filter((item) => item.value === 'Call-Off Module');
    this.moduleId = module[0].id;
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }

    const getMethod = this.callInRequestService.getSettingByCompanyID(this.moduleId, Number(localStorage.getItem(Constants.COMPANYID)));
    await getMethod.then((res: any) => {
      if (res['Success']) {
        this.settingList = res.Data;
        if(!!this.settingList){
          if (this.settingList.length > 0) {
            this.settingList.map((item) => {
              if (item.SettingType === 'PaidTimeOff') {
                item.Name = 'Paid Time Off';
                this.paidTimeOff = item;
              }
              else if (item.SettingType === 'FMLA') {
                item.Name = item.SettingType;
                this.flma = item;
              }
            });
          }
        }
      } else { this.settingList = []; }
    }, err => { this.settingList = []; });
  }
}
