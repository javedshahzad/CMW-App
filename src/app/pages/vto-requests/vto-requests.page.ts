import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import * as moment from 'moment';
import { Constants } from 'src/app/constant/constants';
import { OfferStatus, Role } from 'src/app/models/role-model';
import { VtoService } from '../../services/vto/vto.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
@Component({
  selector: 'app-vto-requests',
  templateUrl: './vto-requests.page.html',
  styleUrls: ['./vto-requests.page.scss'],
})
export class VtoRequestsPage implements OnInit {
  offerStatus = OfferStatus;
  @ViewChild('table', { static: false }) table: any;
  @ViewChild('filterTextValue', { static: false }) filterTextValue;
  @ViewChild('workDateValue', { static: false }) workDateValue;
  @ViewChild('shiftValue', { static: false }) shiftValue;
  @ViewChild('departmentValue', { static: false }) departmentValue;
  offerList: any = [];
  public action: any;
  totalItems: any;
  columns = [];
  searchSort: any;
  id: any;
  loadmore = false;
  rowsOnPage = Constants.ROWS_ON_PAGE;
  currentPage = Constants.CURRENT_PAGE;
  page: any;
  isConfirmed = false;
  shiftList = [];
  departmentList = [];
  selected = [];
  allRowsSelected = [];
  selectedRecords = [];
  deleteId: string;
  role: number;
  roleEnum = Role;
  companyId: number;
  filterValue = [];
  today = new Date();
  nextweekDate = new Date(this.today.getTime() + 7 * 24 * 60 * 60 * 1000);
  nextDate: any;
  searchDate: any;
  commonShiftList = [];
  public searchfield: any;
  constructor(
    public modal: ModalController,
    public router: Router,
    private utilityService: UtilityService,
    public route: ActivatedRoute,
    private vtoService: VtoService,
    private datepipe: DatePipe
  ) {
    this.route.queryParams.subscribe((params) => {
      this.action = params.action;
    });
  }

