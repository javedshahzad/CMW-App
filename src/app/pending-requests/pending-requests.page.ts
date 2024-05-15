import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import {
  Constants,
  Role,
  OfferRequestTypesEnum,
  SubscriptionType,
  OfferTypesEnum,
  OfferListEnum,
} from '../constant/constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { EventsService } from '../services/events/events.service';
import { OfferService } from '../services/offer/offer.service';
import { UtilityService } from '../services/utility/utility.service';
import { OfferStatus } from '../models/role-model';
import { Offer } from '../models/offer.model';
import { CallInRequestService } from '../services/call-in-request/call-in-request.service';
import { ModalController } from '@ionic/angular';
import { EarlyOutService } from '../services/earlyOut/early-out.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pending-requests',
  templateUrl: './pending-requests.page.html',
  styleUrls: ['./pending-requests.page.scss'],
})
export class PendingRequestsPage implements OnInit {
  @ViewChild('filterTextValue', { static: false }) filterTextValue;
  public isData: boolean;
  keys = Object.keys;
  loadmore = false;
  isConfirmed = false;
  isConfirmedFlex = false;
  isApprove = false;
  isReject = false;
  selected = [];
  offerId: [];
  modalRef: BsModalRef;
  checkedIdx = -1;
  confirmMsg = '';
  page: any;
  confirmSaveBtn = '';
  confirmCancelBtn = '';
  checkedData: any;
  public selectedItems: any = [];
  allModulePendingList: any = [];
  selectedRecords = [];
  requestType: any;
  searchSort: any;
  offerStatus = OfferStatus;
  currentStatus;
  role: number;
  Offer: Offer;
  columns = [];
  oldData = [];
  totalItems: any;
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
  IsClockInOut: boolean = false;
  deleteId: string;
  public searchfield: any;
  OfferListEnum = OfferListEnum;
  OfferRequestTypesEnum = OfferRequestTypesEnum;
  offerArrayValues = Object.values(OfferListEnum).filter(
    (value) => typeof value === 'string'
  );
  arrayValues = Object.values(OfferListEnum).filter(
    (value) => typeof value === 'number'
  );

  type = '';
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
  public selectedtab: any;
  isEarlyOutUTOEnabled: boolean = false;
  moduleId: number;
  isPaidTimeOff: boolean;
  userId: any;
  constructor(
    private router: Router,
    private routes: ActivatedRoute,
    private offerService: OfferService,
    private utilityService: UtilityService,
    private modalService: BsModalService,
    public modal: ModalController,
    private CallInRequestService: CallInRequestService,
    private earlyOutService: EarlyOutService,
    private datePipe: DatePipe,
  ) {
    console.log('Page called 3');
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
      pageNumber: 0,
      size: this.rowsOnPage,
    };
    this.searchSort = {
      Page: this.page.pageNumber + 1,
      PageSize: Constants.HR_PAGE_ROWS_ON_PAGE,
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

    //set default type

    this.requestType = this.OfferListEnum[0];
    //bind data
    this.selectedItems = 0;
  }

  ngOnInit() {}

  async ionViewWillEnter() {
    try {
      this.utilityService.showLoadingwithoutDuration();
      localStorage.setItem('selected_tab', 'pending_request');
      if (this.allModulePendingList) {
        this.allModulePendingList = [];
        this.oldData = [];

        await this.getAllModulePendingList(
          this.currentPage,
          this.selectedItems
        );
      }
      this.userId = Number(localStorage.getItem(Constants.USERID));
      await this.getRequest();
      // await this.getSettingByCompanyIDAsync();
      console.log(this.offerStatus, 'status');
      this.searchfield = '';
      //this.setPage({ offset: 0 });
      this.utilityService.hideLoading();
    } catch (e) {
      console.log(e);
      this.utilityService.hideLoading();
    }
  }

  goToFeedback(){
    this.router.navigate(['/tabs/feedback-request']);
  }

