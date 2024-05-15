import { Component, Input, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Constants } from 'src/app/constant/constants';
import { utils } from 'src/app/constant/utils';
import { WorkHours } from 'src/app/models/offer.model';
import { ClockInOutService } from 'src/app/services/clock-in-out.service';
import { FormService } from 'src/app/services/form/form.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-user-work-hours',
  templateUrl: './user-work-hours.page.html',
  styleUrls: ['./user-work-hours.page.scss'],
})
export class UserWorkHoursPage implements OnInit {
  @Input() WorkHours: WorkHours;
  public messageList: any = new WorkHours();
  maxYear = new Date('2050-12-31').toISOString();
  userId: number;
  userWorkHours: any = [];
  startDate: any;
  endDate: any;
  public userWorkHoursForm: FormGroup;
  isNoData: boolean = false;
  currentDate = (new Date()).toISOString();
  today = new Date();
  lastSundayDate = (new Date(this.today.setDate(this.today.getDate() - (this.today.getDay() + 6) % 7)));
  weekInitialDate = (new Date(this.lastSundayDate.setHours(0,0,0))).toISOString();
  overTimeIcon ='../../../assets/svg/overtime.svg';
  constructor(
    public router: Router,
    public keyboard: Keyboard,
    public clockInOutServic: ClockInOutService,
    private utilityService: UtilityService,
    private formService: FormService,
    public fb: FormBuilder
  ) {}

  ngOnInit() {}
  async ionViewWillEnter() {
    try{
      this.utilityService.showLoadingwithoutDuration();
    this.isNoData = false;
    if (this.userWorkHours) {
      this.userWorkHours = [];
    }
    this.userId = Number(localStorage.getItem(Constants.USERID));
    await this.initializeuserWorkHoursForm();
    await this.initializeMessages();
    this.utilityService.hideLoading();
  }catch(e){
    console.log(e);
    this.utilityService.hideLoading();
  } 
  }
  goBack() {
    this.router.navigate(['tabs/clock-in-out']);
  }
  getSum(data){
    return Number(data.RegularWorkHours) + Number(data.PaidTimeOffHours) + Number(data.HolidayHours)
  }
  initializeuserWorkHoursForm() {
    this.userWorkHoursForm = this.fb.group({
      WeekStartDate: new FormControl(
        !!this.WorkHours
          ? utils.getConvertedDateTime(this.WorkHours.WeekStartDate)
          : utils.getConvertedDateTime((this.weekInitialDate)),
        Validators.required
      ),
      WeekEndDate: new FormControl(
        this.WorkHours
          ? utils.getConvertedDateTime(this.WorkHours.WeekEndDate)
          : utils.getConvertedDateTime((new Date()).toISOString()),
        Validators.required
      ),
    });
  }

  initializeMessages() {
    this.messageList.WeekStartDate = {
      required: Constants.VALIDATION_MSG.WORK_HOURS.START_TIME,
    };
    this.messageList.WeekEndDate = {
      required: Constants.VALIDATION_MSG.WORK_HOURS.END_TIME,
    };
  }
  async showWorkHours() {
    this.formService.markFormGroupTouched(this.userWorkHoursForm);
    if (this.userWorkHoursForm.invalid) {
      return;
    }
    this.startDate = new Date(
      this.userWorkHoursForm.controls.WeekStartDate.value
    ).toISOString();
    this.endDate = new Date(
      this.userWorkHoursForm.controls.WeekEndDate.value
    ).toISOString();
    await this.getPeriodPayloadAPP(this.startDate, this.endDate, this.userId);
  }
  hideKey() {
    setTimeout(() => {
      this.keyboard.hide();
    }, 500);
  }

  async getPeriodPayloadAPP(startDate, endDate, userId) {
    this.utilityService.showLoadingwithoutDuration();
    const getMethod = this.clockInOutServic.getPeriodPayloadAPP(
      startDate,
      endDate,
      userId
    );
    
    await getMethod.then(
      (res: any) => {
        if (res['Success']) {
          this.utilityService.hideLoading();
          this.userWorkHours = res.Data;
          if(res.Data.length==0){
            this.isNoData = true;
          }
        } else {
          this.userWorkHours=[];
          this.utilityService.hideLoading();
        }
      },
      (err) => {
        this.userWorkHours=[];
        this.utilityService.hideLoading();
      }
    );
  }
}
