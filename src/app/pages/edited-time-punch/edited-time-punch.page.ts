import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { OfferService } from '../../services/offer/offer.service';
import { Constants } from 'src/app/constant/constants';
import { Role, OfferStatus } from 'src/app/models/role-model';
import { UtilityService } from 'src/app/services/utility/utility.service';
import * as moment from 'moment';

@Component({
  selector: 'app-edited-time-punch',
  templateUrl: './edited-time-punch.page.html',
  styleUrls: ['./edited-time-punch.page.scss'],
})
export class EditedTimePunchPage implements OnInit {
  public editedPunchesRequestList: any = [];
  public editedtotalItems: any;
  rowsOnPage = Constants.ROWS_ON_PAGE;
  currentPage = Constants.CURRENT_PAGE;
  offerStatus = OfferStatus;
  searchSort: any;
  columns = [];
  page: any;
  public searchfield: any;
  @ViewChild('filterTextValue', { static: false }) filterTextValue;
  role: number;
  roleEnum = Role;
  totalItems: any;
  public loadmore = false;
  oldData = [];
  pageNo: any;

  constructor(
    private router: Router,
    private offerService: OfferService,
    public utilityService: UtilityService
  ) {}

  ngOnInit() {}

  async ionViewWillEnter() {
    this.columns = [
      'OldDateStr',
      'NewDateStr',
      'OldPunchTypeStr',
      'PunchTypeStr',
      'offerStatusStr',
      'reason',
    ];
    this.page = {
      pageNumber: 1,
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
    this.searchfield = '';
    this.setPage({ offset: 0 });
  }

  
  async setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
    this.editedPunchesRequestList = [];
    this.oldData = [];
    await this.getPunchList(this.page.pageNumber + 1);
  }

  closeModal() {
    this.router.navigate(['/tabs/clock-in-out-request']);
  }

  async getPunchList(currentPage: any) {
    if (!!this.filterTextValue) {
      this.searchSort.Search.Value = this.filterTextValue;
      this.searchSort.Search.ColumnNameList = this.columns;
      this.searchSort.Page = currentPage;
      await this.filterData();
    } else {
      const getMethod = this.offerService.userEditedRequests(currentPage);
      getMethod.then((res: any) => {
        if (res['Success']) {
          this.editedPunchesRequestList = res['Data'].results;
          this.pageNo = res['Data'].pageNumber
          for (var i = 0; i <= this.editedPunchesRequestList.length - 1; i++) {
            this.oldData.push(this.editedPunchesRequestList[i]);
          }
          this.editedtotalItems =
            res['Data'].totalNumberOfRecords === 0
              ? undefined
              : res['Data'].totalNumberOfRecords;
          if ( currentPage  < res['Data'].totalNumberOfPages) {
            this.loadmore = true;
            this.editedPunchesRequestList = this.oldData;
          } else {
            this.loadmore = false;
            this.editedPunchesRequestList = this.oldData;
          }
        } else {
          this.editedPunchesRequestList = [];
          this.loadmore = false;
        }
      });
    }
  }

  async filterData() {
    this.utilityService.showLoadingwithoutDuration();

    const filterList = this.offerService.userEditedDataFilter(this.searchSort);
    await filterList.then(
      (res) => {
        if (res['data'] && res['data'].length > 0) {
          this.utilityService.hideLoading();
          this.editedPunchesRequestList = res['data'];
          this.totalItems = res['recordsFiltered'];
          this.editedtotalItems = res['recordsFiltered'];
        } else {
          this.utilityService.hideLoading();
          this.editedPunchesRequestList = [];
          this.totalItems = 0;
          this.editedtotalItems = 0;
        }
      },
      (err) => {
        this.utilityService.hideLoading();
        this.editedPunchesRequestList = [];
        this.totalItems = 0;
        this.editedtotalItems = 0;
        this.editedPunchesRequestList = [];
        this.editedtotalItems = 0;
      }
    );
  }

  loadData(event) {
    setTimeout(async () => {
      if (this.editedPunchesRequestList.length > 0) {
        this.page.pageNumber += 1;
        this.pageNo += 1
        await this.getPunchList(this.pageNo);
        event.target.complete();
      }
    }, 100);
  }

  async searchRequest(event) {
    this.filterTextValue = event.detail.value;
    console.log(event.detail.value);
    await this.getPunchList(this.page.pageNumber);
  }

  goToTimePunchdetail(punchDetail: any) {
    localStorage.setItem(
      Constants.TIME_PUNCH_DATA,
      JSON.stringify(punchDetail)
    );
    this.router.navigate([`/tabs/time-punch-detail`]);
  }

  
}
