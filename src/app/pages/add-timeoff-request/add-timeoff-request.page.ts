import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import {
  bsConfig,
  bsConfig_withMinDate,
  Constants,
  Duration,
} from 'src/app/constant/constants';
import { timeOffRequestModel } from 'src/app/models/TimeOffRequest.model';
import { FormService } from 'src/app/services/form/form.service';
import { TimeOffService } from 'src/app/services/timeOff/time-off.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import * as moment from 'moment';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ActivatedRoute, Router } from '@angular/router';
import { ShiftService } from 'src/app/services/shift/shift.service';
import { DatePipe } from '@angular/common';
import { utils } from 'src/app/constant/utils';

@Component({
  selector: 'app-add-timeoff-request',
  templateUrl: './add-timeoff-request.page.html',
  styleUrls: ['./add-timeoff-request.page.scss'],
})
export class AddTimeoffRequestPage implements OnInit {
  @Input() timeOffRequestModel: timeOffRequestModel;

  @Output() closeRequest = new EventEmitter<boolean>();
  @Output() cancleRequest = new EventEmitter<boolean>();
  public timeOffRequestForm: FormGroup;
  bsConfig = bsConfig_withMinDate;
  today = new Date();
  action: any;
  companyId: number;
  timeOffConfigList = [];
  counter = 0;
  allNetBalance = '';
  durationType = Duration;
  shiftList: any;
  timeList: any;
  isSelectedCurrectShift = true;
  onSubmittingFrom = false;
  public messageList: any = new timeOffRequestModel();
  public timediff: any;
  selectedValue: any;
  todaysDate = new Date();
  timeOffStartTimeValue: any;
  timeOffEndTimeValue: any;
  staticCounter = 0;
  ionDateTimePickerActivated = false;
  minDate = new Date().toISOString();
  
  constructor(
    public timeOffService: TimeOffService,
    public modal: ModalController,
    public utilityService: UtilityService,
    private formService: FormService,
    public keyboard: Keyboard,
    public router: Router,
    public shiftService: ShiftService,
    private datepipe: DatePipe,
    public route: ActivatedRoute,
    public ngZone: NgZone,
    public ref: ChangeDetectorRef,
    public fb :FormBuilder
  ) {
    this.route.queryParams.subscribe((params) => {
      this.action = params.action;
    });
  }

  ngOnInit() {}
  async ionViewWillEnter() {
    try{
      if(this.timeOffRequestForm){
        this.timeOffRequestForm.reset();
      }
      let that = this;

      that.ionDateTimePickerActivated = false;
      that.isSelectedCurrectShift = true;
      that.onSubmittingFrom = false;
      that.utilityService.showLoadingwithoutDuration();
  
      if (that.action == 'edit') {
        that.timeOffRequestModel = JSON.parse(
          localStorage.getItem(Constants.TIME_OFF_DATA)
        );
        that.ionDateTimePickerActivated = true;
      } else {
        that.timeOffRequestModel = null;
      }
      that.companyId = Number(localStorage.getItem(Constants.COMPANYID));
      const today = new Date();

      const tomorrow = new Date(today.setDate(today.getDate()));
      const tDate = utils.getConvertedDateToISO(tomorrow);
      this.minDate = tDate;
      await that.getTimeOffConfigList();
      await that.initializeTimeOffRequestForm();
      await that.initializeMessages();
      await that.getShiftList();
      that.ref.detectChanges();
      that.utilityService.hideLoading();
    }catch(e){
      console.log(e);
      this.utilityService.hideLoading();
    } 
  }

