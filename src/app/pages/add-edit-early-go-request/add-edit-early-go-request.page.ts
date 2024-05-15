import { DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  Input,
  NgZone,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { AlertController, ModalController } from '@ionic/angular';
import {
  bsConfig,
  Constants,
  SubscriptionType,
  SettingType,
} from 'src/app/constant/constants';
import { utils } from 'src/app/constant/utils';
import { EarlyGoOffer, Offer } from 'src/app/models/offer.model';
import { CallInRequestService } from 'src/app/services/call-in-request/call-in-request.service';
import { EarlyOutService } from 'src/app/services/earlyOut/early-out.service';
import { FormService } from 'src/app/services/form/form.service';
import { ShiftService } from 'src/app/services/shift/shift.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-add-edit-early-go-request',
  templateUrl: './add-edit-early-go-request.page.html',
  styleUrls: ['./add-edit-early-go-request.page.scss'],
})
export class AddEditEarlyGoRequestPage implements OnInit {
  @Input() Offer: Offer;
  OtherReason: string;
  otherReason = false;
  bsConfig = bsConfig;
  enable: boolean = true;
  departmentList = [];
  reasonList = [];
  enableValue: any;
  description: any = [];
  companyId: number;
  role: number;
  shiftEndTime: string;
  enableVal: boolean = false;
  shiftStartTime: string;
  departmentId: number;
  shiftId: number;
  isConfirm = false;
  confirmMsg: string;
  settingType: any = [];
  SettingType: string;
  selectedDate = new Date().toDateString();
  isShow: boolean = false;
  dateToSkip = new Date().toLocaleDateString();
  // modalRef: BsModalRef;
  cancleLogMsg: string = 'successfully prevented an early out.';
  suggestionMsg: string =
    'It is suggested to preserve UTO as much as you can for emergency purposes. Sorry life threw a curved ball at you today. Let us know if we can help you.';
  startTimeConfirmMsg: string =
    'Early-out screen is used for obtaining approval to leave early from your supervisor. If you intend to call-off for the whole shift, please use Call-Off screen.';
  public messageList: any = new EarlyGoOffer();
  public earlyGoForm: FormGroup;
  counter: number = 0;
  nightShift = false;
  todaysDate = new Date();
  // tomorrowsDate: any;
  public startTime: any;
  public utoHours: any;
  action: any;
  currentPage = Constants.CURRENT_PAGE;
  ionDateTimePickerActivated = true;
  earlyOutFirstTime = true;
  tomorrowsDate = new Date(new Date().setDate(this.todaysDate.getDate() + 1));
  minDate = new Date(this.todaysDate).toISOString();
  maxYear = new Date('2050-12-31').toISOString();
  utoMessage: any;
  public disableBtn: boolean = false;
  IsCoverMyWork: boolean = false;
  paidTimeOff: any;
  isPaidTimeOff: boolean;
  moduleId: any;
  message: string;
  settingList: any;
  constructor(
    public modal: ModalController,
    public earlyOutService: EarlyOutService,
    public shiftService: ShiftService,
    public utilityService: UtilityService,
    private datePipe: DatePipe,
    public ngZone: NgZone,
    private formService: FormService,
    public alertController: AlertController,
    public router: Router,
    public keyboard: Keyboard,
    public route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private fb: FormBuilder,
    private callInRequstService: CallInRequestService
  ) {
    this.route.queryParams.subscribe((params) => {
      this.action = params.action;
    });
    this.IsCoverMyWork =
      localStorage.getItem(Constants.APP_NAME) === 'CoverMyWork' ? true : false;
  }

