import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Constants, OfferListEnum, OfferRequestTypesEnum } from '../constant/constants';
import { OfferStatus } from '../models/role-model';
import { EventsService } from '../services/events/events.service';
import { OfferService } from '../services/offer/offer.service';
import { UtilityService } from '../services/utility/utility.service';
@Component({
  selector: 'app-closed-requests',
  templateUrl: './closed-requests.page.html',
  styleUrls: ['./closed-requests.page.scss'],
})
export class ClosedRequestsPage implements OnInit {
  @ViewChild('filterTextValue', { static: false }) filterTextValue;
  public isData: boolean;
  keys = Object.keys;
  columns = [];
  loadmore = false;
  isConfirmed = false;
  isApprove = false;
  isReject = false;
  selected = [];
  offerId: number;
  oldData = [];
  confirmMsg = '';
  offerStatus = OfferStatus;
  page: any;
  confirmSaveBtn = '';
  confirmCancelBtn = '';
  public selectedItems: any = [];
  allModuleCloseList: any = [];
  selectedRecords = [];
  requestType: any;
  searchSort: any;
  role: number;
  IsSwap: boolean = false;
  totalItems: any;
  public searchfield: any;
  OfferRequestTypesEnum = OfferRequestTypesEnum;
  OfferListEnum = OfferListEnum;
  pageNo: any;

  offerArrayValues = Object.values(OfferListEnum).filter(
    (value) => typeof value === 'string'
  );
  arrayValues = Object.values(OfferListEnum).filter(
    (value) => typeof value === 'number'
  );