  initializeTimeOffRequestForm() {
    this.timeOffRequestForm = this.fb.group({
      companyId: new FormControl(
        Number(localStorage.getItem(Constants.COMPANYID))
      ),
      shiftId: new FormControl(Number(localStorage.getItem(Constants.SHIFTID))),
      timeOffUserRequestId: new FormControl(
        !!this.timeOffRequestModel
          ? this.timeOffRequestModel.TimeOffUserRequestId
          : 0
      ),
      TimeOffStartDate: new FormControl(
        !!this.timeOffRequestModel
          ? utils.getConvertedDateTime(this.timeOffRequestModel.TimeOffStartDate)
          : new Date().toLocaleString(),
        Validators.required
      ),
      TimeOffEndDate: new FormControl(
        !!this.timeOffRequestModel
          ? utils.getConvertedDateTime(this.timeOffRequestModel.TimeOffEndDate)
          : new Date().toLocaleString(),
        Validators.required
      ),
      TimeOffId: new FormControl(
        !!this.timeOffRequestModel ? this.timeOffRequestModel.TimeOffId : '',
        Validators.required
      ),
      Duration: new FormControl(
        !!this.timeOffRequestModel
          ? this.timeOffRequestModel.Duration
          : this.durationType[0].id,
        Validators.required
      ),
      TimeOffDifference: new FormControl(
        !!this.timeOffRequestModel
          ? new Date(this.timeOffRequestModel.TimeOffDifference)
          : null
      ),
      TimeOffStartTime: new FormControl(
        !!this.timeOffRequestModel
          ? utils.getConvertedDateTime(this.timeOffRequestModel.TimeOffStartDate)
          : '',
        Validators.required
      ),
      TimeOffEndTime: new FormControl(
        !!this.timeOffRequestModel
          ? utils.getConvertedDateTime(this.timeOffRequestModel.TimeOffEndDate)
          : '',
        Validators.required
      ),
      createdBy: new FormControl(
        !!this.timeOffRequestModel ? this.timeOffRequestModel.CreatedBy : null
      ),
      CreatedDate: new FormControl(
        !!this.timeOffRequestModel ? this.timeOffRequestModel.CreatedDate : null
      ),
      isActive: new FormControl(true),
      UserId: new FormControl(
        !!this.timeOffRequestModel ? this.timeOffRequestModel.UserId : 0
      ),
      UserName: new FormControl(
        !!this.timeOffRequestModel ? this.timeOffRequestModel.UserName : null
      ),
      DepartmentId: new FormControl(
        !!this.timeOffRequestModel ? this.timeOffRequestModel.DepartmentId : 0
      ),
    });
    
    // KISHAN 2
    //this.initializeMessages();

    // KISHAN 3
    setTimeout(() => {
      this.setInialDurationLogic();
    }, 100);
  }

  initializeMessages() {
    this.messageList.TimeOffStartDate = {
      required: Constants.VALIDATION_MSG.TIME_OFF_REQUEST.START_TIME,
    };
    this.messageList.TimeOffEndDate = {
      required: Constants.VALIDATION_MSG.TIME_OFF_REQUEST.END_TIME,
    };
    this.messageList.TimeOffDifference = {
      required: Constants.VALIDATION_MSG.TIME_OFF_REQUEST.TOTAL_REQUESTED_HOURS,
    };
    this.messageList.TimeOffId = {
      required: Constants.VALIDATION_MSG.TIME_OFF_REQUEST.TIME_OFF_TYPE,
    };
    this.messageList.TimeOffEndTime = {
      required: Constants.VALIDATION_MSG.TIME_OFF_REQUEST.TIME,
    };
    this.messageList.TimeOffStartTime = {
      required: Constants.VALIDATION_MSG.TIME_OFF_REQUEST.TIME,
    };
    this.messageList.Duration = {
      required: Constants.VALIDATION_MSG.TIME_OFF_REQUEST.DURATION,
    };

    //TODO: 2
    // setTimeout(() => {
    //   if (this.timeOffRequestModel.Duration === 4) {
    //   this.enabledInputs();
    //   }
    // }, 500);

    // KIHSAN - 1
    // if (!!this.timeOffRequestModel) {
    //   this.setInialDurationLogic();
    //   this.timeOffStartTimeValue = new Date(
    //     this.timeOffRequestModel.TimeOffStartDate
    //   ).toLocaleString();
    //   this.timeOffEndTimeValue = new Date(
    //     this.timeOffRequestModel.TimeOffEndDate
    //   ).toLocaleString();

      //TODO: 3
      // if (this.timeOffRequestModel.Duration === 4) {
      //   
      //   this.enabledInputs();
      // }
      //}
  }

