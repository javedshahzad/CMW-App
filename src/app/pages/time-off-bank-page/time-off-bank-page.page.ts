import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonDatetime, ModalController } from '@ionic/angular';
import { bsConfig } from 'src/app/constant/constants';
import { OfferStatus, Role } from 'src/app/models/role-model';
import { TimeOffService } from 'src/app/services/timeOff/time-off.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { TimeOffBankCalendarPage } from '../time-off-bank-calendar/time-off-bank-calendar.page';
@Component({
  selector: 'app-time-off-bank-page',
  templateUrl: './time-off-bank-page.page.html',
  styleUrls: ['./time-off-bank-page.page.scss'],
})
export class TimeOffBankPagePage implements OnInit {
  public myOffer: any;
  bsConfig = bsConfig;
  offerStatus = OfferStatus;
  role: number;
  roleEnum = Role;
  page: any;
  searchSort: any;
  userName: string;
  date: Date;
  minDate: Date;
  maxDate: Date;
  public isData: boolean;
  timeOffRequestList: any = [];
  constructor(
    public router: Router,
    public modal: ModalController,
    public timeOffService: TimeOffService,
    public utilityService: UtilityService
  ) {}

  ngOnInit() {}
  ionViewWillEnter() {
    this.getTimeOffBank();
  }
  goBack() {
    this.router.navigate(['tabs/time-off-requests']);
  }
  getTimeOffBank() {
    this.utilityService.showLoading();
    const getMethod = this.timeOffService.getTimeOffBank();
    getMethod.then((res: any) => {
      if (res['Success']) {
        this.utilityService.hideLoading();
        this.timeOffRequestList = res.Data;
        console.log(this.timeOffRequestList);
        if (res.Data) {
          this.isData = true;
        }
      }
    });
  }

  async openTimeOffRequests(data: any) {
    const modal = await this.modal.create({
      component: TimeOffBankCalendarPage,
      cssClass: 'add-request-swap_class',
      componentProps: {
        timeOffRequestModel: data,
      },
    });

    return await modal.present();
  }
}
