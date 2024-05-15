import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, NgZone, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { ModalController, AlertController } from '@ionic/angular';
import { of } from 'rxjs';
import { bsConfig, Constants } from 'src/app/constant/constants';
import { LateInOffer, Offer } from 'src/app/models/offer.model';
import { FormService } from 'src/app/services/form/form.service';
import { LateInService } from 'src/app/services/lateIn/late-in.service';
import { ShiftService } from 'src/app/services/shift/shift.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { utils } from 'src/app/constant/utils';
@Component({
  selector: 'app-add-edit-late-in-request',
  templateUrl: './add-edit-late-in-request.page.html',
  styleUrls: ['./add-edit-late-in-request.page.scss'],
})
export class AddEditLateInRequestPage implements OnInit {
  @ViewChild('confirmationPopup', { static: false })
  confirmationPopup: TemplateRef<any>;
  @ViewChild('startTimeConfirmPopup', { static: false })
  startTimeConfirmPopup: TemplateRef<any>;

  @Input() Offer: Offer;
  @Output() closeRequest = new EventEmitter<boolean>();
  public lateInForm: FormGroup;
  OtherReason: string;
  otherReason = false;
  bsConfig = bsConfig;
  action: any;
  role: number;
  test = 0;
  shiftEndTime: string;
  shiftStartTime: string;
  departmentId: number;
  companyId: number;
  shiftId: number;
  moduleId: any;
  oldDate: any;
  IsCoverMyWork = false;
  departmentList = [];
  reasonList = [];
  public messageList: any = new LateInOffer();
  todaysDate = new Date();
  tomorrowsDate = new Date(new Date().setDate(this.todaysDate.getDate() + 1));
  minDate = new Date(this.todaysDate).toISOString();
  maxYear = new Date('2050-12-31').toISOString();
  isOtherReason = false;
  counter = 0;
  nightShift = false;
  isx: boolean;
  currentPage = Constants.CURRENT_PAGE;
  public disableBtn = false;
  isConfirm = false;
  confirmMsg: string;
  paidTimeOff: any;
  isPaidTimeOff: boolean;
  message: string;
  cancleLogMsg: string = 'successfully prevented an late in.';
  suggestionMsg: string =
    'It is suggested to preserve UTO as much as you can for emergency purposes. Sorry life threw a curved ball at you today. Let us know if we can help you.';
  startTimeConfirmMsg: string =
    'Late-in screen is used for obtaining approval to come late from your supervisor. If you intend to call-off for the whole shift, please use Call-Off screen.';
  isShow: boolean = false;
  public startTime: any;
  public utoHours: any;
  settingType: any = [];
  public settingList: any = [];
  SettingType: string;
  enableValue: any = 'test';
  description: any = [];
  enableVal = false;
  isChangeTime = false;
  selectedDate: any;
  isValidTime: boolean;
  ionDateTimePickerActivated = true;
  lateInFirstTime = true;
  onSubmitting = false;
  utoMessage: any;
  constructor(
    public modal: ModalController,
    public lateInService: LateInService,
    public shiftService: ShiftService,
    public utilityService: UtilityService,
    private datePipe: DatePipe,
    public ngZone: NgZone,
    private formService: FormService,
    public alertController: AlertController,
    public router: Router,
    public keyboard: Keyboard,
    public route: ActivatedRoute,
    public cRef: ChangeDetectorRef,
    public fb: FormBuilder
  ) {
    this.route.queryParams.subscribe((params) => {
      this.action = params.action;
    });
  }

