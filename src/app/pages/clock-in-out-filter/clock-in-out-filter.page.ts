import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ModalController } from '@ionic/angular';
import {
  bsConfig,
  ComplianceEnum,
  Constants,
} from 'src/app/constant/constants';
import { ClockInOutService } from 'src/app/services/clock-in-out.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-clock-in-out-filter',
  templateUrl: './clock-in-out-filter.page.html',
  styleUrls: ['./clock-in-out-filter.page.scss'],
})
export class ClockInOutFilterPage implements OnInit {
  @ViewChild('filterTextValue', { static: false }) filterTextValue;
  @ViewChild('punchInDate', { static: false }) punchInDate;
  @ViewChild('punchEndDate', { static: false }) punchEndDate;
  @ViewChild('complianceValue', { static: false }) complianceValue;
  page: any;
  nextDate: any;
  searchDate: any;
  searchSort: any;
  bsConfig = bsConfig;
  complianceList = ComplianceEnum;
  public clockInOutRequestList: any = [];
  public totalItems: any;
  clockInOutRequest: any;
  columns = [];
  rowsOnPage = Constants.ROWS_ON_PAGE;
  currentPage = Constants.CURRENT_PAGE;
  userId = Number(localStorage.getItem(Constants.USERID));
  filterValue = [];
  constructor(
    public router: Router,
    public utilityService: UtilityService,
    public modalController: ModalController,
    public clockInOutServic: ClockInOutService,
    private datePipe: DatePipe,
    public keyboard: Keyboard
  ) {
    this.columns = [
      'PunchTime',
      'ComplianceStr',
      'PunchTypeStr',
      'PunchLocationStr',
      'SourceStr',
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
  }

  ngOnInit() {}

  ngAfterViewInit() {
    this.filterValue.push('');
    this.filterValue.push(this.punchInDate.nativeElement.value);
    this.filterValue.push(this.punchInDate.nativeElement.value);
    this.filterValue.push(this.complianceValue.el.value);
    this.columns.forEach((element, i) => {
      if (i < 2) {
        const obj = {
          Data: 'string',
          Searchable: true,
          Orderable: true,
          Name: element,
          Search: {
            Value: this.filterValue[i],
            Regex: 'string',
            isSearchBetweenDates: i === 0 ? true : false,
            endDate: null,
          },
        };
        this.searchSort.Columns.push(obj);
      }
    });
  }
  goBack() {
    this.modalController.dismiss(null);
  }

  setPage(pageInfo) {
    this.page.pageNumber = pageInfo.offset;
  }

  setnewDate(date) {
    const dateObj = {
      year: +this.datePipe.transform(date, 'yyyy'),
      month: +this.datePipe.transform(date, 'MM'),
      day: +this.datePipe.transform(date, 'dd'),
    };
    return new Date(dateObj['year'], dateObj['month'] - 1, dateObj['day']);
  }

  startWorkDateChange(event) {
    this.searchDate = null;
    const findDateColumn = this.searchSort.Columns.find(
      (x) => x.Name === 'PunchTime'
    );
    if (!!findDateColumn) {
      findDateColumn.Search.Value = this.datePipe.transform(
        this.setnewDate(event),
        'MM/dd/yyyy'
      );
      this.searchDate = this.datePipe.transform(
        this.setnewDate(event),
        'yyyy-MM-dd'
      );
    }
  }
  endWorkDateChange(event) {
    this.searchDate = null;
    const findDateColumn = this.searchSort.Columns.find(
      (x) => x.Name === 'PunchTime'
    );
    if (!!findDateColumn) {
      findDateColumn.Search.endDate = this.datePipe.transform(
        this.setnewDate(event),
        'MM/dd/yyyy'
      );
      this.searchDate = this.datePipe.transform(
        this.setnewDate(event),
        'yyyy-MM-dd'
      );
    }
  }

  hideKey() {
    setTimeout(() => {
      this.keyboard.hide();
    }, 1000);
  }

  complianceChange(event) {
    const findComplianceColumn = this.searchSort.Columns.find(
      (x) => x.Name === 'ComplianceStr'
    );
    if (!!findComplianceColumn) {
      if (!!event.currentTarget.value) {
        findComplianceColumn.Search.Value = this.complianceList
          .find((x) => x.id == event.currentTarget.value)
          .value.toLowerCase();
      } else {
        findComplianceColumn.Search.Value = '';
      }
    }
  }

  async filterData() {
    this.utilityService.showLoadingwithoutDuration();
    const filterMethod = this.clockInOutServic.userTimePunchesDataFilter(
      this.searchSort
    );
    filterMethod.then(
      async (res) => {
        this.utilityService.hideLoading();
        if (res['data'] && res['data'].length > 0) {
          this.clockInOutRequest = res['data'];
          this.totalItems = res['recordsFiltered'];
        } else {
          this.totalItems = 0;
        }
        await this.modalController.dismiss(res['data']);
      },
      (err) => {
        this.utilityService.hideLoading();
        this.clockInOutRequest = [];
        this.totalItems = 0;
      }
    );
  }

  clear() {
    this.searchSort.Search.Value = '';
    this.searchSort.Order[0].ColumnName = '';
    this.searchSort.Order[0].Dir = 'asc';
    this.searchSort.Columns.forEach((element) => {
      element.Search.Value = '';
    });
    this.complianceValue.el.value = 0;
    this.punchInDate.nativeElement.value = '';
    this.punchEndDate.nativeElement.value = '';
    this.searchDate = this.nextDate;
    this.setPage({ offset: 0 });
  }
}