  setInialDurationLogic() {
    if (this.timeOffRequestForm.controls.Duration.value == 1) {
      this.disabledInputs();
    } else if (this.timeOffRequestForm.controls.Duration.value == 2) {
      this.disabledInputs();
    } else if (this.timeOffRequestForm.controls.Duration.value == 3) {
      this.disabledInputs();
    } else if (this.timeOffRequestForm.controls.Duration.value == 4) {
      this.enabledInputs();
    }
  }

  async getTimeOffConfigList() {
    this.allNetBalance = '';
    let that = this;
    await this.timeOffService.GetAllConfigForUser().then((response) => {
      if (response['Success']) {
        that.timeOffConfigList = response['Data'];
        if (!!that.timeOffConfigList) {
          that.timeOffConfigList.forEach((element) => {
            that.allNetBalance += `${element['Name']}: ${element['NetBalance']} \n`;
          });
          console.log(that.allNetBalance);
        }
        // KISHAN 
        // TODO: 1
        // this.initializeTimeOffRequestForm();
        // this.getShiftList();
      }
    });
  }

  setnewDate(date) {
    if (date.getTime()) {
      const dateObj = {
        year: +this.datepipe.transform(date, 'yyyy'),
        month: +this.datepipe.transform(date, 'MM'),
        day: +this.datepipe.transform(date, 'dd'),
      };
      return new Date(dateObj['year'], dateObj['month'] - 1, dateObj['day']);
    }
    return new Date(date);
  }
  async getShiftList() {
    let that = this;
    
    await this.shiftService
      .getShiftListByUserId(Number(localStorage.getItem(Constants.SHIFTID)))
      .then(
        (response) => {
          if (response['Success']) {
            
            that.shiftList = response['Data'];

            // NEW FORM
            if (!that.timeOffRequestModel) {
              that.startEndDateCalc();
            }
          }
        },
        (err) => {
          that.shiftList = [];
        }
      );
  }

  startEndDateCalc(flag = 'init') {
    this.ionDateTimePickerActivated = true;
    let currentDate = new Date();

    if (flag == 'OnDurationChanged') {
      currentDate = new Date(
        this.timeOffRequestForm.controls.TimeOffStartDate.value
      );
    }

    const currentWeekDay = currentDate.getDay() + 1;
    let userNextWorkingDays = this.shiftList.shiftWeekDay.find(
      (x) => x.weekday === currentWeekDay
    );
    if (!userNextWorkingDays) {
      userNextWorkingDays = this.shiftList.shiftWeekDay.find(
        (x) => x.weekday > currentWeekDay
      );

      if(!userNextWorkingDays){
        userNextWorkingDays = this.shiftList.shiftWeekDay.find(
          (x) => x.weekday <= currentWeekDay
        );
      }
    }

    const userUpcommingWorkingDay = new Date(
      currentDate.setDate(
        currentDate.getDate() +
          ((userNextWorkingDays.weekday + (6 - currentDate.getDay())) % 7)
      )
    );
    //let userNextShiftStartTime = userNextWorkingDays.startTime.split(':');
    //let userNextShiftEndTime = userNextWorkingDays.endTime.split(':');
    // let startTime = new Date(
    //   new Date().setHours(userNextShiftStartTime[0])
    // ).setMinutes(userNextShiftStartTime[1]);
    // let endTime = new Date(
    //   new Date().setHours(userNextShiftEndTime[0])
    // ).setMinutes(userNextShiftEndTime[1]);

    // NEW FORM
    // if (!this.timeOffRequestModel && flag == 'init') {
    //   this.timeOffRequestForm.controls.TimeOffStartDate.setValue(
    //     new Date(userUpcommingWorkingDay).toLocaleString()
    //   );
    //   this.timeOffRequestForm.controls.TimeOffEndDate.setValue(
    //     new Date(userUpcommingWorkingDay).toLocaleString()
    //   );
    // }
    // this.timeOffRequestForm.controls.TimeOffStartTime.setValue(
    //   new Date(startTime).toLocaleString()
    // );
    // this.timeOffRequestForm.controls.TimeOffEndTime.setValue(
    //   new Date(endTime).toLocaleString()
    // );

    if (this.timeOffRequestForm.controls.Duration.value == 1) {
      this.setTimes(
        userNextWorkingDays.startTime,
        userNextWorkingDays.endTime,
        this.timeOffRequestForm.controls.Duration.touched
          ? this.timeOffRequestForm.controls.TimeOffStartDate.value
          : userUpcommingWorkingDay
      );
      this.selectedValue = 1;
      this.disabledInputs();
    } else if (this.timeOffRequestForm.controls.Duration.value == 2) {
      this.setTimes(
        userNextWorkingDays.startTime,
        userNextWorkingDays.firstHalfEndTime,
        this.timeOffRequestForm.controls.TimeOffStartDate.value
      );
      this.selectedValue = 2;
      this.disabledInputs();
    } else if (this.timeOffRequestForm.controls.Duration.value == 3) {
      this.setTimes(
        userNextWorkingDays.secondHalfStartTime,
        userNextWorkingDays.endTime,
        this.timeOffRequestForm.controls.TimeOffStartDate.value
      );
      this.selectedValue = 3;
      this.disabledInputs();
    } else if (this.timeOffRequestForm.controls.Duration.value == 4) {
      if (this.selectedValue == 2) {
        this.setTimes(
          userNextWorkingDays.startTime,
          userNextWorkingDays.firstHalfEndTime,
          this.timeOffRequestForm.controls.TimeOffStartDate.value
        );
      } else if (this.selectedValue == 3) {
        this.setTimes(
          userNextWorkingDays.secondHalfStartTime,
          userNextWorkingDays.endTime,
          this.timeOffRequestForm.controls.TimeOffStartDate.value
        );
      } else {
        this.setTimes(
          userNextWorkingDays.startTime,
          userNextWorkingDays.endTime,
          this.timeOffRequestForm.controls.TimeOffStartDate.value
        );
      }
      // this.timeOffRequestForm.controls.TimeOffStartDate.setValue(new Date());
      // this.timeOffRequestForm.controls.TimeOffEndDate.setValue(new Date());
      // this.timeOffRequestForm.controls.TimeOffStartTime.setValue(new Date(startTime));
      // this.timeOffRequestForm.controls.TimeOffEndTime.setValue(new Date(endTime));
      this.enabledInputs();
    }
  }

