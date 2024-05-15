import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  Constants,
  OfferRequestTypesEnum,
  StatusTypesEnum,
  Role,
  OfferTypesEnum,
  SubscriptionType,
  OfferListEnum
} from 'src/app/constant/constants';
import { CalendarComponentOptions, DayConfig } from 'ion2-calendar';
import { OfferStatus } from 'src/app/models/role-model';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { TimeOffService } from 'src/app/services/timeOff/time-off.service';
import { OfferService } from 'src/app/services/offer/offer.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { IonDatetime, ModalController } from '@ionic/angular';
import { Offer } from '../../models/offer.model';
import { CallInRequestService } from '../../services/call-in-request/call-in-request.service';
import * as _ from 'lodash';
import { DatePipe } from '@angular/common';
import { utils } from 'src/app/constant/utils';
import { EarlyOutService } from 'src/app/services/earlyOut/early-out.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-hr-calendar-view',
  templateUrl: './hr-calendar-view.page.html',
  styleUrls: ['./hr-calendar-view.page.scss'],
})
export class HrCalendarViewPage implements OnInit {
  @ViewChild('selectedReason', { static: false }) selectedReason: HTMLElement;
  @ViewChild('statusDrpdwn', { static: false }) statusDrpdwn: HTMLElement;
  dateTimeClose: any;
  IsSwap: boolean = false;
  IsVot: boolean = false;
  IsTimeOff: boolean = false;
  IsVto: boolean = false;
  IsFlex: boolean = false;
  IsCallIn: boolean = false;
  IsEarlyGo: boolean = false;
  IsLateIn: boolean = false;
  IsTransfer: boolean = false;
  IsType: boolean = false;
  requestType: any;
  existingDate = [];
  statusType: any;
  offerTypesEnum = OfferTypesEnum;
  OfferListEnum = OfferListEnum;
  OfferRequestTypesEnum = OfferRequestTypesEnum;
  offerArrayValues = Object.values(OfferListEnum).filter(
    (value) => typeof value === 'string'
  );
  arrayValues = Object.values(OfferListEnum).filter(
    (value) => typeof value === 'number'
  );
  StatusTypesEnum = StatusTypesEnum;
  statusArrayValues = Object.values(StatusTypesEnum).filter(
    (value) => typeof value === 'string'
  );
  type = '';
  requestOptions: any = {
    header: 'Select request type',
  };
  statusOptions: any = {
    header: 'Select status',
  };
  optionsMulti: CalendarComponentOptions = {};
  dateRange: { from: string; to: string };
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
  calendarView: any = [];
  currentStatus;
  dateMulti: string[];
  Offer: Offer;
  modalRef: BsModalRef;
  public selectedItems: any = [];
  public selectedStatusType: any = [];
  _daysConfig: DayConfig[] = [];
  offerStatus = OfferStatus;
  dtNow = new Date();
  Status: any;
  loadmore = false;
  isConfirmed = false;
  isConfirmedFlex = false;
  isApprove = false;
  isReject = false;
  selected = [];
  offerId: any = [];
  oldData = [];
  role: number;
  selectedRecords = [];
  totalItems: any;
  confirmSaveBtn = '';
  confirmCancelBtn = '';
  checkedData: any;
  checkedIdx = -1;
  confirmMsg = '';
  isDisableCancelBtn = true;
  page: any;
  deleteId: string;
  monthStartDate: any;
  monthEndDate: any;
  startDate = this.dtNow.toLocaleString().split(',')[0];
  endDate = new Date(this.dtNow.getFullYear(), this.dtNow.getMonth() + 1, 0)
    .toLocaleString()
    .split(',')[0];
  idlist: any = [];
  selectedDate: any = null;
  isValidOfferChange: boolean = true;
  isValidStatusChange: boolean = true;
  isDateCircleShow: boolean = true;
  isLoading: boolean = false;
  isEarlyOutUTOEnabled: boolean = false;
  moduleId: number;
  isPaidTimeOff: boolean;
  userId: any;
  clearFilterIcon = '../../../assets/icon/filter-clear.svg';
  constructor(
    public router: Router,
    public timeOffService: TimeOffService,
    public offerService: OfferService,
    public utilityService: UtilityService,
    private datePipe: DatePipe,
    private modalService: BsModalService,
    public modal: ModalController,
    private CallInRequestService: CallInRequestService,
    private earlyOutService: EarlyOutService
  ) {
    this.requestType = this.OfferListEnum[0];
    this.statusType = this.StatusTypesEnum[0];
    //bind data
    this.selectedItems = 0;
    this.selectedStatusType = 0;
    this.page = {
      pageNumber: 0,
      size: this.rowsOnPage,
    };
  }