  ngOnInit() {}
  async ionViewWillEnter() {
    this.dateToSkip = new Date().toLocaleDateString();
    this.utoMessage = 'UTO hours is required';
    this.tomorrowsDate = new Date(
      new Date().setDate(this.todaysDate.getDate() + 1)
    );
    if (this.Offer?.offerId > 0) {
      this.dateToSkip = new Date(
        this.earlyGoForm.controls.dateToSkip.value
      ).toLocaleDateString();
    }
    this.counter = 0;
    this.selectedDate = undefined;
    this.ionDateTimePickerActivated = true;
    this.utilityService.showLoadingwithoutDuration();
    if (this.action == 'edit') {
      this.Offer = JSON.parse(localStorage.getItem(Constants.EARLY_OUT_DATA));
    } else {
      this.Offer = null;
    }
    this.role = Number(localStorage.getItem(Constants.ROLE));
    this.departmentId = Number(localStorage.getItem(Constants.DEPARTMENTID));
    this.companyId = Number(localStorage.getItem(Constants.COMPANYID));
    this.shiftId = Number(localStorage.getItem(Constants.SHIFTID));

    const today = new Date();

    const tomorrow = new Date(today.setDate(today.getDate()));
    const tDate = utils.getConvertedDateToISO(tomorrow);
    this.minDate = tDate;
    await this.getReasonList();
    await this.getTermsConditionList();
    await this.initializeEarlyGoForm();
    await this.initializeMessages();
    await this.getSettingByCompanyID();
    await this.msgShow();
    // if(!!this.Offer && this.Offer.offerId > 0){
    //   let time =  this.Offer.vtoStartTime.split(':');
    //   let dateTime =  new Date(this.Offer.dateToSkip);
    //   dateTime.setHours(Number(time[0]));
    //   dateTime.setMinutes(Number(time[1]));

    // }
    this.cdRef.detectChanges();
    this.utilityService.hideLoading();
  }
  async initializeEarlyGoForm() {
    if (this.earlyGoForm) {
      this.earlyGoForm.reset();
    }
    this.earlyGoForm = this.fb.group({
      offerId: new FormControl(!!this.Offer ? this.Offer.offerId : 0),
      status: new FormControl(!!this.Offer ? this.Offer.status : 1),
      companyId: new FormControl(this.companyId),
      departmentId: new FormControl(this.departmentId),
      ReasonId: new FormControl(
        !!this.Offer ? this.Offer.ReasonId : '',
        Validators.required
      ),
      OtherReason: new FormControl(!!this.Offer ? this.Offer.OtherReason : ''),
      offerType: new FormControl(7),
      shiftToSkip: new FormControl(this.shiftId),
      dateToSkip: new FormControl(
        !!this.Offer
          ? this.getDateToSkip(
              new Date(this.Offer.dateToSkip),
              this.Offer.vtoStartTime
            )
          : new Date().toLocaleString(),
        Validators.required
      ),
      vtoStartTime: new FormControl(
        !!this.Offer ? this.Offer.vtoStartTime : this.setVTOStartTime(new Date())
      ),
      // vtoEndTime: new FormControl(!!this.Offer ? this.Offer.vtoEndTime : ''),
      uTOHours: new FormControl(!!this.Offer ? this.Offer.uTOHours : ''),
      createdBy: new FormControl(!!this.Offer ? this.Offer.createdBy : null),
      IsPaidOff: new FormControl(!!this.Offer ? this.Offer.IsPaidOff : false),
      IsDateCrossOver: new FormControl(
        !!this.Offer ? this.Offer.IsDateCrossOver : false
      ),
    });
    if (
      this.earlyGoForm.controls.offerId.value > 0 &&
      this.earlyGoForm.controls.ReasonId.value === 1
    ) {
      this.otherReason = true;
      this.earlyGoForm.controls.OtherReason.setValidators(Validators.required);
    }
    if (this.earlyGoForm.controls.offerId.value > 0) {
      this.selectedDate = new Date(
        this.earlyGoForm.controls.dateToSkip.value
      ).toDateString();
      this.skipDateChange(new Date(this.dateToSkip).toLocaleString());
    }
    this.earlyGoForm.controls.vtoStartTime.setValidators(Validators.required);
    // this.earlyGoForm.controls.vtoEndTime.setValidators(Validators.required);
    this.earlyGoForm.controls.vtoStartTime.updateValueAndValidity();
    // this.earlyGoForm.controls.vtoEndTime.updateValueAndValidity();

    // TODO : KISHAN I need to specified this line becuase while initialze event not firing
    if (this.earlyOutFirstTime) {
      this.earlyOutFirstTime = false;
      this.skipDateChange(new Date().toLocaleString());
    }
  }
  setVTOStartTime(date){
    let time = date.toLocaleTimeString().split(':');
    return time[0] + ':' + time[1];
  }
  getDateToSkip(dateToSkip, vtoStartTime) {
    // if (this.Offer.IsDateCrossOver) {
    //   const vtoStartTimeSplit = vtoStartTime.split(':');
    //   const vtoStartTimeHour = parseInt(vtoStartTimeSplit[0]);
    //   const vtoStartTimeMinute = parseInt(vtoStartTimeSplit[1]);

    //   const vtoStartTimeDate = new Date(
    //     dateToSkip.getFullYear(),
    //     dateToSkip.getMonth(),
    //     dateToSkip.getDate(),
    //     vtoStartTimeHour,
    //     vtoStartTimeMinute
    //   );

    //   if (vtoStartTimeDate.getHours() >= 12) {
    //     PM
    //     return utils.getConvertedDateTime(dateToSkip);
    //   } else {
    //     AM
    //     const dateToSkipValue = utils.getConvertedDateTime(
    //       new Date(
    //         new Date(vtoStartTimeDate).setDate(vtoStartTimeDate.getDate() - 1)
    //       )
    //     );
    //     this.dateToSkip = dateToSkipValue.toLocaleString();
    //     return dateToSkipValue.toLocaleString();
    //   }
    // } else {
    //   return dateToSkip;
    // }
    const vtoStartTimeSplit = vtoStartTime.split(':');
    const vtoStartTimeHour = parseInt(vtoStartTimeSplit[0]);
    const vtoStartTimeMinute = parseInt(vtoStartTimeSplit[1]);

  return new Date(
      dateToSkip.getFullYear(),
      dateToSkip.getMonth(),
      dateToSkip.getDate(),
      vtoStartTimeHour,
      vtoStartTimeMinute
    ).toLocaleString();
  }