  requestOptions: any = {
    header: 'Select request type',
  };
  currentPage = Constants.CURRENT_PAGE;
  rowsOnPage = Constants.HR_PAGE_ROWS_ON_PAGE;
  isVTORequests: any;
  isSwapRequests: any;
  isVOTRequests: any;
  isTransferRequests: any;
  isTrainingRequests: any;
  isFlexWorkRequests: any;
  isEarlyGoRequest: any;
  isLateInRequest: any;
  isTimeOffRequest: any;
  isCallInOutRequest: any;
  isClockInOutRequest: any;
  constructor(
    private router: Router,
    private routes: ActivatedRoute,
    private offerService: OfferService,
    private utilityService: UtilityService,
    private datePipe: DatePipe,
  ) {
    this.columns = [
      'offerTypeStr',
      'createdByObj.companyUsername',
      'dateToWorkDateStr',
      'dateToSkipDateStr',
      'offerStatusStr',
      'shiftToWorkTitle',
      'departmentName',
      'timeTypeStr',
      'uTOHours',
    ];
    this.page = {
      pageNumber: 1,
      size: this.rowsOnPage,
    };
    this.searchSort = {
      Page: this.page.pageNumber + 1,
      PageSize: Constants.HR_PAGE_ROWS_ON_PAGE,
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

    //set default type

    this.requestType = this.OfferListEnum[0];
    //bind data
    this.selectedItems = 0;
  }

  async ionViewWillEnter() {
     this.page.pageNumber = 1;
    try {
      this.utilityService.showLoadingwithoutDuration();
      localStorage.setItem('selected_tab', 'close_request');
      if (this.allModuleCloseList) {
        this.allModuleCloseList = [];
        this.oldData = [];

        await this.getAllModuleCloseList(this.currentPage, this.selectedItems);
      }
      await this.getRequest();
      console.log(this.offerStatus, 'status');
      this.searchfield = '';
      //this.setPage({ offset: 0 });
    } catch (e) {
      console.log(e);
      this.utilityService.hideLoading();
    }
  }
  ngOnInit() { }

  onSelectionChange(event) {
    this.allModuleCloseList = [];
    this.oldData = [];
    this.selectedItems = this.OfferListEnum[event.detail.value];

    this.getAllModuleCloseList(this.currentPage, this.selectedItems);
  }
  getRequest() {
    this.isVTORequests = localStorage.getItem(Constants.IS_VTO);
    this.isSwapRequests = localStorage.getItem(Constants.IS_SWAP);
    this.isVOTRequests = localStorage.getItem(Constants.IS_VOT);
    this.isTransferRequests = localStorage.getItem(Constants.IS_TRANSFER);
    this.isTrainingRequests = localStorage.getItem(Constants.IS_TRAINING);
    this.isFlexWorkRequests = localStorage.getItem(Constants.IS_FLEX_WORK);
    this.isEarlyGoRequest = localStorage.getItem(Constants.IS_EARLY_OUT);
    this.isLateInRequest = localStorage.getItem(Constants.IS_LATE_IN);
    this.isTimeOffRequest = localStorage.getItem(Constants.IS_TIME_OFF);
    this.isCallInOutRequest = localStorage.getItem(Constants.IS_CALL_OFF);
    this.isClockInOutRequest = localStorage.getItem(Constants.IS_CLOCK_IN_OUT);

    if (this.isVTORequests == 'false') {
      this.offerArrayValues = this.offerArrayValues.filter(
        (v) => v !== 'VTO Request'
      );
    }
    if (this.isSwapRequests == 'false') {
      this.offerArrayValues = this.offerArrayValues.filter(
        (v) => v !== 'Swap Request'
      );
    }
    if (this.isVOTRequests == 'false') {
      this.offerArrayValues = this.offerArrayValues.filter(
        (v) => v !== 'VOT Request'
      );
    }
    if (this.isTransferRequests == 'false') {
      this.offerArrayValues = this.offerArrayValues.filter(
        (v) => v !== 'Transfer Request'
      );
      // } else if (this.isTrainingRequests == 'false') {
      //   this.offerArrayValues.splice(4, 1);
    }
    if (this.isFlexWorkRequests == 'false') {
      this.offerArrayValues = this.offerArrayValues.filter(
        (v) => v !== 'Flex Work Request'
      );
    }
    if (this.isEarlyGoRequest == 'false') {
      this.offerArrayValues = this.offerArrayValues.filter(
        (v) => v !== 'Early Out Request'
      );
    }
    if (this.isLateInRequest == 'false') {
      this.offerArrayValues = this.offerArrayValues.filter(
        (v) => v !== 'Late In Request'
      );
    }
    if (this.isTimeOffRequest == 'false') {
      this.offerArrayValues = this.offerArrayValues.filter(
        (v) => v !== 'Time-Off Request'
      );
    }
    if (this.isCallInOutRequest == 'false') {
      this.offerArrayValues = this.offerArrayValues.filter(
        (v) => v !== 'Call-Off Request'
      );
    }
    if (this.isClockInOutRequest == 'false') {
      this.offerArrayValues = this.offerArrayValues.filter(
        (v) => v !== 'Punch Edit'
      );
    }
  }

  goToFeedback(){
    this.router.navigate(['/tabs/feedback-request']);
  }

  searchRequest(event) {
    this.filterTextValue = event.detail.value;
    this.getAllModuleCloseList(this.currentPage, this.selectedItems);
  }

  filterData() {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoading();
    const filterMethod = this.offerService.closeApprovalRequestDataFilter(
      this.searchSort,
      this.selectedItems
    );
    filterMethod.then(
      (res) => {
        this.utilityService.hideLoading();
        if (res['data'] && res['data'].length > 0) {
          this.allModuleCloseList = res['data'];
          if (res['data']) {
            this.isData = true;
          }
          this.getTimings(this.allModuleCloseList);
        } else {
          this.totalItems = undefined;
          this.allModuleCloseList = [];
          this.isData = false;
        }
      },
      (err) => {
        this.utilityService.hideLoading();
        this.allModuleCloseList = [];
        this.totalItems = undefined;
        this.isData = false;
      }
    );
  }
  getAllModuleCloseList(currentPage, OfferTypesEnum) {
    if (!!this.filterTextValue) {
      this.searchSort.Search.Value = this.filterTextValue;
      this.searchSort.Search.ColumnNameList = this.columns;
      this.searchSort.Page = currentPage;
      this.filterData();
    } else {
      if (!navigator.onLine) {
        return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      }
      this.utilityService.showLoading();
      this.offerService
        .getAllModuleCloseList(currentPage, OfferTypesEnum)
        .then((res) => {
          if (res['Success']) {
            console.log(res);
            this.utilityService.hideLoading();
            this.allModuleCloseList = res['Data'].results;
            this.pageNo = res['Data'].pageNumber
            for (var i = 0; i <= this.allModuleCloseList.length - 1; i++) {
              this.oldData.push(this.allModuleCloseList[i]);
            }
            // this.totalItems = !!res['Data'].totalNumberOfRecords
            //   ? res['Data'].totalNumberOfRecords
            //   : 0;
            if (currentPage < res['Data'].totalNumberOfPages) {
              this.loadmore = true;
              this.allModuleCloseList = this.oldData;
            } else {
              this.loadmore = false;
              this.allModuleCloseList = this.oldData;
            }
            this.totalItems = !!res['Data'].totalNumberOfRecords
              ? res['Data'].totalNumberOfRecords
              : 0;
            this.getTimings(this.allModuleCloseList);
            console.log(this.allModuleCloseList.length);
            console.log(this.totalItems);
          } else {
            this.utilityService.hideLoading();
            this.allModuleCloseList = [];
            this.loadmore = false;
          }
          (err) => {
            this.utilityService.hideLoading();
            this.allModuleCloseList = [];
          };
        });
    }
  }

  getTimings(list: any) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].status == this.offerStatus.accepted) {
        list[i].status = 'success';
      } else if (
        list[i].status == this.offerStatus.pendingProceed ||
        list[i].status == this.offerStatus.proceed
      ) {
        list[i].statusClass = 'primary';
      } else if (list[i].status == this.offerStatus.available) {
        list[i].statusClass = 'info';
      } else if (
        list[i].status == this.offerStatus.rejected ||
        list[i].status == this.offerStatus.expired
      ) {
        list[i].statusClass = 'danger';
      } else if (list[i].status == this.offerStatus.hrApproval) {
        list[i].statusClass = 'danger';
      } else if (list[i].status == this.offerStatus.scheduleUpdated) {
        list[i].statusClass = 'success';
      } else if (list[i].status == this.offerStatus.notinterested) {
        list[i].statusClass = 'danger';
      }
    }
  }

  loadData(event) {
    setTimeout(() => {
      if (this.allModuleCloseList.length > 0) {
        // if (!this.loadmore) {
        //   event.target.disabled = true;
        // }
        this.page.pageNumber += 1;
        console.log('page no', this.page.pageNumber);

        this.getAllModuleCloseList(this.page.pageNumber, this.selectedItems);

        event.target.complete();
      }
    }, 100);
  }
  goTOCalendarView() {
    this.router.navigate(['/hr-calendar-view']);
  }
  getFormatedDate(date) {
    return this.datePipe.transform(new Date(date), 'MM/dd/yyyy hh:mm a');
  }

  convertDateToSkipShortDate(data) {
    const date = data.dateToSkipShortDate.split('/');
    const departureStartTime = data.vtoStartTime.split(':');
    const dateToSkipHH = parseInt(departureStartTime[0]);
    const dateToSkipMin = parseInt(departureStartTime[1]);
    const dateToSkipMM = parseInt(date[0]);
    const dateToSkipDD = parseInt(date[1]);
    const dateToSkipYYYY = parseInt(date[2]);
    return this.datePipe.transform(new Date(
      dateToSkipYYYY,
      dateToSkipMM - 1,
      dateToSkipDD,
      dateToSkipHH,
      dateToSkipMin
    ), 'MM/dd/yyyy hh:mm a');
  }
}