  ngOnInit() {}

  async ionViewWillEnter() {
    try {
      this.utilityService.showLoadingwithoutDuration();
      if (this.calendarView) {
        this.calendarView = [];
      }
      this.userId = Number(localStorage.getItem(Constants.USERID));
      await this.getRequest();
      // const dtNow = new Date();
      // let startDate = new Date(dtNow.getFullYear(), dtNow.getMonth(), 1)
      //   .toLocaleString()
      //   .split(',')[0];
      // let endDate = new Date(dtNow.getFullYear(), dtNow.getMonth() + 1, 0)
      //   .toLocaleString()
      //   .split(',')[0];
      // this.dateRange = { from: startDate, to: endDate };
      // this.selectedDate =
      //   this.dateRange.from.toLocaleString() +
      //   ',' +
      //   this.dateRange.to.toLocaleString();
      // console.log(this.selectedDate, 'date range');
      let date = new Date();
      this.monthStartDate = this.datePipe.transform(
        new Date(date.getFullYear(), date.getMonth(), 1),
        'yyyy/MM/dd'
      );
      this.monthEndDate = this.datePipe.transform(
        new Date(date.getFullYear(), date.getMonth() + 1, 0),
        'yyyy/MM/dd'
      );
      await this.getCalendarView(
        this.selectedStatusType,
        this.selectedItems,
        this.selectedDate,
        this.monthStartDate,
        this.monthEndDate
      );
      // await this.getSettingByCompanyIDAsync();
      this.utilityService.hideLoading();
    } catch (e) {
      console.log(e);
      this.utilityService.hideLoading();
    }
    this.getRequest();
    // let startDate = new Date(dtNow.getFullYear(), dtNow.getMonth(), 1)
    //   .toLocaleString();
    // let endDate = new Date(dtNow.getFullYear(), dtNow.getMonth() + 1, 0)
    //   .toLocaleString()
    //   .split(',')[0];
  }

  async onChange(event) {
    this.isDisableCancelBtn = false;
    this.isDateCircleShow = false;
    this.selectedDate = event;
    this.utilityService.showLoadingwithoutDuration();
    await this.getCalendarView(
      this.selectedStatusType,
      this.selectedItems,
      event,
      this.monthStartDate,
      this.monthEndDate
    );
    this.utilityService.hideLoading();
    this.dateTimeClose = event[event.length - 1];
  }

  goBack() {
    var selected_tab = localStorage.getItem('selected_tab');
    if (selected_tab == 'pending_request') {
      this.router.navigate(['tabs/pending-requests']);
    } else {
      this.router.navigate(['tabs/closed-requests']);
    }
  }