  initializeMessages() {
    this.messageList.endTime = {
      required: Constants.VALIDATION_MSG.EARLY_GO.END_TIME,
    };
    this.messageList.startTime = {
      required: Constants.VALIDATION_MSG.EARLY_GO.START_TME,
    };
    this.messageList.date = {
      required: Constants.VALIDATION_MSG.EARLY_GO.DATE,
    };
    this.messageList.reason = {
      required: Constants.VALIDATION_MSG.EARLY_GO.REASON,
    };
    this.messageList.utoHours = {
      required: this.utoMessage,
    };
    this.messageList.CallOffOtherReason = {
      required: Constants.VALIDATION_MSG.CALL_IN.OTHER_REASON,
    };
  }
  async getReasonList() {
    let that = this;
    await this.earlyOutService.getReasons().then(
      (response) => {
        if (response['Success']) {
          that.reasonList = response['Data'];
          // TODO: KISHAN not sure why added two times
          // if (!!this.Offer) {
          //   this.initializeEarlyGoForm();
          // }
        } else {
          that.reasonList = [];
        }
      },
      (err) => {
        that.reasonList = [];
      }
    );
  }
  reasonChange(value: string) {
    if (parseInt(value) === 1) {
      this.otherReason = true;
      this.earlyGoForm.controls.OtherReason.setValidators(Validators.required);
    } else {
      this.otherReason = false;
      this.earlyGoForm.controls.OtherReason.setValue('');
      this.earlyGoForm.controls.OtherReason.setValidators(null);
      this.earlyGoForm.controls.OtherReason.updateValueAndValidity();
    }
  }
  ionBlurEvent(event) {
    this.ionDateTimePickerActivated = true;
  }
  ionCancelEvent(event) {
    this.ionDateTimePickerActivated = false;
  }
  async skipDateChange(event) {
    console.log(this.earlyGoForm.controls.dateToSkip.value);
    if (this.earlyGoForm.controls.offerId.value > 0) {
      this.dateToSkip = new Date(
        this.earlyGoForm.controls.dateToSkip.value
      ).toLocaleDateString();
    }
    if (!this.ionDateTimePickerActivated) return;

    if (!!this.Offer && this.counter === 0) {
      this.ionDateTimePickerActivated = false;
      // this.setTimes(this.Offer.vtoStartTime, this.Offer.vtoEndTime);
      // this.utilityService.showLoadingwithoutDuration();
      // await this.shiftService
      //   .getTimeByShiftDateTime(this.dateToSkip, this.Offer.shiftToSkip, 1)
      //   .then(
      //     (response) => {
      //       if (response['Success']) {
      //         this.shiftEndTime = response['Data'].endTime;
      //         this.shiftStartTime = response['Data'].startTime;
      //         this.nightShift = false;
      //         if (
      //           Number(this.shiftEndTime.split(':')[0]) -
      //             Number(this.shiftStartTime.split(':')[0]) <
      //           0
      //         )
      //           this.nightShift = true;
      //         this.utilityService.hideLoading();
      //       }
      //     },
      //     (err) => {}
      //   );
      this.counter++;
    } else {
      if (!!event) {
        this.setVTOStartTime(new Date(this.earlyGoForm.controls.dateToSkip.value))
        // const selectedTime = this.datePipe.transform(
        //   this.setnewDate(this.earlyGoForm.controls.dateToSkip.value),
        //   'yyyy-MM-dd'
        // );
        //  var  date = this.earlyGoForm.controls.dateToSkip.value;
        //   var date1=date.split(",")[0];
        //   var date3 = date1.split('/');
        //   let selectedStartTime = new Date(date3[2]+"/"+date3[1]+"/"+date3[0]);
        // let selectedTime = new Date(
        //   this.earlyGoForm.value.dateToSkip
        // ).toDateString();
        // if (!!this.selectedDate && this.selectedDate == selectedTime) {
        //   this.selectedDate = selectedTime;
        //   this.startTimeChange(
        //     utils.getConvertedDateTime(this.earlyGoForm.value.dateToSkip)
        //   );
        // } else {
        //   this.selectedDate = selectedTime;
        //   this.ionDateTimePickerActivated = false;
        //   const skipDate = this.datePipe.transform(
        //     this.setnewDate(selectedTime),
        //     'yyyy-MM-dd'
        //   );
        //   this.earlyGoForm.controls.dateToSkip.setValue(this.selectedDate);
          // this.utilityService.showLoadingwithoutDuration();
          // await this.getTimeByShiftDateTime(skipDate, this.shiftId).then(() => {
          //   this.utilityService.hideLoading();
          // });
        // }
      }
    }
  }
  hideKey() {
    setTimeout(() => {
      this.keyboard.hide();
    }, 500);
  }