  onDurationChange(event) {
    this.startEndDateCalc('OnDurationChanged');
  }

  setTimes(startTime, endTime, date = new Date()) {
    if (!!startTime) {
      const startdate = utils.getConvertedToDateOnly(date);

      startdate.setHours(
        Number(startTime.split(':')[0]),
        Number(startTime.split(':')[1])
      );
      //this.timeOffStartTimeValue = startdate.toLocaleString();
      this.timeOffRequestForm.controls.TimeOffStartTime.setValue(
        startdate.toLocaleString()
      );
      this.timeOffRequestForm.controls.TimeOffStartDate.setValue(
        startdate.toLocaleString()
      );
    } else {
      this.utilityService.showErrorToast(Constants.SHIFT_START_TIME_CONFIGURE);
      this.timeOffRequestForm.controls.TimeOffStartTime.setValue(null);
      this.timeOffRequestForm.controls.TimeOffStartDate.setValue(null);
    }
    if (!!endTime) {
      const enddate = utils.getConvertedToDateOnly(date);
      enddate.setHours(
        Number(endTime.split(':')[0]),
        Number(endTime.split(':')[1])
      );
      //this.timeOffEndTimeValue = enddate.toLocaleString();
      this.timeOffRequestForm.controls.TimeOffEndTime.setValue(
        enddate.toLocaleString()
      );
      this.timeOffRequestForm.controls.TimeOffEndDate.setValue(
        enddate.toLocaleString()
      );
    } else {
      this.utilityService.showErrorToast(Constants.SHIFT_END_TIME_CONFIGURE);
      this.timeOffRequestForm.controls.TimeOffEndTime.setValue(null);
    }
  }

  enabledInputs() {
    this.timeOffRequestForm.controls.TimeOffStartDate.enable();
    this.timeOffRequestForm.controls.TimeOffEndDate.enable();
    this.timeOffRequestForm.controls.TimeOffStartTime.enable();
    this.timeOffRequestForm.controls.TimeOffEndTime.enable();
    this.timeOffRequestForm.updateValueAndValidity();
  }