  async onSelectionChange(event) {
    if (!this.isValidOfferChange) {
      this.isValidOfferChange = true;
      return;
    }
    this.isDisableCancelBtn = false;
    this.selectedItems = this.OfferListEnum[event.detail.value];
    this.utilityService.showLoadingwithoutDuration();
    await this.getCalendarView(
      this.selectedStatusType,
      this.selectedItems,
      this.selectedDate,
      this.monthStartDate,
      this.monthEndDate
    );
    this.utilityService.hideLoading();
  }
  async statusChange(event) {
    if (!this.isValidStatusChange) {
      this.isValidStatusChange = true;
      return;
    }
    this.isDisableCancelBtn = false;
    this.selectedStatusType = this.StatusTypesEnum[event.detail.value];
    this.utilityService.showLoadingwithoutDuration();
    await this.getCalendarView(
      this.selectedStatusType,
      this.selectedItems,
      this.selectedDate,
      this.monthStartDate,
      this.monthEndDate
    );
    this.utilityService.hideLoading();
  }
  async onMonthChange(e) {
    let date = new Date(e.newMonth.dateObj);
    this.monthStartDate = this.datePipe.transform(
      new Date(date.getFullYear(), date.getMonth(), 1),
      'yyyy/MM/dd'
    );
    this.monthEndDate = this.datePipe.transform(
      new Date(date.getFullYear(), date.getMonth() + 1, 0),
      'yyyy/MM/dd'
    );
    await this.getCalendarView(
      this.selectedStatusType,
      this.selectedItems,
      this.selectedDate,
      this.monthStartDate,
      this.monthEndDate
    );
  }
  async getCalendarView(
    statusType,
    offerTypeEnum,
    dateTime,
    startDate,
    endDate
  ) {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.existingDate = [];
    this.utilityService.showLoadingwithcustomDuration(10000);

    const getMethod = this.offerService.hrAdminCalendarView(
      statusType,
      offerTypeEnum,
      dateTime,
      startDate,
      endDate
    );
    await getMethod.then((res: any) => {
      if (res['Success']) {
        this.utilityService.hideLoading();
        this.calendarView = res.Data;
        if (!this.isDateCircleShow) {
          this.isDateCircleShow = true;
          this.getTimings(this.calendarView);
          return;
        }
        this._daysConfig = [];
        this.getTimings(this.calendarView);
        this.calendarView.forEach((element) => {
          if (
            element.Status == 0 ||
            element.Status == 1 ||
            element.Status == 4 ||
            (element.Status == 2 &&
              element.offerType == this.offerTypesEnum.VTOModule) ||
            element.Status == 5 ||
            (element.Status == 6 &&
              element.offerType != this.offerTypesEnum.CallOffModule &&
              element.offerType != this.offerTypesEnum.EarlyOutModule &&
              element.offerType != this.offerTypesEnum.FlexWorkModule &&
              element.offerType != this.offerTypesEnum.TransferRequestModule &&
              element.offerType != this.offerTypesEnum.VTOModule &&
              element.offerType != this.offerTypesEnum.LateInModule)
          ) {
            this._daysConfig.push({
              // date:this.test(element),
              cssClass: this.getPendingColor(element),
              date: this.getRequestValue(element),
              marked: true,
            });
          } else if (
            element.Status == 7 ||
            (element.Status == 2 &&
              element.offerType != this.offerTypesEnum.VTOModule) ||
            element.Status == 8 ||
            element.Status == 9 ||
            element.Status == 3 ||
            (element.Status == 6 &&
              (element.offerType == this.offerTypesEnum.CallOffModule ||
                element.offerType == this.offerTypesEnum.EarlyOutModule ||
                element.offerType == this.offerTypesEnum.FlexWorkModule ||
                element.offerType ==
                  this.offerTypesEnum.TransferRequestModule ||
                element.offerType == this.offerTypesEnum.VTOModule ||
                element.offerType == this.offerTypesEnum.LateInModule))
          ) {
            this._daysConfig.push({
              cssClass: this.getClosedColor(element),
              date: this.getRequestValue(element),
              marked: true,
            });
          } else if (
            element.Status == 6 &&
            element.offerType == this.offerTypesEnum.CallOffModule
          ) {
            this._daysConfig.push({
              cssClass:
                this.existingDate.indexOf(element.dateToSkip) === -1
                  ? 'greenCss'
                  : 'orangeColor',
              date: this.getRequestValue(element),
              marked: true,
            });
          }
        });
      } else {
        this.calendarView = [];
        if(this.isDateCircleShow){
          this._daysConfig = [];
        }
      }
      this.optionsMulti = {
        pickMode: 'single',
        daysConfig: this._daysConfig,
        from: 1,
        to: 0,
      };
      (err) => {
        this.utilityService.hideLoading();
        this.calendarView = [];
      };
    });
  }
  getRequestValue(element) {
    if (
      element.offerType == this.offerTypesEnum['VTOModule'] ||
      element.offerType == this.offerTypesEnum['CallOffModule'] ||
      element.offerType == this.offerTypesEnum['EarlyOutModule'] ||
      element.offerType == this.offerTypesEnum['FlexWorkModule'] ||
      element.offerType == this.offerTypesEnum['LateInModule']
    ) {
      const staticDate = new Date(
        utils.getConvertedToDateOnly(element.dateToSkip).setHours(0, 0, 0)
      );
      let index = this._daysConfig.findIndex(
        (x) => x.date.toString() == staticDate.toString()
      );
      if (index != -1) {
        this._daysConfig.splice(index, 1);
      }
      this.existingDate.push(staticDate.toDateString());
      return staticDate;
    }
    if (
      element.offerType == this.offerTypesEnum['VOTRequestModule'] ||
      element.offerType == this.offerTypesEnum['ShiftSwapModule']
    ) {
      const staticDate = new Date(
        utils.getConvertedToDateOnly(element.dateToWork).setHours(0, 0, 0)
      );
      let index = this._daysConfig.findIndex(
        (x) => x.date.toString() == staticDate.toString()
      );
      if (index != -1) {
        this._daysConfig.splice(index, 1);
      }
      this.existingDate.push(staticDate.toDateString());
      return staticDate;
    }
    if (element.offerType == this.offerTypesEnum['TransferRequestModule']) {
      const staticDate = new Date(
        utils.getConvertedToDateOnly(element.CreatedDate).setHours(0, 0, 0)
      );
      let index = this._daysConfig.findIndex(
        (x) => x.date.toString() == staticDate.toString()
      );
      if (index != -1) {
        this._daysConfig.splice(index, 1);
      }
      this.existingDate.push(staticDate.toDateString());
      return staticDate;
    }
    if (element.offerType == this.offerTypesEnum['TimeKeepingModule']) {
      const staticDate = new Date(
        utils.getConvertedToDateOnly(element.TimeOffStartDate).setHours(0, 0, 0)
      );
      let index = this._daysConfig.findIndex(
        (x) => x.date.toString() == staticDate.toString()
      );
      if (index != -1) {
        this._daysConfig.splice(index, 1);
      }
      this.existingDate.push(staticDate.toDateString());
      return staticDate;
    }
  }