  async getTimeByShiftDateTime(date, shift) {
    const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    await this.shiftService
      .getTimeByShiftDateTime(formattedDate, Number(shift), 1)
      .then(
        (response) => {
          if (response['Success']) {
            this.shiftEndTime = response['Data'].endTime;
            this.shiftStartTime = response['Data'].startTime;
            this.nightShift = false;
            if (
              Number(this.shiftEndTime.split(':')[0]) -
                Number(this.shiftStartTime.split(':')[0]) <
              0
            )
              this.nightShift = true;
            this.setTimes(this.shiftStartTime, this.shiftEndTime);
            // this.setUtoTime(this.earlyGoForm.controls.vtoStartTime.value);
          } else {
            // this.offerForm.controls.vtoStartTime.setValue(null);
            // this.offerForm.controls.vtoEndTime.setValue(null);
          }
        },
        (err) => {}
      );
  }
  setUtoTime(startTime) {
    if (
      new Date(startTime).getHours() ==
        Number(this.shiftEndTime.split(':')[0]) &&
      new Date(startTime).getMinutes() > 0
    ) {
      // this.toaster.error("Your start time is greater than shift end time");
      this.utoMessage = 'Your start time is greater than shift end time';
      this.earlyGoForm.controls.uTOHours.setValue('');
      return;
    }
    if (!this.nightShift) {
      if (
        new Date(startTime).getHours() + 1 ==
          Number(this.shiftEndTime.split(':')[0]) &&
        new Date(startTime).getMinutes() > 0
      ) {
        var utoHours = 0;
      } else {
        var utoHours =
          Number(this.shiftEndTime.split(':')[0]) -
          new Date(startTime).getHours();
      }
    } else {
      if (
        new Date(startTime).getHours() + 1 ==
          Number(this.shiftEndTime.split(':')[0]) &&
        new Date(startTime).getMinutes() > 0
      ) {
        var utoHours = 0;
      } else {
        let convertDate = new Date(startTime);
        if (convertDate.getHours() >= 12) {
          var dt1 = new Date(
            this.todaysDate.setHours(new Date(startTime).getHours())
          );
          var dt2 = new Date(
            this.tomorrowsDate.setHours(Number(this.shiftEndTime.split(':')[0]))
          );
          var utoHours = this.diff_hours(dt1, dt2);
        } else {
          var dt1 = new Date(
            this.todaysDate.setHours(new Date(startTime).getHours())
          );
          var dt2 = new Date(
            this.todaysDate.setHours(Number(this.shiftEndTime.split(':')[0]))
          );
          var utoHours = this.diff_hours(dt1, dt2);
        }
      }
    }
    if (
      Number(this.shiftEndTime.split(':')[1]) >=
      new Date(startTime).getMinutes()
    ) {
      var utoMinutes = (
        Number(this.shiftEndTime.split(':')[1]) -
        new Date(startTime).getMinutes()
      ).toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
    } else {
      utoMinutes = (60 - new Date(startTime).getMinutes()).toLocaleString(
        'en-US',
        {
          minimumIntegerDigits: 2,
          useGrouping: false,
        }
      );
      if (utoHours > 0) {
        utoHours -= 1;
      }
    }
    this.earlyGoForm.controls.uTOHours.setValue(utoHours + '.' + utoMinutes);
  }
  setnewDate(date) {
    const dateObj = {
      year: +this.datePipe.transform(date, 'yyyy'),
      month: +this.datePipe.transform(date, 'MM'),
      day: +this.datePipe.transform(date, 'dd'),
    };
    return new Date(dateObj['year'], dateObj['month'] - 1, dateObj['day']);
  }
  setTimes(startTime, endTime) {
    if (!!startTime) {
      const startdate = utils.getConvertedToDateOnly(
        this.earlyGoForm.value.dateToSkip
      );
      startdate.setHours(
        Number(startTime.split(':')[0]),
        Number(startTime.split(':')[1])
      );

      this.earlyGoForm.controls.vtoStartTime.setValue(startdate);
      this.earlyGoForm.controls.dateToSkip.setValue(startdate.toLocaleString());
    } else {
      this.utilityService.showErrorToast(Constants.SHIFT_START_TIME_CONFIGURE);
      this.earlyGoForm.controls.vtoStartTime.setValue(null);
    }
    if (!!endTime) {
      const enddate = utils.getConvertedToDateOnly(
        this.earlyGoForm.value.dateToSkip
      );
      enddate.setHours(
        Number(endTime.split(':')[0]),
        Number(endTime.split(':')[1])
      );
      // this.earlyGoForm.controls.vtoEndTime.setValue(enddate.toLocaleString());
    } else {
      this.utilityService.showErrorToast(Constants.SHIFT_END_TIME_CONFIGURE);
      // this.earlyGoForm.controls.vtoEndTime.setValue(null);
    }
    this.cdRef.detectChanges();
  }
  diff_hours(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  }