  disabledInputs() {
    this.timeOffRequestForm.controls.TimeOffEndDate.disable();
    this.timeOffRequestForm.controls.TimeOffStartTime.disable();
    this.timeOffRequestForm.controls.TimeOffEndTime.disable();
    this.timeOffRequestForm.updateValueAndValidity();
  }
  ionBlurEvent(event) {
    this.ionDateTimePickerActivated = true;
  }
  ionCancelEvent(event) {
    this.ionDateTimePickerActivated = false;
  }
  startDateChangeValidation(event) {

    if(this.ionDateTimePickerActivated){
      if (
        !!event.target.value &&
        !event.srcElement.classList.contains('ng-untouched')
      ) {
        if (this.onSubmittingFrom) {return; }
        if (
          this.timeOffRequestForm.controls.Duration.value == 4 ||
          this.onSubmittingFrom
        ){
          return;
        }
        this.ionDateTimePickerActivated = false; 
        if (!!this.shiftList) {
          this.isSelectedCurrectShift = false;
          for (
            let index = 0;
            index < this.shiftList.shiftWeekDay.length;
            index++
          ) {
            if (
              this.shiftList.shiftWeekDay[index].weekday ==
              new Date(event.target.value).getDay() + 1
            ) {
              let shiftWeek = this.shiftList.shiftWeekDay[index];
              this.timeOffRequestForm.controls.TimeOffStartDate.setValue(
                new Date(event.target.value).toLocaleString()
              );
              this.timeOffRequestForm.controls.TimeOffEndDate.setValue(
                new Date(event.target.value).toLocaleString()
              );
  
              if (this.timeOffRequestForm.controls.Duration.value == 1) {
                this.setTimes(
                  shiftWeek.startTime,
                  shiftWeek.endTime,
                  event.target.value
                );
              }
              if (this.timeOffRequestForm.controls.Duration.value == 2) {
                this.setTimes(
                  shiftWeek.startTime,
                  shiftWeek.firstHalfEndTime,
                  event.target.value
                );
              }
              if (this.timeOffRequestForm.controls.Duration.value == 3) {
                this.setTimes(
                  shiftWeek.secondHalfStartTime,
                  shiftWeek.endTime,
                  event.target.value
                );
              }
              this.isSelectedCurrectShift = true;
              break;
            }
          }
          if (!this.isSelectedCurrectShift) {
            this.utilityService.showErrorToast(Constants.NO_AVAILABLE_SHIFT);
          }
        }
  
        if (
          this.timeOffRequestForm.controls.timeOffUserRequestId.value > 0 &&
          this.counter <= 1
        ) {
          this.counter++;
          return;
        }
      }
    }
  }