  async ionViewWillEnter() {
    if (this.action === 'isRequestedOffer') {
      this.columns = [
        'departmentId',
        'dateToSkip',
        'shiftToSkip',
        'departmentName',
        'offerStatusStr',
        'dateToSkipShortDate',
        'timeTypeStr',
        'vtoType',
        'vtoStartTime',
        'vtoEndTime',
        'vtoTypestr',
        'createdByUsername',
        'acceptedByUsername',
        'approvedByObj.companyUsername',
        'acceptedByShift',
        'shiftToSkipTitle',
      ];
    } else {
      this.columns = [
        'departmentId',
        'dateToSkip',
        'shiftToSkip',
        'departmentName',
        'vtoTypestr',
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
    this.offerList = [];
    await this.setPage({ offset: 0 });
    if (this.action === 'isRequestedOffer') {
      await this.getVtoRequestList(this.currentPage);
    } else {
      await this.getAvailableVtoRequestList(this.currentPage);
    }
  }
  ngOnInit() {
    this.isConfirmed = false;
  }

  setPage(pageInfo) {
    this.selected = [];
    this.selectedRecords = [];
    this.page.pageNumber = pageInfo.offset;
    // if (this.action == "isRequestedOffer") {
    //   this.getVtoRequestList(this.page.pageNumber + 1);
    // }
    // else {
    //   this.getAvailableVtoRequestList(this.page.pageNumber + 1);
    // }
  }

  goBack() {
    const selectedTab = localStorage.getItem('selected_tab');
    if (selectedTab === 'my_request') {
      this.router.navigate(['/tabs/my-requests']);
    } else {
      this.router.navigate(['/tabs/available-requests']);
    }
  }

  redirectToVTORequest(vtoData: any) {
    vtoData.action = this.action;
    localStorage.setItem(Constants.VTO_DATA, JSON.stringify(vtoData));
    this.router.navigate(['/tabs/vto-request-detail']);
  }

  async openVTO(value) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
         action:'add'
      },
      replaceUrl: true
  };
    this.router.navigate(['/tabs/add-vto-request'], navigationExtras);
  }

  async getVtoRequestList(currentPage) {
    if (
      (!!this.filterTextValue && !!this.filterTextValue.nativeElement.value) ||
      (!!this.shiftValue && !!this.shiftValue.nativeElement.value) ||
      (!!this.departmentValue && !!this.departmentValue.nativeElement.value) ||
      (!!this.workDateValue && this.workDateValue.nativeElement.value)
    ) {
      this.workDateValue.nativeElement.value = this.datepipe.transform(
        this.setnewDate(this.nextweekDate),
        'yyyy-MM-dd'
      );
      this.searchSort.Search.Value = this.filterTextValue.nativeElement.value;
      this.searchSort.Search.ColumnNameList = this.columns;
      this.searchSort.Page = currentPage;
      await this.filterData();
    } else {
      if (this.role === this.roleEnum.manager) {
        this.nextDate = this.datepipe.transform(
          this.setnewDate(this.nextweekDate),
          'yyyy-MM-dd'
        );
      } else {
        this.nextDate = null;
      }
      this.utilityService.showLoadingwithoutDuration();
      await this.vtoService
        .getMyVtoRequestList(currentPage, this.rowsOnPage, this.nextDate)
        .then(
          (res: any) => {
            if (res['Success']) {
              this.offerList = res.Data.results;
              if (this.offerList.length > Constants.ROWS_ON_PAGE) {
                this.loadmore = true;
              } else {
                this.loadmore = false;
              }
              this.getTimings(this.offerList);
              this.totalItems = res.Data.totalNumberOfRecords;
            } else {
              this.offerList = [];
              this.totalItems = 0;
            }
            this.utilityService.hideLoading();
          },
          (err) => {
            this.utilityService.hideLoading();
            this.offerList = [];
          }
        );
    }
  }

  async getAvailableVtoRequestList(currentPage) {
    if (!!this.filterTextValue && !!this.filterTextValue.nativeElement.value) {
      this.workDateValue.nativeElement.value = this.datepipe.transform(
        this.setnewDate(this.nextweekDate),
        'yyyy-MM-dd'
      );
      this.searchSort.Search.Value = this.filterTextValue.nativeElement.value;
      this.searchSort.Search.ColumnNameList = this.columns;
      this.searchSort.Page = currentPage;
      await this.filterData();
    } else {
      this.nextDate = this.datepipe.transform(
        this.setnewDate(this.nextweekDate),
        'yyyy-MM-dd'
      );
      this.utilityService.showLoadingwithoutDuration();
      const getMehod =
        this.role === this.roleEnum.manager
          ? this.vtoService.getManagerAvailableVtoRequestList(
              currentPage,
              this.rowsOnPage,
              this.nextDate
            )
          : this.vtoService.getAvailableVtoRequestList(
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
            this.offerList = res.Data.results;
            if (this.offerList.length > Constants.ROWS_ON_PAGE) {
              this.loadmore = true;
            } else {
              this.loadmore = false;
            }
            this.getTimings(this.offerList);
            this.totalItems =
              res.Data.totalNumberOfRecords === 0
                ? 0
                : res.Data.totalNumberOfRecords;
          } else {
            this.offerList = [];
            this.totalItems = 0;
          }
          this.utilityService.hideLoading();
        },
        (err) => {
          this.utilityService.hideLoading();
          this.offerList = [];
        }
      );
    }
  }

  setnewDate(date) {
    const dateObj = {
      year: +this.datepipe.transform(date, 'yyyy'),
      month: +this.datepipe.transform(date, 'MM'),
      day: +this.datepipe.transform(date, 'dd'),
    };
    return new Date(dateObj.year, dateObj.month - 1, dateObj.day);
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
      }
    }
  }

  async filterData() {
    this.utilityService.showLoading();
    await this.vtoService
      .vtoRequestOfferDataFilter(
        this.searchSort,
        this.role === this.roleEnum.manager
          ? !!this.searchDate
            ? this.searchDate
            : this.nextDate
          : null
      )
      .then(
        (res) => {
          if (res['data'] && res['data'].length > 0) {
            this.offerList = res['data'];
            this.totalItems = res['recordsFiltered'];
          } else {
            this.offerList = [];
            this.totalItems = 0;
          }
          this.utilityService.hideLoading();
        },
        (err) => {
          this.utilityService.hideLoading();
          this.offerList = [];
          this.totalItems = 0;
        }
      );
  }

  get enableDisableCloseIcon(): boolean {
    if (!!this.filterTextValue && !!this.filterTextValue.nativeElement.value) {
      return false;
    }
    return true;
  }

  loadData(event) {
    setTimeout(async () => {
      if (this.offerList.length > 0) {
        this.page.pageNumber += 1;
        console.log('page no', this.page.pageNumber);

        if (this.action === 'isRequestedOffer') {
          await this.getVtoRequestList(this.page.pageNumber);
        } else {
          await this.getAvailableVtoRequestList(this.page.pageNumber);
        }
        event.target.complete();
      }
    }, 100);
  }
}