  makeNextDate(startTime) {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return new Date(
      tomorrow.getFullYear(),
      tomorrow.getMonth(),
      tomorrow.getDate(),
      Number(startTime.split(':')[0]),
      Number(startTime.split(':')[1]),
      0
    ).toUTCString();
  }
  startTimeChange(event) {
    // this.setUtoTime(event);
    if (!this.nightShift) {
      if (
        new Date(event).getHours() > Number(this.shiftEndTime.split(':')[0])
      ) {
        this.utoMessage = 'Your start time is greater than shift end time';
        this.earlyGoForm.controls.uTOHours.setValue('');
      }
      if (
        new Date(event).getHours() < Number(this.shiftStartTime.split(':')[0])
      ) {
        this.utoMessage = 'Your start time is less than shift start time';
        this.earlyGoForm.controls.uTOHours.setValue('');
      }
    } else {
      if (new Date(event).getHours() > 12) {
        if (
          new Date(event).getHours() < Number(this.shiftEndTime.split(':')[0])
        ) {
          this.utoMessage = 'Your start time is greater than shift end time';
          this.earlyGoForm.controls.uTOHours.setValue('');
        }
        if (
          new Date(event).getHours() < Number(this.shiftStartTime.split(':')[0])
        ) {
          this.utoMessage = 'Your start time is less than shift start time';
          this.earlyGoForm.controls.uTOHours.setValue('');
        }
      } else {
        if (
          new Date(event).getHours() > Number(this.shiftEndTime.split(':')[0])
        ) {
          this.utoMessage = 'Your start time is greater than shift end time';
          this.earlyGoForm.controls.uTOHours.setValue('');
        }
        if (
          new Date(event).getHours() > Number(this.shiftStartTime.split(':')[0])
        ) {
          this.utoMessage = 'Your start time is less than shift start time';
          this.earlyGoForm.controls.uTOHours.setValue('');
        }
      }
    }
  }