  ngOnInit() {}
  async ionViewWillEnter() {
    try{
      this.tomorrowsDate = new Date(new Date().setDate(this.todaysDate.getDate() + 1));
      this.onSubmitting = false;
      this.counter = 0;
      this.selectedDate = undefined;
      this.ionDateTimePickerActivated = true;
      this.utilityService.showLoadingwithoutDuration();
      if (this.action == 'edit') {
        this.Offer = JSON.parse(localStorage.getItem(Constants.LATE_IN_DATA));
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
      await this.initializeLateInForm();
      await this.initializeMessages();
      await this.msgShow();
      await this.getTermsConditionList();
      // this.tomorrowsDate.setDate(this.todaysDate.getDate() + 1);
      this.cRef.detectChanges();
      this.utilityService.hideLoading();
    }catch(e){
      console.log(e);
      this.utilityService.hideLoading();
    }
  }
  async initializeLateInForm() {
    if(this.lateInForm){
      this.lateInForm.reset();
    }
    this.lateInForm =  this.fb.group({
      offerId: new FormControl(!!this.Offer ? this.Offer.offerId : 0),
      status: new FormControl(!!this.Offer ? this.Offer.status : 1),
      companyId: new FormControl(this.companyId),
      departmentId: new FormControl(this.departmentId),
      offerType: new FormControl(10),
      shiftToSkip: new FormControl(this.shiftId),
      dateToSkip: new FormControl(
        !!this.Offer
          ? this.getDateToSkip(
              new Date(this.Offer.dateToSkip),
              this.Offer.vtoStartTime
            )
          : utils.getConvertedToDateOnly(new Date()),
        Validators.required
      ),
      vtoStartTime: new FormControl(
        !!this.Offer ? this.Offer.vtoStartTime : ''
      ),
      // vtoEndTime: new FormControl(!!this.Offer ? this.Offer.vtoEndTime : ''),
      ReasonId: new FormControl(
        !!this.Offer ? this.Offer.ReasonId : '',
        Validators.required
      ),
      uTOHours: new FormControl(!!this.Offer ? this.Offer.uTOHours : ''),
      createdBy: new FormControl(!!this.Offer ? this.Offer.createdBy : null),
      OtherReason: new FormControl(!!this.Offer ? this.Offer.OtherReason : ''),
    });
    if (
      this.lateInForm.controls.offerId.value > 0 &&
      this.lateInForm.controls.ReasonId.value === 1
    ) {
      this.isOtherReason = true;
      this.lateInForm.controls.OtherReason.setValidators(Validators.required);
    }
    // TODO: KISHAN not sure why this needed, in WEB not there
    // if(this.lateInForm.controls.offerId.value > 0){
    //   this.setTimes(this.Offer.vtoStartTime,this.Offer.vtoEndTime)
    // }
    this.lateInForm.controls.vtoStartTime.setValidators(Validators.required);
    // this.lateInForm.controls.vtoEndTime.setValidators(Validators.required);
    this.lateInForm.controls.vtoStartTime.updateValueAndValidity();
    // this.lateInForm.controls.vtoEndTime.updateValueAndValidity();

    if(this.lateInFirstTime){
      this.lateInFirstTime = false;
      this.skipDateChange(new Date().toLocaleString());
    }
    if(this.lateInForm.controls.offerId.value > 0){
      this.selectedDate = new Date(this.lateInForm.controls.dateToSkip.value).toDateString();
    }

    if (this.lateInForm.controls.offerId.value > 0) {
      let date = utils.getConvertedToDateOnly(this.Offer.dateToSkip);
      console.log(date);
      let existingStartTime = this.Offer.vtoStartTime.split(':');
      if (existingStartTime.length === 3) {
        date.setHours(
          parseInt(existingStartTime[0]),
          parseInt(existingStartTime[1]),
          parseInt(existingStartTime[2])
        );
        this.lateInForm.controls.dateToSkip.setValue(date.toLocaleString());
      }
    } 

  }
  getDateToSkip(dateToSkip, vtoStartTime) {
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

  async getReasonList() {
    let that = this;
    await this.lateInService.getReasons().then(
      (response) => {
        if (response['Success']) {
          that.reasonList = response['Data'];

          // TODO: KISHAN not sure why added here
          // if (!!this.Offer) {
          //   this.initializeLateInForm();
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
  initializeMessages() {
    this.messageList.endTime = {
      required: Constants.VALIDATION_MSG.LATE_IN.END_TIME,
    };
    this.messageList.startTime = {
      required: Constants.VALIDATION_MSG.LATE_IN.START_TME,
    };
    this.messageList.date = {
      required: Constants.VALIDATION_MSG.LATE_IN.DATE,
    };
    this.messageList.reason = {
      required: Constants.VALIDATION_MSG.LATE_IN.REASON,
    };
    this.messageList.utoHours = {
      required: Constants.VALIDATION_MSG.LATE_IN.UTO_HOURS,
    };
    this.messageList.OtherReason = {
      required: Constants.VALIDATION_MSG.CALL_IN.OTHER_REASON,
    };
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
      const startdate = utils.getConvertedToDateOnly(this.lateInForm.value.dateToSkip);
      startdate.setHours(
        Number(startTime.split(':')[0]),
        Number(startTime.split(':')[1])
      );

      this.lateInForm.controls.vtoStartTime.setValue(startdate);
      this.lateInForm.controls.dateToSkip.setValue(startdate.toLocaleString());
      this.lateInForm.controls.dateToSkip.updateValueAndValidity();

    } else {
      this.utilityService.showErrorToast(Constants.SHIFT_START_TIME_CONFIGURE);
      this.lateInForm.controls.vtoStartTime.setValue(null);
    }
    // if (!!endTime) {
    //   const enddate = utils.getConvertedToDateOnly(this.lateInForm.value.dateToSkip);
    //   enddate.setHours(
    //     Number(endTime.split(':')[0]),
    //     Number(endTime.split(':')[1])
    //   );
    //   // this.lateInForm.controls.vtoEndTime.setValue(enddate.toLocaleString());
    // } else {
    //   this.utilityService.showErrorToast(Constants.SHIFT_END_TIME_CONFIGURE);
    //   // this.lateInForm.controls.vtoEndTime.setValue(null);
    // }
    this.cRef.detectChanges();
  }

  reasonChange(value: string) {
    if (parseInt(value) === 1) {
      this.otherReason = true;
      this.lateInForm.controls.OtherReason.setValidators(Validators.required);
    } else {
      this.otherReason = false;
      this.lateInForm.controls.OtherReason.setValue('');
      this.lateInForm.controls.OtherReason.setValidators(null);
      this.lateInForm.controls.OtherReason.updateValueAndValidity();
    }
  }
  startTimeChange(event) {
    this.setUtoTime(event);
    if (!this.nightShift) {
      if (
        new Date(event).getHours() > Number(this.shiftEndTime.split(':')[0])
      ) {
        this.utoMessage = 'Your start time is greater than shift end time';
        this.lateInForm.controls.uTOHours.setValue('');
      }
      if (
        new Date(event).getHours() < Number(this.shiftStartTime.split(':')[0])
      ) {
        this.utoMessage = 'Your start time is less than shift start time';
        this.lateInForm.controls.uTOHours.setValue('');
      }
    } else {
      if (new Date(event).getHours() > 12) {
        if (
          new Date(event).getHours() < Number(this.shiftEndTime.split(':')[0])
        ) {
          this.utoMessage = 'Your start time is greater than shift end time';
          this.lateInForm.controls.uTOHours.setValue('');
        }
        if (
          new Date(event).getHours() < Number(this.shiftStartTime.split(':')[0])
        ) {
          this.utoMessage = 'Your start time is less than shift start time';
          this.lateInForm.controls.uTOHours.setValue('');
        }
      } else {
        if (
          new Date(event).getHours() > Number(this.shiftEndTime.split(':')[0])
        ) {
          this.utoMessage = 'Your start time is greater than shift end time';
          this.lateInForm.controls.uTOHours.setValue('');
        }
        if (
          new Date(event).getHours() > Number(this.shiftStartTime.split(':')[0])
        ) {
          this.utoMessage = 'Your start time is less than shift start time';
          this.lateInForm.controls.uTOHours.setValue('');
        }
      }
    }
  }

  async getTermsConditionList() {
    let that = this;
    await this.lateInService
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
  ionBlurEvent(event) {
    this.ionDateTimePickerActivated = true;
  }
  ionCancelEvent(event) {
    this.ionDateTimePickerActivated = false;
  }
  async skipDateChange(event) {
    console.log(this.lateInForm.controls.dateToSkip.value);
    if(this.onSubmitting) return;

    if(!this.ionDateTimePickerActivated) return;
    
    if ((!!this.Offer && this.counter === 0)) {
      this.ionDateTimePickerActivated = false;
      this.utilityService.showLoadingwithoutDuration();
      this.setTimes(this.Offer.vtoStartTime, this.Offer.vtoEndTime);
      await this.shiftService
        .getTimeByShiftDateTime(
          this.Offer.dateToSkip,
          this.Offer.shiftToSkip,
          1
        ).then((response) => {
          if (response["Success"]) {
            this.shiftEndTime = response['Data'].endTime;
            this.shiftStartTime = response['Data'].startTime;
            this.nightShift = false;
            if (
              Number(this.shiftEndTime.split(':')[0]) -
              Number(this.shiftStartTime.split(':')[0]) <
              0
            )
            this.nightShift = true;
            this.utilityService.hideLoading();
          }
        },
          (err) => { 
            if (this.utilityService.isLoading) {
              this.utilityService.hideLoading();
            }
          });
      this.counter++;
    }
    else {
      if (!!event) {
        let selectedTime = new Date(this.lateInForm.controls.dateToSkip.value).toDateString();
        if(!!this.selectedDate 
          && this.selectedDate == selectedTime){
          this.selectedDate = selectedTime;
          this.startTimeChange(utils.getConvertedDateTime(this.lateInForm.controls.dateToSkip.value));
          this.lateInForm.controls.vtoStartTime.setValue(new Date(this.lateInForm.controls.dateToSkip.value).toLocaleString())
        }
        else{
          this.selectedDate = selectedTime;
          this.ionDateTimePickerActivated = false;
          const skipDate = this.datePipe.transform(
            this.setnewDate(selectedTime),
            "yyyy-MM-dd"
          );
          this.lateInForm.controls.dateToSkip.setValue(skipDate);
          this.utilityService.showLoadingwithoutDuration();
          await this.getTimeByShiftDateTime(skipDate,this.shiftId).then(() =>{
            this.utilityService.hideLoading();
          });
        }
      }
    }
  }

  async getTimeByShiftDateTime(date, shift) {
    if (!this.utilityService.isLoading) {
      this.utilityService.showLoadingwithoutDuration();
    }
    const formattedDate = this.datePipe.transform(date, 'yyyy-MM-dd');
    await this.shiftService.getTimeByShiftDateTime(formattedDate, Number(shift), 1).then(
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
          this.setUtoTime(this.lateInForm.controls.vtoStartTime.value);
        } else {
        }
        if (this.utilityService.isLoading) {
          this.utilityService.hideLoading();
        }
      },
      (err) => {
        if (this.utilityService.isLoading) {
          this.utilityService.hideLoading();
        }
      }
    );
  }
  setUtoTime(startTime) {
    if (
      new Date(startTime).getHours() ==
        Number(this.shiftEndTime.split(':')[0]) &&
      new Date(startTime).getMinutes() > 0
    ) {
      this.utoMessage = 'Your start time is greater than shift end time';
      this.lateInForm.controls.uTOHours.setValue('');
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
    this.lateInForm.controls.uTOHours.setValue(utoHours + '.' + utoMinutes);
  }

  async save() {
    try {
      let that = this;
      
      this.disableBtn = true;
      if (this.otherReason) {
      }
      this.formService.markFormGroupTouched(this.lateInForm);
      if (this.lateInForm.invalid) {
        return;
      }
      let selectedDateTime = new Date(this.lateInForm.controls.dateToSkip.value);
      if (selectedDateTime < new Date()) {
        this.utilityService.showErrorToast('You cannot add request in past time');
        return;
      }
      const mxdate = this.datePipe.transform(
        this.setnewDate(this.lateInForm.controls.dateToSkip.value),
        'yyyy-MM-dd'
      );
      const startTimeValue = this.lateInForm.controls.vtoStartTime.value;
      this.startTime = startTimeValue;
      // const endTimeValue = this.lateInForm.controls.vtoEndTime.value;

      var startTime =
        new Date(startTimeValue)
          .getHours()
          .toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false,
          }) +
        ':' +
        new Date(startTimeValue)
          .getMinutes()
          .toLocaleString('en-US', {
            minimumIntegerDigits: 2,
            useGrouping: false,
          }) +
        ':00';

        if (
          !!new Date(this.lateInForm.controls.vtoStartTime.value).getTime()
        ) {
          this.lateInForm.controls.vtoStartTime.setValue(
            new Date(startTimeValue).getHours() +
              ':' +
              new Date(startTimeValue).getMinutes()
          );
        }
        // if (!!new Date(this.lateInForm.controls.vtoEndTime.value).getTime()) {
        //   this.lateInForm.controls.vtoEndTime.setValue(
        //     new Date(endTimeValue).getHours() +
        //       ':' +
        //       new Date(endTimeValue).getMinutes()
        //   );
        // }

      // if (this.shiftStartTime == startTime) {
      //   return this.openStartConfirmPopup();
      // }
      this.onSubmitting = true;
  
      this.utilityService.showLoadingwithoutDuration();
      await this.lateInService.getSettingType(null).then(async (res) => {
        let enableVal = false;
        that.settingType = res;
        let proceed = false;
        if (!!that.settingType && that.settingType.Data.length > 0) {
          enableVal = that.settingType.Data.find(
            (x) =>
              x.SettingType == 'Early-out intervention' && x.OfferType == 10
          );
          if (enableVal) {
            if (enableVal['Enable']) {
              proceed = enableVal['Enable'];
            }
          } else {
            this.onSubmitting = false;
            that.utilityService.hideLoading();
            that.utilityService.showErrorToast(
              'Setting configurations not found, Please contact HR admin'
            );
            return;
          }
        }
        if (proceed) {
          const date = that.lateInForm.controls.dateToSkip.value;
          const dateToSkip = new Date(date);
          const firstDay = new Date(
            dateToSkip.setDate(dateToSkip.getDate() - 30)
          );
          const startdate = that.datePipe.transform(
            that.setnewDate(firstDay),
            'yyyy-MM-dd'
          );
          const Enddate = that.datePipe.transform(
            that.setnewDate(date),
            'yyyy-MM-dd'
          );
          if (!navigator.onLine) {
            return that.utilityService.showErrorToast(Constants.OFFLINE_MSG);
          }
          await that.lateInService
            .checkWeeklyCallOffRequest(
              startdate,
              Enddate,
              that.lateInForm.controls.offerId.value
            )
            .then(
              (res) => {
                if (res['Success']) {
                  that.utilityService.hideLoading();
                  if (parseInt(res['Message']) > 0) {
                    that.confirmMsg = `You have called off and taken late in for total of ${parseInt(
                      res['Message']
                    )} time in last 30 days. Are you sure you want to continue?`;
                    let count = parseInt(res['Message']);

                    that.openContinue(count);

                    that.isConfirm = true;
                  } else {
                    that.openPopup();
                  }
                } else {
                  that.utilityService.showErrorToast(res['Message']);
                }
              },
              (err) => {}
            );
        } else {
          that.utilityService.hideLoading();
          await this.proceedSubmit(event);
        }
      });
    } catch (err) {
      this.onSubmitting = false;
      console.log(err);
      this.utilityService.hideLoading();
    }
  }

  async openStartConfirmPopup() {
    const alert = await this.alertController.create({
      cssClass: 'delete-popo-up-class',
      message:
        ' <b>Late-in screen is used for obtaining approval to come late from your supervisor. If you intend to call-off for the whole shift, please use Call-Off screen.</b>',
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
    this.lateInService.cancelLateInUserRequest(10, this.cancleLogMsg);
  }

  async openPopup() {
    const alert = await this.alertController.create({
      cssClass: 'delete-popo-up-class',
      message:
        ' <b>It is suggested to preserve UTO as much as you can for emergency purposes. Sorry life threw a curved ball at you today. Let us know if we can help you.</b>',
      buttons: [
        {
          text: 'Continue',
          role: 'submit',
          cssClass: 'secondary',
          handler: async () => {
            this.disableBtn = false;
            await this.proceedSubmit(event);
          },
        },
        {
          text: 'Cancel Request',
          role: 'cancel',
          handler: () => {
            this.onSubmitting = false;
            this.disableBtn = false;
            this.cancelValidationPopUp();
          },
        },
      ],
    });
    await alert.present();
  }
  close(event) {
    this.counter = 0;
    this.isConfirm = false;
    this.lateInService.cancelLateInUserRequest(10, this.cancleLogMsg);
  }
  async openContinue(count: any) {
    const alert = await this.alertController.create({
      cssClass: 'delete-popo-up-class',
      message:
        '<b>You have called off and taken late in for total of </b>' +
        count +
        '<b> time in last 30 days. Are you sure you want to continue?</b>',
      buttons: [
        {
          text: 'Yes',
          role: 'submit',
          cssClass: 'secondary',
          handler: async () => {
            this.disableBtn = false;
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
            this.onSubmitting = false;
            this.lateInForm.controls.vtoStartTime.setValue(this.startTime);
          },
        },
      ],
    });
    await alert.present();
  }

  async proceedSubmit(data) {
    try{
      const oldDate = this.lateInForm.controls.dateToSkip.value;
      const mxdate = this.datePipe.transform(
        this.setnewDate(this.lateInForm.controls.dateToSkip.value),
        'yyyy-MM-dd'
      );
      this.lateInForm.controls.dateToSkip.setValue(mxdate);
      if (!navigator.onLine) {
        return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      }
      this.utilityService.showLoadingwithoutDuration();
      const saveMethod =
        this.lateInForm.controls.offerId.value > 0
          ? this.lateInService.updateLateInRequestOffer(this.lateInForm.value)
          : this.lateInService.addLateInRequest(this.lateInForm.value);
      await saveMethod.then(
        (res) => {
          this.onSubmitting = false;
          if (res['Success']) {
            this.utilityService.hideLoading();
            this.utilityService.showSuccessToast(
              this.lateInForm.controls.offerId.value > 0
                ? Constants.LATE_IN_REQUEST_UPDATE_SUCCESS_MSG
                : Constants.LATE_IN_REQUEST_ADD_SUCCESS_MSG
            );
  
            this.router.navigate(['tabs/late-in-request']);
          } else {
            this.utilityService.hideLoading();
            this.utilityService.showErrorToast(res['Message']);
            this.lateInForm.controls.dateToSkip.setValue(oldDate);
          }
        },
        (err) => {
          this.utilityService.hideLoading();
        }
      );
    }catch(err){
      this.onSubmitting = false;
      console.log(err);
      this.utilityService.hideLoading();
    }
  }

  async msgShow() {
    let that = this;
    await this.lateInService.getSettingType(null).then((res) => {
      that.settingType = res;
      if (!!that.settingType && that.settingType.Data.length > 0) {
        that.enableVal = that.settingType.Data.find(
          (x) =>
            x.SettingType == 'UTO system for attendance' && x.OfferType == 10
        );
      }

      if (!!that.enableVal) {
        if (that.enableVal['Enable']) {
          that.isShow = that.enableVal['Enable'];
        }
      }
    });
  }
  hideKey() {
    setTimeout(() => {
      this.keyboard.hide();
    }, 500);
  }

  closeModal() {
    this.counter = 0;
    if (this.action == 'edit') {
      this.router.navigate(['tabs/latein-request-detail']);
    } else if (this.action == 'add') {
      this.router.navigate(['tabs/late-in-request']);
    }
  }
  diff_hours(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60 * 60;
    return Math.abs(Math.round(diff));
  }
  control(controlName: string): AbstractControl {
    return this.lateInForm.get(controlName);
  }
  value(controlName: string) {
    return this.control(controlName).value;
  }
}