 async onSelectionChange(event) {
    this.allModulePendingList = [];
    this.oldData = [];
    this.IsVot = false;
    this.selectedRecords = [];
    this.checkedData = null;
    this.IsSwap = false;
    this.IsTimeOff = false;
    this.IsVto = false;
    this.IsFlex = false;
    this.IsEarlyGo = false;
    this.IsCallIn = false;
    this.IsLateIn = false;
    this.IsTransfer = false;
    this.IsClockInOut = false;
    this.selectedItems = this.OfferListEnum[event.detail.value];

    await this.getAllModulePendingList(this.currentPage, this.selectedItems);
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
  searchRequest(event) {
    this.filterTextValue = event.detail.value;
    this.getAllModulePendingList(this.currentPage, this.selectedItems);
  }

  filterData() {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoading();
    const filterMethod = this.offerService.pendingApprovalRequestDataFilter(
      this.searchSort,
      this.selectedItems
    );
    filterMethod.then(
      (res) => {
        this.utilityService.hideLoading();
        if (res['data'] && res['data'].length > 0) {
          this.allModulePendingList = res['data'];
          if (res['data']) {
            this.isData = true;
          }
          this.getTimings(this.allModulePendingList);
        } else {
          this.totalItems = undefined;
          this.allModulePendingList = [];
          this.isData = false;
        }
      },
      (err) => {
        this.utilityService.hideLoading();
        this.allModulePendingList = [];
        this.totalItems = undefined;
        this.isData = false;
      }
    );
  }
  async getAllModulePendingList(currentPage, OfferTypesEnum) {
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
     await this.offerService
        .getAllModulePendingList(currentPage, OfferTypesEnum)
        .then((res) => {
          if (res['Success']) {
            console.log(res);
            this.utilityService.hideLoading();
            this.allModulePendingList = res['Data'].results;

            for (var i = 0; i <= this.allModulePendingList.length - 1; i++) {
              this.oldData.push(this.allModulePendingList[i]);
            }
            if (this.allModulePendingList.length < Constants.ROWS_ON_PAGE) {
              this.loadmore = true;
              this.allModulePendingList = this.oldData;
            } else {
              this.loadmore = false;
            }
            this.totalItems =
              this.allModulePendingList.totalNumberOfRecords === 0
                ? undefined
                : this.allModulePendingList.totalNumberOfRecords;
            this.getTimings(this.allModulePendingList);

            this.selectedRecords = [];
            this.checkedIdx = -1;
            this.getTimings(this.allModulePendingList);
            this.IsSwap = false;
            this.IsVot = false;
            this.IsTimeOff = false;
            this.IsVto = false;
            this.IsFlex = false;
            this.IsEarlyGo = false;
            this.IsCallIn = false;
            this.IsLateIn = false;
            this.IsTransfer = false;
            this.IsClockInOut = false;
          } else {
            this.utilityService.hideLoading();
            this.allModulePendingList = [];
          }
          (err) => {
            this.utilityService.hideLoading();
            this.allModulePendingList = [];
          };
        });
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
        list[i].statusClass = 'primary';
      } else if (list[i].status == this.offerStatus.available) {
        list[i].statusClass = 'info';
      } else if (
        list[i].status == this.offerStatus.rejected ||
        list[i].status == this.offerStatus.expired
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
      await this.getAllModulePendingList(
        this.page.pageNumber + 1,
        this.selectedItems
      );
    }
  }