  onSubmit() {
    try{
      this.formService.markFormGroupTouched(this.timeOffRequestForm);
      if (this.timeOffRequestForm.invalid) {
        return;
      }
  
      if (!this.isSelectedCurrectShift && this.timeOffRequestForm.controls.Duration.value != 4) {
        this.utilityService.showErrorToast(Constants.NO_AVAILABLE_SHIFT);
        return;
      }
  
      const startDate = new Date(
        this.timeOffRequestForm.controls.TimeOffStartDate.value
      );
      
      const endDateFromTime = new Date(
        this.timeOffRequestForm.controls.TimeOffEndTime.value
      );
  
      // TODO validation for sevaral times
      //date
      const today = new Date();
      const todayDT = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      )
      const startDT = new Date(
        startDate.getFullYear(),
        startDate.getMonth(),
        startDate.getDate()
      );
      if (
        startDT <
        todayDT
      ) {
        this.utilityService.showErrorToast(
          'Start date must be future Date'
        );
        return;
      }
  
      if (this.timeOffRequestForm.controls.Duration.value == 4) {
        //date
        if (
          new Date(utils.getConvertedDateTime(this.timeOffRequestForm.controls.TimeOffStartDate.value)) >
          new Date(utils.getConvertedDateTime(this.timeOffRequestForm.controls.TimeOffEndTime.value))
        ) {
          this.utilityService.showErrorToast(
            'Start date must be less than end date'
          );
          return;
        }
  
        if (
          utils.getConvertedDateTime(this.timeOffRequestForm.controls.TimeOffEndDate.value) ==
          utils.getConvertedDateTime(this.timeOffRequestForm.controls.TimeOffStartDate.value)
        ) {
          //hours
          if (
            new Date(
              utils.getConvertedDateTime(this.timeOffRequestForm.controls.TimeOffEndTime.value)
            ).getHours() <=
            new Date(
              utils.getConvertedDateTime(this.timeOffRequestForm.controls.TimeOffStartTime.value)
            ).getHours()
          ) {
            this.utilityService.showErrorToast(
              'Start time must be less than end time'
            );
            return;
          }
  
          //minute
          if (
            new Date(
              utils.getConvertedDateTime(this.timeOffRequestForm.controls.TimeOffEndTime.value)
            ).getMinutes() <=
            new Date(
              utils.getConvertedDateTime(this.timeOffRequestForm.controls.TimeOffStartTime.value)
            ).getMinutes()
          ) {
            this.utilityService.showErrorToast(
              'Start time must be less than end time'
            );
            return;
          }
        }
      }
      this.utilityService.showLoadingwithoutDuration();
      this.onSubmittingFrom = true;
  
      this.timeOffRequestForm.controls.TimeOffStartDate.setValue(
        moment(
          new Date(
            startDate.getFullYear(),
            startDate.getMonth(),
            startDate.getDate(),
            startDate.getHours(),
            startDate.getMinutes(),
            0,
            0
          )
        ).format('YYYY-MM-DD HH:mm')
      );
      this.timeOffRequestForm.controls.TimeOffEndDate.setValue(
        moment(
          new Date(
            endDateFromTime.getFullYear(),
            endDateFromTime.getMonth(),
            endDateFromTime.getDate(),
            endDateFromTime.getHours(),
            endDateFromTime.getMinutes(),
            0,
            0
          )
        ).format('YYYY-MM-DD HH:mm')
      );
  
      //enabled
      this.enabledInputs();
      
      const saveMethod =
        this.timeOffRequestForm.controls.timeOffUserRequestId.value > 0
          ? this.timeOffService.updateTimeOffRequest(
              this.timeOffRequestForm.value
            )
          : this.timeOffService.addTimeOffRequest(this.timeOffRequestForm.value);
      saveMethod.then(
        (res) => {
          this.onSubmittingFrom = false;
          this.disabledInputs();
  
          if (res['Success']) {
            this.utilityService.hideLoading();
            this.utilityService.showSuccessToast(
              this.timeOffRequestForm.controls.timeOffUserRequestId.value > 0
                ? Constants.TIME_OFF_REQ_EDIT_MSG
                : Constants.TIME_OFF_REQ_ADD_MSG
            );
            this.router.navigate(['/tabs/time-off-requests']);
          } else {
            this.utilityService.showErrorToast(res['Message']);
            
            this.timeOffRequestForm.controls.TimeOffStartDate.setValue(
              startDate
            );
            this.timeOffRequestForm.controls.TimeOffEndDate.setValue(
              endDateFromTime.toLocaleString()
            );
            if (this.timeOffRequestForm.controls.Duration.value === 4) {
              this.enabledInputs();
            }
            this.utilityService.hideLoading();
          }
        },
        (err) => {
          
          this.onSubmittingFrom = false;
          this.disabledInputs();
          if (this.timeOffRequestForm.controls.Duration.value === 4) {
            this.enabledInputs();
          }
          this.utilityService.hideLoading();
          //this.closeRequest.emit(false);
        }
      );
    }catch(e){ 
      console.log(e);
      this.utilityService.hideLoading();
    }
  }
  closeModal() {
    if (this.action == 'edit') {
      this.router.navigate(['/tabs/timeoff-request-detail']);
    } else if (this.action == 'add') {
      this.router.navigate(['/tabs/time-off-requests']);
    }
  }
  hideKey() {
    setTimeout(() => {
      this.keyboard.hide();
    }, 500);
  }
}