  getPendingColor(element: any): any {
    if (
      !!element &&
      (element.offerType == this.offerTypesEnum.VTOModule ||
        element.offerType == this.offerTypesEnum.CallOffModule ||
        element.offerType == this.offerTypesEnum.EarlyOutModule ||
        element.offerType == this.offerTypesEnum.FlexWorkModule ||
        element.offerType == this.offerTypesEnum.LateInModule)
    ) {
      return this.existingDate.indexOf(
        new Date(new Date(element.dateToSkip).setHours(0, 0, 0)).toDateString()
      ) === -1
        ? 'redCss'
        : 'orangeColor';
    }
    if (
      !!element &&
      (element.offerType == this.offerTypesEnum.VOTRequestModule ||
        element.offerType == this.offerTypesEnum.ShiftSwapModule)
    ) {
      return this.existingDate.indexOf(
        new Date(new Date(element.dateToWork).setHours(0, 0, 0)).toDateString()
      ) === -1
        ? 'redCss'
        : 'orangeColor';
    }
    if (
      !!element &&
      element.offerType == this.offerTypesEnum['TransferRequestModule']
    ) {
      return this.existingDate.indexOf(
        new Date(new Date(element.CreatedDate).setHours(0, 0, 0)).toDateString()
      ) === -1
        ? 'redCss'
        : 'orangeColor';
    }
    if (
      !!element &&
      element.offerType == this.offerTypesEnum['TimeKeepingModule']
    ) {
      return this.existingDate.indexOf(
        new Date(
          new Date(element.TimeOffStartDate).setHours(0, 0, 0)
        ).toDateString()
      ) === -1
        ? 'redCss'
        : 'orangeColor';
    }
  }
  getClosedColor(element: any): any {
    if (
      !!element &&
      (element.offerType == this.offerTypesEnum.VTOModule ||
        element.offerType == this.offerTypesEnum.CallOffModule ||
        element.offerType == this.offerTypesEnum.EarlyOutModule ||
        element.offerType == this.offerTypesEnum.FlexWorkModule ||
        element.offerType == this.offerTypesEnum.LateInModule)
    ) {
      return this.existingDate.indexOf(
        new Date(new Date(element.dateToSkip).setHours(0, 0, 0)).toDateString()
      ) === -1
        ? 'greenCss'
        : 'orangeColor';
    }
    if (
      !!element &&
      (element.offerType == this.offerTypesEnum.VOTRequestModule ||
        element.offerType == this.offerTypesEnum.ShiftSwapModule)
    ) {
      return this.existingDate.indexOf(
        new Date(new Date(element.dateToWork).setHours(0, 0, 0)).toDateString()
      ) === -1
        ? 'greenCss'
        : 'orangeColor';
    }
    if (
      !!element &&
      element.offerType == this.offerTypesEnum['TransferRequestModule']
    ) {
      return this.existingDate.indexOf(
        new Date(new Date(element.CreatedDate).setHours(0, 0, 0)).toDateString()
      ) === -1
        ? 'greenCss'
        : 'orangeColor';
    }
    if (
      !!element &&
      element.offerType == this.offerTypesEnum['TimeKeepingModule']
    ) {
      return this.existingDate.indexOf(
        new Date(
          new Date(element.TimeOffStartDate).setHours(0, 0, 0)
        ).toDateString()
      ) === -1
        ? 'greenCss'
        : 'orangeColor';
    }
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
  }
  getTimings(list: any) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].status == this.offerStatus.accepted) {
        list[i].statusClass = 'success';
      } else if (
        list[i].status == this.offerStatus.pendingProceed ||
        list[i].status == this.offerStatus.proceed
      ) {
        list[i].statusClass = 'success';
      } else if (list[i].status == this.offerStatus.available) {
        list[i].statusClass = 'success';
      } else if (
        list[i].status == this.offerStatus.rejected ||
        list[i].status == this.offerStatus.expired ||
        list[i].status == this.offerStatus.notinterested
      ) {
        list[i].statusClass = 'danger';
      } else if (
        list[i].status == this.offerStatus.hrApproval ||
        list[i].status == this.offerStatus.pendingMatch
      ) {
        list[i].statusClass = 'danger';
      } else if (list[i].status == this.offerStatus.scheduleUpdated) {
        list[i].statusClass = 'success';
      }
    }
  }

  async setPage(pageInfo) {
    this.selected = [];
    this.selectedRecords = [];
    this.page.pageNumber = pageInfo.offset;
    if (this.role === Role.hrAdmin) {
      this.utilityService.showLoadingwithoutDuration();
      // await this.getSettingByCompanyIDAsync();
      await this.getCalendarView(
        this.page.pageNumber + 1,
        this.selectedItems,
        this.selectedStatusType,
        this.monthStartDate,
        this.monthEndDate
      );
    }
    this.utilityService.hideLoading();
  }

  openModal(template: TemplateRef<any>, type, data) {
    this.IsVto = false;
    this.IsVot = false;
    if (type === 'approve') {
      this.type = type;
    } else {
      this.type = type;
    }
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-md',
      backdrop: 'static',
    });
    this.offerId.push(data.offerId);
  }
  async getSettingByCompanyIDAsync() {
    let module = SubscriptionType.filter((item) => {
      return item.id === OfferTypesEnum.EarlyOutModule;
    });
    this.moduleId = module[0].id;
    this.utilityService.showLoadingwithoutDuration();
    await this.CallInRequestService.getSettingByCompanyID(
      this.moduleId,
      Number(localStorage.getItem(Constants.COMPANYID))
    ).then(
      (res: any) => {
        if (res['Success']) {
          this.utilityService.hideLoading();
          if (res.Data.length > 0) {
            res.Data.map((item) => {
              if (item.SettingType === 'PaidTimeOff' && item.OfferType == 7) {
                item.Name = 'Paid Time Off';
                if (item.Enable == true) {
                  this.isPaidTimeOff = true;
                } else {
                  this.isPaidTimeOff = false;
                }
              } else if (
                item.SettingType === 'Early-Out UTO Message' &&
                item.OfferType == 7
              ) {
                if (item.Enable == true) {
                  this.isEarlyOutUTOEnabled = true;
                }
                else{
                  this.isEarlyOutUTOEnabled = false;
                }
              }
            });
          }
        } else {
          this.utilityService.hideLoading();
        }
      },
      (err) => {
        this.utilityService.hideLoading();
      }
    );
  }
  async openApprove(template: TemplateRef<any>, data: any) {
    this.utilityService.showLoadingwithoutDuration();
    await this.getSettingByCompanyIDAsync();
    if (!this.isEarlyOutUTOEnabled) {
      this.earlyOutService
        .proceedHroffer({
          offerId: data.offerId,
          offerType: data.offerType,
          status: data.status,
          companyId: data.companyId,
          departmentId: data.departmentId,
          createdBy: data.createdBy,
          createdDate: data.createdDate,
          shiftToSkip: data.shiftToSkip,
          dateToSkip: data.dateToSkip,
          vtoStartTime: data.vtoStartTime,
          vtoEndTime: data.vtoEndTime,
          ReasonId: data.ReasonId,
          uTOHours: data.uTOHours,
          isUtoBalance: false,
          isWarningCompleted: false,
          approvedDate: data.approvedDate,
          approvedBy: data.approvedBy,
          IsPaidOff: data.isPaidTimeOff,
          IsHRCallBack: data.IsHRCallBack,
          OtherReason: data.OtherReason,
          IsFMLA: data.IsFMLA,
        })
        .then(async (res) => {
          if (res['Success']) {
            this.utilityService.hideLoading();
            this.utilityService.showSuccessToast(
              Constants.EARLY_OUT_REQUEST_PROCESS_SUCCESS_MSG
            );
            await this.getCalendarView(
              this.selectedStatusType,
              this.selectedItems,
              this.selectedDate,
              this.monthStartDate,
              this.monthEndDate
            );
          } else {
            this.utilityService.hideLoading();
            this.utilityService.showErrorToast(res['Message']);
          }
        });
      return;
    }
    if (data) {
      this.Offer = data;
    } else {
      this.Offer = null;
    }
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-lg pop-up-show',
      backdrop: 'static',
    });
  }
  close(event) {
    this.isConfirmed = false;
    this.isConfirmedFlex = false;
    this.isApprove = false;
    this.isReject = false;
    this.modalRef.hide();
    //this.getCalendarView(this.selectedStatusType, this.selectedItems, this.selectedDate);
  }
  async closeModal(event) {
    //   this.getAllModulePendingList(this.currentPage, this.OfferRequestTypesEnum[event.detail.value] );

    //   this.modalRef.hide();
    // }
    if (event) {
      this.calendarView = [];
      //this.modalRef.hide();
      this.utilityService.showLoadingwithoutDuration();
      await this.getCalendarView(
        this.selectedStatusType,
        this.selectedItems,
        this.selectedDate,
        this.monthStartDate,
        this.monthEndDate
      );
      this.utilityService.hideLoading();
      //this.setPage({ offset: 0 });
    }
    //this.getCalendarView(this.selectedStatusType, this.selectedItems, this.selectedDate);
    this.modalRef.hide();
  }
  checkApproveReject(type, data) {
    this.IsSwap = false;
    if (type === 1) {
      this.IsType = true;
    } else if (type === 0) {
      this.IsType = false;
    }

    this.isConfirmed = true;
    if (this.IsType === Constants.APPROVE) {
      this.isApprove = true;
      this.confirmSaveBtn = Constants.PENDING_CONFIRM_BTN_TEXT;
      this.confirmCancelBtn = Constants.PENDING_CANCEL_BTN_TEXT;
      this.confirmMsg = Constants.APPROVE_MSG;
    } else {
      this.isReject = true;
      this.confirmSaveBtn = Constants.YES;
      this.confirmCancelBtn = Constants.NO;
      this.confirmMsg = Constants.REJECT_MSG;
    }
    this.offerId = data.offerId;
  }

  ApproveReject(id) {
    this.isConfirmed = false;
    this.utilityService.showLoadingwithoutDuration();
    if (this.isApprove) {
      this.offerService.approveOffer(id).then(
        async (res) => {
          if (res['Success']) {
            this.utilityService.showSuccessToast(
              Constants.OFFER_APPROVE_SUCCESS_MSG
            );
            this.calendarView = [];

            await this.getCalendarView(
              this.selectedStatusType,
              this.selectedItems,
              null,
              this.monthStartDate,
              this.monthEndDate
            );
            this.utilityService.hideLoading();
            //this.setPage({ offset: 0 });
            this.isApprove = false;
          } else {
            this.utilityService.hideLoading();
            this.utilityService.showErrorToast(res['Message']);
          }
        },
        (err) => {}
      );
    } else {
      this.utilityService.showLoading();
      this.offerService.rejectOffer(id).then(
        async (res) => {
          if (res['Success']) {
            this.utilityService.hideLoading();
            this.utilityService.showSuccessToast(
              Constants.OFFER_REJECT_SUCCESS_MSG
            );
            this.calendarView = [];
            this.utilityService.showLoadingwithoutDuration();
            await this.getCalendarView(
              this.selectedStatusType,
              this.selectedItems,
              null,
              this.monthStartDate,
              this.monthEndDate
            );
            this.utilityService.hideLoading();
          } else {
            this.utilityService.hideLoading();
            this.utilityService.showErrorToast(res['Message']);
          }
        },
        (err) => {}
      );
    }
  }
  Approved(isApproved, TimeOffUserRequestId) {
    this.IsTimeOff = false;
    this.utilityService.showLoading();
    this.idlist.push(TimeOffUserRequestId);
    this.offerService
      .approvedDeniedUserRequests(this.idlist, isApproved)
      .then(async (res) => {
        if (res['Success']) {
          this.calendarView = [];

          if (isApproved) {
            this.utilityService.showSuccessToast(
              Constants.TIME_OFF_REQUEST_APPROVE_MSG
            );
            this.utilityService.showLoadingwithoutDuration();
            await this.getCalendarView(
              this.selectedStatusType,
              this.selectedItems,
              this.selectedDate,
              this.monthStartDate,
              this.monthEndDate
            );
            this.utilityService.hideLoading();
          } else {
            this.utilityService.showSuccessToast(
              Constants.TIME_OFF_REQUEST_REJECT_MSG
            );
            this.utilityService.showLoadingwithoutDuration();
            await this.getCalendarView(
              this.selectedStatusType,
              this.selectedItems,
              this.selectedDate,
              this.monthStartDate,
              this.monthEndDate
            );
            this.utilityService.hideLoading();
          }
        } else {
          this.utilityService.showErrorToast(res['Message']);
        }
      });
  }
  openFlexModal(template: TemplateRef<any>, data: any) {
    this.IsFlex = false;
    if (data) {
      this.Offer = data;
    } else {
      this.Offer = null;
    }
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-lg',
      backdrop: 'static',
    });
    this.offerId.push(data.offerId);
  }
  openApproveProcess(template: TemplateRef<any>, data: any) {
    this.IsLateIn = false;
    this.IsCallIn = false;
    if (data) {
      this.Offer = data;
    } else {
      this.Offer = null;
    }
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-lg',
      backdrop: 'static',
    });
    this.offerId.push(data.offerId);
  }
  Process() {
    this.IsCallIn = false;
    this.utilityService.showLoading();
    const postMethod = this.CallInRequestService.approveCallOffOffer(
      this.selectedRecords
    );
    postMethod.then(
      async (response) => {
        if (response['Success']) {
          this.utilityService.hideLoading();
          this.utilityService.showSuccessToast(
            Constants.CALL_OFF_REQUEST_APPROVE_MSG
          );
          this.calendarView = [];
          this.utilityService.showLoadingwithoutDuration();
          await this.getCalendarView(
            this.selectedStatusType,
            this.selectedItems,
            null,
            this.monthStartDate,
            this.monthEndDate
          );
          this.utilityService.hideLoading();
        } else {
          this.utilityService.hideLoading();
          this.utilityService.showErrorToast(response['Message']);
        }
      },
      (err) => {
        this.utilityService.hideLoading();
      }
    );
  }
  openDenailModal(template: TemplateRef<any>, data: any) {
    this.IsTransfer = false;
    if (data) {
      this.Offer = data;
    } else {
      this.Offer = null;
    }
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-md',
      backdrop: 'static',
    });
    this.offerId.push(data.offerId);
  }
  async closeApproveModal(event) {
    if (event) {
      this.calendarView = [];
      this.oldData = [];
      this.setPage({ offset: 0 });
    }
    this.utilityService.showLoadingwithoutDuration();
    await this.getCalendarView(
      this.selectedStatusType,
      this.selectedItems,
      this.selectedDate,
      this.monthStartDate,
      this.monthEndDate
    );
    this.utilityService.hideLoading();
    this.modalRef.hide();
  }
  openTransferApproveModal(template: TemplateRef<any>, data: any) {
    this.IsTransfer = false;
    if (data) {
      this.Offer = data;
    } else {
      this.Offer = null;
    }
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-md',
      backdrop: 'static',
    });
    this.offerId.push(data.offerId);
  }

  transferProcess(event) {
    this.IsTransfer = false;
    this.utilityService.showLoading();
    const postMethod = this.offerService.TransferProcessOffer(
      this.offerId.push(event.offerId)
    );
    postMethod.then(
      async (response) => {
        if (response['Success']) {
          this.utilityService.hideLoading();
          this.utilityService.showSuccessToast(
            Constants.TRANSFER_REQUEST_PROCESS_MSG
          );
          this.calendarView = [];
          this.utilityService.showLoadingwithoutDuration();
          await this.getCalendarView(
            this.selectedStatusType,
            this.selectedItems,
            this.selectedDate,
            this.monthStartDate,
            this.monthEndDate
          );
          this.utilityService.hideLoading();
        } else {
          this.utilityService.hideLoading();
          this.utilityService.showErrorToast(response['Message']);
        }
      },
      (err) => {
        this.utilityService.hideLoading();
      }
    );
  }

  onClickDelete(data) {
    this.deleteId = data.offerId;
    this.isConfirmedFlex = true;
  }
  delete(id) {
    this.isConfirmedFlex = false;
    this.IsFlex = false;
    this.utilityService.showLoading();
    this.offerService.deleteOffer(id).then(
      async (res) => {
        if (res['Success']) {
          this.utilityService.hideLoading();
          this.utilityService.showSuccessToast(
            Constants.FLEX_REQUEST_DELETE_SUCCESS_MSG
          );

          this.calendarView = [];
          this.utilityService.showLoadingwithoutDuration();
          await this.getCalendarView(
            this.selectedStatusType,
            this.selectedItems,
            this.selectedDate,
            this.monthStartDate,
            this.monthEndDate
          );
          this.utilityService.hideLoading();
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

  loadData(event) {
    setTimeout(async () => {
      if (this.calendarView.length > 0) {
        // if (!this.loadmore) {
        //   event.target.disabled = true;
        // }
        this.page.pageNumber += 1;
        this.utilityService.showLoadingwithoutDuration();
        await this.getCalendarView(
          this.page.pageNumber,
          this.selectedItems,
          this.selectedStatusType,
          this.monthStartDate,
          this.monthEndDate
        );
        this.utilityService.hideLoading();
        event.target.complete();
      }
    }, 100);
  }
  async clearData() {
    this.isValidOfferChange = false;
    this.isValidStatusChange = false;
    this.selectedReason['value'] = 'All Request';
    this.statusDrpdwn['value'] = 'All Status';
    this.selectedDate = null;
    this.dateRange = { from: '', to: '' };
    this.isDisableCancelBtn = true;
    this.isDateCircleShow = true;
    this.utilityService.showLoadingwithoutDuration();
    await this.getCalendarView(
      (this.selectedStatusType = 0),
      (this.selectedItems = 0),
      this.selectedDate,
      this.monthStartDate,
      this.monthEndDate
    );
    this.utilityService.hideLoading();
    this.isValidOfferChange = true;
    this.isValidStatusChange = true;
  }

  convertDateToSkipShortDate(data){
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
getFormatedDate(date){
  return this.datePipe.transform(new Date(date), 'MM/dd/yyyy hh:mm a');
}
}