  openModal(template: TemplateRef<any>, type) {
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
            this.utilityService.showSuccessToast(
              Constants.EARLY_OUT_REQUEST_PROCESS_SUCCESS_MSG
            );
            this.allModulePendingList = [];
            this.oldData = [];
            await this.getAllModulePendingList(
              this.currentPage,
              this.selectedItems
            );
            this.utilityService.hideLoading();
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
    this.getAllModulePendingList(this.currentPage, this.selectedItems);
  }
  closeModal(event) {
    //   this.getAllModulePendingList(this.currentPage, this.OfferRequestTypesEnum[event.detail.value] );

    //   this.modalRef.hide();
    // }
    if (event) {
      this.allModulePendingList = [];
      this.oldData = [];
      this.setPage({ offset: 0 });
    }
    this.getAllModulePendingList(this.currentPage, this.selectedItems);

    this.modalRef.hide();
  }
  checkApproveReject(type) {
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
    //this.offerId = data.offerId;
  }

  ApproveReject(id) {
    this.isConfirmed = false;
    this.utilityService.showLoading();
    this.utilityService.showLoadingwithThreeSec();
    if (this.isApprove) {
      this.offerService.approveOffer(id).then(
        (res) => {
          if (res['Success']) {
            this.utilityService.showSuccessToast(
              Constants.OFFER_APPROVE_SUCCESS_MSG
            );
            this.allModulePendingList = [];
            this.oldData = [];

            this.utilityService.hideLoading();
            this.getAllModulePendingList(this.currentPage, this.selectedItems);

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
        (res) => {
          if (res['Success']) {
            this.utilityService.hideLoading();
            this.utilityService.showSuccessToast(
              Constants.OFFER_REJECT_SUCCESS_MSG
            );
            this.allModulePendingList = [];
            this.oldData = [];

            this.getAllModulePendingList(this.currentPage, this.selectedItems);
          } else {
            this.utilityService.hideLoading();
            this.utilityService.showErrorToast(res['Message']);
          }
        },
        (err) => {}
      );
    }
  }
  Approved(isApproved) {
    this.IsTimeOff = false;
    this.utilityService.showLoading();
    this.offerService
      .approvedDeniedUserRequests(this.selectedRecords, isApproved)
      .then((res) => {
        if (res['Success']) {
          this.allModulePendingList = [];
          this.oldData = [];

          if (isApproved) {
            this.utilityService.showSuccessToast(
              Constants.TIME_OFF_REQUEST_APPROVE_MSG
            );
            this.getAllModulePendingList(this.currentPage, this.selectedItems);
          } else {
            this.utilityService.showSuccessToast(
              Constants.TIME_OFF_REQUEST_REJECT_MSG
            );
            this.getAllModulePendingList(this.currentPage, this.selectedItems);
          }
        } else {
          this.utilityService.showErrorToast(res['Message']);
        }
      });
  }

  async editedTimePunchApproved(selected, status) {
    this.IsClockInOut = false;
    this.selected.splice(0, this.selected.length);
    this.selected.push(selected);
    this.selectedRecords = this.selected.map((x) => x.offerId);
    await this.offerService
      .approvedDeniedPunchHrRequests(this.selectedRecords, status)
      .then(
        (res) => {
          if (res["Success"]) {
            this.allModulePendingList = [];
            this.oldData = [];
            if (status == 2){
              this.utilityService.showSuccessToast(
                Constants.TIME_PUNCHES_APPROVE_MSG
              );
            }
            else{
              this.utilityService.showSuccessToast(
                Constants.TIME_PUNCHES_REJECT_MSG
              );
            }
          this.getAllModulePendingList(this.currentPage, this.selectedItems);
          } else {
            this.utilityService.showErrorToast(res["Message"]);
          }
        },
        (err) => {}
      );
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
  }
  Process() {
    this.IsCallIn = false;
    this.utilityService.showLoading();
    const postMethod = this.CallInRequestService.approveCallOffOffer(
      this.selectedRecords
    );
    postMethod.then(
      (response) => {
        if (response['Success']) {
          this.utilityService.hideLoading();
          this.utilityService.showSuccessToast(
            Constants.CALL_OFF_REQUEST_APPROVE_MSG
          );
          this.allModulePendingList = [];
          this.oldData = [];

          this.getAllModulePendingList(this.currentPage, this.selectedItems);
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
  }
  closeApproveModal(event) {
    if (event) {
      this.allModulePendingList = [];
      this.oldData = [];
      this.setPage({ offset: 0 });
    }
    this.getAllModulePendingList(this.currentPage, this.selectedItems);
    this.modalRef.hide();
  }
  openTransferApproveModal(template: TemplateRef<any>, data: any) {
    this.IsTransfer = false;
    if (data) {
      this.Offer = data;
    } else {
      this.Offer = null;
    }
    console.log(this.Offer);
    this.modalRef = this.modalService.show(template, {
      class: 'modal-dialog-centered modal-md',
      backdrop: 'static',
    });
  }

  transferProcess(event) {
    this.IsTransfer = false;
    this.utilityService.showLoading();
    const postMethod = this.offerService.TransferProcessOffer(
      this.selectedRecords
    );
    postMethod.then(
      (response) => {
        if (response['Success']) {
          this.utilityService.hideLoading();
          this.utilityService.showSuccessToast(
            Constants.TRANSFER_REQUEST_PROCESS_MSG
          );
          this.allModulePendingList = [];
          this.oldData = [];

          this.getAllModulePendingList(this.currentPage, this.selectedItems);
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
      (res) => {
        if (res['Success']) {
          this.utilityService.hideLoading();
          this.utilityService.showSuccessToast(
            Constants.FLEX_REQUEST_DELETE_SUCCESS_MSG
          );
          this.oldData = [];
          this.allModulePendingList = [];
          this.getAllModulePendingList(this.currentPage, this.selectedItems);
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
    setTimeout(() => {
      if (this.allModulePendingList.length > 0) {
        // if (!this.loadmore) {
        //   event.target.disabled = true;
        // }
        this.page.pageNumber += 1;
        console.log('page no', this.page.pageNumber);

        this.getAllModulePendingList(this.page.pageNumber, this.selectedItems);

        event.target.complete();
      }
    }, 100);
  }
  onSelect(selected, e) {
    this.selectedRecords = [];
    if (selected.offerType == 1 && e.detail.checked == true) {
      this.IsSwap = true;
      this.offerId = selected.offerId;
      this.IsVot = false;
      this.IsTimeOff = false;
      this.IsVto = false;
      this.IsFlex = false;
      this.IsEarlyGo = false;
      this.IsCallIn = false;
      this.IsLateIn = false;
      this.IsTransfer = false;
      this.IsClockInOut = false;
    } else if (selected.offerType == 2 && e.detail.checked == true) {
      this.IsVot = true;
      this.selectedRecords.push(selected.offerId);
      this.checkedData = selected;
      this.IsSwap = false;
      this.IsTimeOff = false;
      this.IsVto = false;
      this.IsFlex = false;
      this.IsEarlyGo = false;
      this.IsCallIn = false;
      this.IsLateIn = false;
      this.IsTransfer = false;
      this.IsClockInOut = false;
    } else if (selected.offerType == 9 && e.detail.checked == true) {
      this.IsTimeOff = true;
      this.selectedRecords.push(selected.TimeOffUserRequestId);
      // this.offerId =  selected.TimeOffUserRequestId;
      this.IsSwap = false;
      this.IsVot = false;
      this.IsVto = false;
      this.IsFlex = false;
      this.IsEarlyGo = false;
      this.IsCallIn = false;
      this.IsLateIn = false;
      this.IsTransfer = false;
      this.IsClockInOut = false;
    } else if (selected.offerType == 5 && e.detail.checked == true) {
      this.IsVto = true;
      this.selectedRecords.push(selected.offerId);
      //this.offerId =  selected.offerId;
      this.IsSwap = false;
      this.IsVot = false;
      this.IsTimeOff = false;
      this.IsFlex = false;
      this.IsEarlyGo = false;
      this.IsCallIn = false;
      this.IsLateIn = false;
      this.IsTransfer = false;
      this.IsClockInOut = false;
    } else if (selected.offerType == 8 && e.detail.checked == true) {
      this.currentStatus = selected.status;
      this.IsFlex = true;
      this.selectedRecords.push(selected.offerId);
      this.checkedData = selected;
      //this.offerId =  selected.offerId;
      this.IsSwap = false;
      this.IsVot = false;
      this.IsTimeOff = false;
      this.IsVto = false;
      this.IsEarlyGo = false;
      this.IsCallIn = false;
      this.IsLateIn = false;
      this.IsTransfer = false;
      this.IsClockInOut = false;
    } else if (selected.offerType == 7 && e.detail.checked == true) {
      this.IsEarlyGo = true;
      this.selectedRecords.push(selected.offerId);
      // this.offerId =  selected.offerId;
      this.checkedData = selected;
      this.IsSwap = false;
      this.IsVot = false;
      this.IsTimeOff = false;
      this.IsVto = false;
      this.IsFlex = false;
      this.IsCallIn = false;
      this.IsLateIn = false;
      this.IsTransfer = false;
      this.IsClockInOut = false;
    } else if (selected.offerType == 6 && e.detail.checked == true) {
      this.IsCallIn = true;
      this.IsEarlyGo = false;
      this.selectedRecords.push(selected.offerId);
      this.checkedData = selected;
      //this.offerId =  selected.offerId;
      this.IsSwap = false;
      this.IsVot = false;
      this.IsTimeOff = false;
      this.IsVto = false;
      this.IsFlex = false;
      this.IsLateIn = false;
      this.IsTransfer = false;
      this.IsClockInOut = false;
    } else if (selected.offerType == 10 && e.detail.checked == true) {
      this.IsLateIn = true;
      this.IsFlex = false;
      this.selectedRecords.push(selected.offerId);
      this.checkedData = selected;
      //this.offerId =  selected.offerId;
      this.IsSwap = false;
      this.IsVot = false;
      this.IsTimeOff = false;
      this.IsVto = false;
      this.IsEarlyGo = false;
      this.IsCallIn = false;
      this.IsTransfer = false;
      this.IsClockInOut = false;
    } else if (selected.offerType == 3 && e.detail.checked == true) {
      this.currentStatus = selected.status;
      this.IsTransfer = true;
      this.IsLateIn = false;
      this.IsFlex = false;
      //selected= selected.status=7;
      //console.log(selected);
      this.selectedRecords.push(selected.offerId);
      this.checkedData = selected;
      //this.offerId =  selected.offerId;
      this.IsSwap = false;
      this.IsVot = false;
      this.IsTimeOff = false;
      this.IsVto = false;
      this.IsEarlyGo = false;
      this.IsCallIn = false;
      this.IsClockInOut = false;
    }
    else if (selected.offerType == 11 && e.detail.checked == true) {
      this.currentStatus = selected.status;
      this.IsClockInOut = true;
      this.IsLateIn = false;
      this.IsFlex = false;
      this.selectedRecords.push(selected.offerId);
      this.checkedData = selected;
      this.IsSwap = false;
      this.IsVot = false;
      this.IsTimeOff = false;
      this.IsVto = false;
      this.IsEarlyGo = false;
      this.IsCallIn = false;
      this.IsTransfer = false;
    }
    else {
      this.IsSwap = false;
      this.IsVot = false;
      this.IsTimeOff = false;
      this.IsVto = false;
      this.IsFlex = false;
      this.IsEarlyGo = false;
      this.IsCallIn = false;
      this.IsLateIn = false;
      this.IsTransfer = false;
      this.IsClockInOut = false;
    }

    // this.selected.splice(0, this.selected.length);
    // selected.map((e) => {
    //   this.selected.push(e);
    //   this.selectedRecords = this.selected.map((x) => x.offerId);
    // });
  }

  goTOCalendarView() {
    this.router.navigate(['/hr-calendar-view']);
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