  save() {
    console.log(this.earlyGoForm.value);
    this.disableBtn = true;
    if (this.otherReason) {
    }
    // this.e = this.shiftEndTime;
    this.formService.markFormGroupTouched(this.earlyGoForm);
    if (this.earlyGoForm.invalid) {
      return;
    }
    // this.earlyGoForm.controls.uTOHours.enable();

    // if(this.earlyGoForm.controls.uTOHours.value == ""){
    //   if(this.utoMessage != ""){
    //     this.utilityService.showErrorToast(this.utoMessage);
    //     return;
    //   }
    // }
    let selectedDateTime = new Date(this.earlyGoForm.controls.dateToSkip.value);
    if (selectedDateTime < new Date()) {
      this.utilityService.showErrorToast('You cannot add request in past time');
      return;
    }
    const startTimeValue = this.earlyGoForm.controls.dateToSkip.value;
    this.startTime = startTimeValue;
    // const endTimeValue = this.earlyGoForm.controls.vtoEndTime.value;
    var startTime =
      new Date(startTimeValue).getHours().toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      ':' +
      new Date(startTimeValue).getMinutes().toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      ':00';
    // if (this.shiftStartTime == startTime) {
    //   return this.openStartConfirmPopup();
    // }

    if (!!new Date(this.earlyGoForm.controls.vtoStartTime.value).getTime()) {
      this.earlyGoForm.controls.vtoStartTime.setValue(
        new Date(startTimeValue).getHours() +
          ':' +
          new Date(startTimeValue).getMinutes()
      );
    }
    // if (!!new Date(this.earlyGoForm.controls.vtoEndTime.value).getTime()) {
    //   this.earlyGoForm.controls.vtoEndTime.setValue(
    //     new Date(endTimeValue).getHours() +
    //       ':' +
    //       new Date(endTimeValue).getMinutes()
    //   );
    // }

    this.utilityService.showLoadingwithoutDuration();
    this.earlyOutService.getSettingType(null).then((res) => {
      let enableVal = false;
      this.settingType = res;
      let proceed = false;
      if (!!this.settingType && this.settingType.Data.length > 0) {
        enableVal = this.settingType.Data.find(
          (x) => x.SettingType == 'Early-out intervention' && x.OfferType == 7
        );
        if (enableVal) {
          if (enableVal['Enable']) {
            proceed = enableVal['Enable'];
          }
        } else {
          this.utilityService.hideLoading();

          this.utilityService.showErrorToast(
            'Setting configurations not found, Please contact HR admin'
          );
        }
      }
      if (proceed) {
        const date = this.earlyGoForm.controls.dateToSkip.value;
        const dateToSkip = new Date(date);
        const firstDay = new Date(
          dateToSkip.setDate(dateToSkip.getDate() - 30)
        );
        const startdate = this.datePipe.transform(
          this.setnewDate(firstDay),
          'yyyy-MM-dd'
        );
        const Enddate = this.datePipe.transform(
          this.setnewDate(date),
          'yyyy-MM-dd'
        );
        if (!navigator.onLine) {
          return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
        }
        const checkExistingRequests =
          this.earlyOutService.checkWeeklyCallOffRequest(
            startdate,
            Enddate,
            this.earlyGoForm.controls.offerId.value
          );
        checkExistingRequests.then(
          (res) => {
            if (res['Success']) {
              if (parseInt(res['Message']) > 0) {
                this.confirmMsg = `You have called off and taken early out for total of ${parseInt(
                  res['Message']
                )} time in last 30 days. Are you sure you want to continue?`;
                let count = parseInt(res['Message']);

                this.openContinue(count);

                this.isConfirm = true;
              } else {
                this.openPopup();
              }
            } else {
              this.utilityService.showErrorToast(res['Message']);
            }
            this.utilityService.hideLoading();
          },
          (err) => {
            this.utilityService.hideLoading();
          }
        );
      } else {
        this.proceedSubmit(event);
      }
    });
  }
  close() {
    this.counter = 0;
    this.isConfirm = false;
    this.earlyOutService.cancelEarlyOutUserRequest(7, this.cancleLogMsg);
    // this.modal.dismiss();
  }
  async openContinue(count: any) {
    // this.isConfirm = false;

    const alert = await this.alertController.create({
      cssClass: 'delete-popo-up-class',
      message:
        '<b>You have called off and taken early out for total of </b>' +
        count +
        '<b> time in last 30 days. Are you sure you want to continue?</b>',
      buttons: [
        {
          text: 'Yes',
          role: 'submit',
          cssClass: 'secondary',
          handler: async () => {
            this.disableBtn = false;
            //this.msgShow();
            if (this.isShow) {
              this.openPopup();
            } else {
              await this.proceedSubmit(event);
            }
          },
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.disableBtn = false;
            this.earlyGoForm.controls.vtoStartTime.setValue(this.startTime);
          },
        },
      ],
    });
    await alert.present(); //   class: 'modal-dialog-centered modal-md',
    //   backdrop: 'static'
    // });
  }
  async openPopup() {
    // this.isConfirm = false;

    const alert = await this.alertController.create({
      cssClass: 'delete-popo-up-class',
      message:
        ' <b>It is suggested to preserve UTO as much as you can for emergency purposes. Sorry life threw a curved ball at you today. Let us know if we can help you.</b>',
      buttons: [
        {
          text: 'Continue',
          role: 'submit',
          cssClass: 'secondary',
          handler: () => {
            this.disableBtn = false;
            this.proceedSubmit(event);
          },
        },
        {
          text: 'Cancel Request',
          role: 'cancel',
          handler: () => {
            this.disableBtn = false;
            this.cancelValidationPopUp();
          },
        },
      ],
    });
    await alert.present(); //   class: 'modal-dialog-centered modal-md',
    //   backdrop: 'static'
    // });
  }

  async openStartConfirmPopup() {
    const alert = await this.alertController.create({
      cssClass: 'delete-popo-up-class',
      message:
        ' <b>Early-out screen is used for obtaining approval to leave early from your supervisor. If you intend to call-off for the whole shift, please use Call-Off screen.</b>',
      buttons: [
        {
          text: 'Okay',
          role: 'submit',
          handler: () => {
            this.disableBtn = false;
            this.cancelValidationPopUp();
          },
        },
      ],
    });
    await alert.present();
  }
  cancelValidationPopUp() {
    this.earlyOutService.cancelEarlyOutUserRequest(7, this.cancleLogMsg);
  }
  proceedSubmit(data) {
    // this.modalRef.hide();
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    //  const newDate = this.earlyGoForm.controls.vtoStartTime.value.split('/')[2];
    // const newDate1 = newDate.split(',')[1];
    // const startTime = newDate1.split(' ')[1];
    const startTimeValue = this.earlyGoForm.controls.dateToSkip.value;
    this.startTime = startTimeValue;
    var startTime =
      new Date(startTimeValue).getHours().toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      ':' +
      new Date(startTimeValue).getMinutes().toLocaleString('en-US', {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      ':00';
    const shiftStartTime = startTime.split(':');
    const oldDate = this.earlyGoForm.controls.dateToSkip.value;
    // let shiftStartTime = this.earlyGoForm.value.vtoStartTime.split(':');
    // night issue from piyush
    // if(this.earlyGoForm.controls.IsDateCrossOver.value){
    //   if (shiftStartTime != null && this.nightShift) {
    //     if (12 < Number(this.earlyGoForm.value.vtoStartTime.split(":")[0])) {
    //       const mxdate = this.datePipe.transform(
    //         this.setnewDate(
    //           new Date(this.earlyGoForm.controls.dateToSkip.value).setDate(
    //             new Date(this.earlyGoForm.controls.dateToSkip.value).getDate() -1
    //           )
    //         ),
    //         "yyyy-MM-dd"
    //       );
    //       this.earlyGoForm.controls.dateToSkip.setValue(mxdate);
    //       this.earlyGoForm.controls.IsDateCrossOver.setValue(false);
    //     }
    //   }
    // }
    // else if (shiftStartTime != null && this.nightShift) {
    //   if (12 >= Number(this.earlyGoForm.value.vtoStartTime.split(":")[0])) {
    //     const mxdate = this.datePipe.transform(
    //       this.setnewDate(
    //         new Date(this.earlyGoForm.controls.dateToSkip.value).setDate(
    //           new Date(this.earlyGoForm.controls.dateToSkip.value).getDate() + 1
    //         )
    //       ),
    //       "yyyy-MM-dd"
    //     );
    //     this.earlyGoForm.controls.dateToSkip.setValue(mxdate);
    //     this.earlyGoForm.controls.IsDateCrossOver.setValue(true);
    //   }
    //   else{
    //     const mxdate = this.datePipe.transform(
    //       this.setnewDate(this.earlyGoForm.controls.dateToSkip.value),
    //       "yyyy-MM-dd"
    //     );
    //     this.earlyGoForm.controls.dateToSkip.setValue(mxdate);
    //     this.earlyGoForm.controls.IsDateCrossOver.setValue(false);
    //   }
    // } else {
    //   const mxdate = this.datePipe.transform(
    //     this.setnewDate(this.earlyGoForm.controls.dateToSkip.value),
    //     'yyyy-MM-dd'
    //   );
    //   this.earlyGoForm.controls.IsDateCrossOver.setValue(false);
    //   this.earlyGoForm.controls.dateToSkip.setValue(mxdate);
    // }
    const mxdate = this.datePipe.transform(
      this.setnewDate(this.earlyGoForm.controls.dateToSkip.value),
      'yyyy-MM-dd'
    );
    this.earlyGoForm.controls.IsDateCrossOver.setValue(false);
    this.earlyGoForm.controls.dateToSkip.setValue(mxdate);
    this.earlyGoForm.controls.vtoStartTime.setValue(
      new Date(startTimeValue).getHours() +
        ':' +
        new Date(startTimeValue).getMinutes()
    );
    this.utilityService.showLoadingwithoutDuration();
    this.earlyGoForm.controls.uTOHours.setValue(null);
    const saveMethod =
      this.earlyGoForm.controls.offerId.value > 0
        ? this.earlyOutService.updateEarlyOutRequestOffer(
            this.earlyGoForm.value
          )
        : this.earlyOutService.addEarlyOutRequest(this.earlyGoForm.value);
    saveMethod.then(
      (res) => {
        if (res['Success']) {
          this.counter = 0;
          this.utilityService.hideLoading();
          this.utilityService.showSuccessToast(
            this.earlyGoForm.controls.offerId.value > 0
              ? Constants.EARLY_OUT_REQUEST_UPDATE_SUCCESS_MSG
              : Constants.EARLY_OUT_REQUEST_ADD_SUCCESS_MSG
          );
          this.router.navigate(['tabs/early-go-requests']);
        } else {
          this.utilityService.hideLoading();
          this.utilityService.showErrorToast(res['Message']);
          this.earlyGoForm.controls.dateToSkip.setValue(oldDate);
          //this.earlyGoForm.controls.dateToSkip.setValue(new Date(mxdate));
        }
      },
      (err) => {
        this.earlyGoForm.controls.dateToSkip.setValue(oldDate);
        this.utilityService.hideLoading();
      }
    );
  }
  closeModal() {
    this.counter = 0;
    if (this.action == 'edit') {
      this.router.navigate(['tabs/earlygo-request-detail']);
    } else if (this.action == 'add') {
      this.router.navigate(['tabs/early-go-requests']);
    }
  }
  async getTermsConditionList() {
    let that = this;
    await this.earlyOutService
      .getTermsConditionListByCompanyId(this.companyId, null)
      .then((res: any) => {
        that.description = res['Data'];
        if (!!that.description && that.description.length > 0) {
          let _setting = that.description.filter(
            (x) => x.typeFieldstr == 'Early-Out UTO Message'
          );
          if (_setting.length > 0) {
            that.enableValue = that.getTextMessagefromHtml(
              _setting[0].description
            );
          }
        }
      });
  }

  getTextMessagefromHtml(message, isChatListCache = false) {
    let parser = new DOMParser();
    const parsedDocument = parser.parseFromString(message, 'text/html');
    if (!!parsedDocument.body.firstChild) {
      return parsedDocument.body.innerText;
    } else return '';
  }

  async msgShow() {
    let that = this;
    await this.earlyOutService.getSettingType(null).then((res) => {
      that.settingType = res;
      if (!!that.settingType && that.settingType.Data.length > 0) {
        that.enableVal = that.settingType.Data.find(
          (x) =>
            x.SettingType == 'UTO system for attendance' && x.OfferType == 7
        );
      }

      if (!!that.enableVal) {
        if (that.enableVal['Enable']) {
          that.isShow = that.enableVal['Enable'];
        }
      }
    });
  }

  async getSettingByCompanyID() {
    let module = SubscriptionType.filter((item) => {
      return item.value === 'Early Out Module';
    });
    this.moduleId = module[0].id;
    const getMethod = this.callInRequstService.getSettingByCompanyID(
      this.moduleId,
      this.companyId
    );
    await getMethod.then(
      (res: any) => {
        if (res['Success']) {
          this.settingList = res.Data;
          if (this.settingList.length > 0) {
            this.settingList.map((item) => {
              if (item.SettingType === SettingType[0].value) {
                item.Name = 'Paid Time Off';
                this.paidTimeOff = item;
                if (this.value('offerId') == 0) {
                  if (this.paidTimeOff.Enable == true) {
                    this.isPaidTimeOff = true;
                    this.message =
                      'All missed time will be covered by your Unpaid Time Off (UTO) balance. If you do not have enough UTO balance to cover the entire absence, Paid Time Off (PTO) will be applied to cover the shortage. It is your responsibility to ensure that you have enough UTO+PTO accumulated to cover this absence.';
                    this.earlyGoForm.controls['IsPaidOff'].setValue(true);
                  } else {
                    this.isPaidTimeOff = false;
                    this.message =
                      'All missed time will be covered by your Unpaid Time Off (UTO) balance. It is your responsibility to ensure that you have enough UTO accumulated to cover this absence.';
                    this.earlyGoForm.controls['IsPaidOff'].setValue(false);
                  }
                }
              }
            });
          }
        } else {
          this.settingList = [];
        }
      },
      (err) => {
        this.settingList = [];
      }
    );
  }
  control(controlName: string): AbstractControl {
    return this.earlyGoForm.get(controlName);
  }

  value(controlName: string) {
    return this.control(controlName).value;
  }
}
