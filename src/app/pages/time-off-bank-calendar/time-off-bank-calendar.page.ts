import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { timeOffRequestModel } from 'src/app/models/TimeOffRequest.model';

import { CalendarComponentOptions, DayConfig } from 'ion2-calendar';
import { ModalController } from '@ionic/angular';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { TimeOffService } from 'src/app/services/timeOff/time-off.service';
import { OfferStatus } from 'src/app/models/role-model';

@Component({
  selector: 'app-time-off-bank-calendar',
  templateUrl: './time-off-bank-calendar.page.html',
  styleUrls: ['./time-off-bank-calendar.page.scss'],
})
export class TimeOffBankCalendarPage implements OnInit {
  @Input() timeOffRequestModel: timeOffRequestModel;
  timeOffRequestList: any = [];
  dateMulti: string[];
  optionsMulti: CalendarComponentOptions = {};
  _daysConfig: DayConfig[] = [];
  offerStatus = OfferStatus;
  dtNow = new Date();
  Status: any;
  startDate = this.dtNow.toLocaleString().split(',')[0];
  endDate = new Date(this.dtNow.getFullYear(), this.dtNow.getMonth() + 1, 0)
    .toLocaleString()
    .split(',')[0];

  constructor(
    public router: Router,
    public modal: ModalController,
    public timeOffService: TimeOffService,
    public utilityService: UtilityService
  ) {}

  ngOnInit() {
    
  }
  ionViewWillEnter() {
    const dtNow = new Date();
    let startDate = new Date(dtNow.getFullYear(), dtNow.getMonth(), 1)
      .toLocaleString()
      .split(',')[0];
    let endDate = new Date(dtNow.getFullYear(), dtNow.getMonth() + 1, 0)
      .toLocaleString()
      .split(',')[0];

    this.getTimeoffData(startDate, endDate);
  }
  onMonthChange(event) {
    console.log();

    //APIs call
    let dtObj = event.newMonth.dateObj;

    let startDate = new Date(event.newMonth.dateObj)
      .toLocaleString()
      .split(',')[0];
    let endDate = new Date(dtObj.getFullYear(), dtObj.getMonth() + 1, 0)
      .toLocaleString()
      .split(',')[0];

    this.getTimeoffData(startDate, endDate);
    console.log(startDate, endDate);
  }

  getTimeoffData(startDate, endDate) {
    this._daysConfig = [];

    this.utilityService.showLoading();
    const getMethod = this.timeOffService.GetTimeOutCalender(
      startDate,
      endDate
    );
    getMethod.then((res: any) => {
      if (res['Success']) {
        this.utilityService.hideLoading();
        this.timeOffRequestList = res.Data;
        console.log(this.timeOffRequestList);

        this.timeOffRequestList.forEach((element) => {
          if (element.Status == 2) {
            this._daysConfig.push({
              date: element.TimeOffStartDateStr,
              cssClass: 'greenCss',
              marked: true,
            });
          } else if (element.Status == 1 || element.Status == 3) {
            this._daysConfig.push({
              date: element.TimeOffStartDateStr,
              cssClass: 'redCss',
              marked: true,
            });
          }
        });
        this.optionsMulti = {
          pickMode: 'multi',
          daysConfig: this._daysConfig,
        };
      }
    });
  }

  goBack() {
    this.modal.dismiss();
  }
}
