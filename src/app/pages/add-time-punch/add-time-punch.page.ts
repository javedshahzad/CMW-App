import { Component, Input, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { OfferService } from '../../services/offer/offer.service';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Offer } from 'src/app/models/offer.model';
import { utils } from 'src/app/constant/utils';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { Constants, PunchTypeEnum } from 'src/app/constant/constants';
import { FormService } from '../../services/form/form.service';
import { UtilityService } from '../../services/utility/utility.service';
import { Role } from '../../models/role-model';

@Component({
  selector: 'app-add-time-punch',
  templateUrl: './add-time-punch.page.html',
  styleUrls: ['./add-time-punch.page.scss'],
})
export class AddTimePunchPage implements OnInit {
  public offerForm: FormGroup;
  @Input() Offer: Offer;
  today = new Date();
  minDate = new Date(this.today).toISOString();
  maxYear = new Date('2050-12-31').toISOString();
  punchTypeList = PunchTypeEnum;
  messageList: any = new Offer();
  isSubmitted: boolean = false;
  action: any;
  isSelectedCurrectShift = true;
  roleEnum = Role;
  role: number;
  removeFieldValue = false;
  companyId: number;
  public initalValues;
  noChangeDetect: boolean = false;
  noChangeTimeDetect: boolean = false;
  changedDate: any;

  constructor(
    public router: Router,
    private fb: FormBuilder,
    public keyboard: Keyboard,
    private formService: FormService,
    private utilityService: UtilityService,
    private datepipe: DatePipe,
    private offerService: OfferService,
    public ref: ChangeDetectorRef,
    public route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe((params) => {
      this.action = params.action;
    });
  }

  ngOnInit() {}

  async ionViewWillEnter() {
    try {
      if (this.offerForm) {
        this.offerForm.reset();
      }
      this.utilityService.showLoadingwithoutDuration();
      if (this.action === 'edit') {
        this.Offer = JSON.parse(
          localStorage.getItem(Constants.TIME_PUNCH_DATA)
        );
      } else {
        this.Offer = null;
      }
      this.isSelectedCurrectShift = true;
      if (this.role === this.roleEnum.user) {
        this.today.setDate(this.today.getDate() + 1);
      }
      this.removeFieldValue =
        !!this.Offer && this.Offer.offerId > 0 ? true : false;
      this.role = Number(localStorage.getItem(Constants.ROLE));
      this.companyId = Number(localStorage.getItem(Constants.COMPANYID));

      if (this.role === this.roleEnum.user) {
        const today = new Date();

        const tomorrow = new Date(today.setDate(today.getDate()));
        const tDate = utils.getConvertedDateToISO(tomorrow);
        this.minDate = tDate;
      }
      await this.initializeForm();
      await this.initializeMessages();
      this.ref.detectChanges();
      this.utilityService.hideLoading();
    } catch (e) {
      console.log(e);
      this.utilityService.hideLoading();
    }
    this.noChangeDetect = false;
    this.noChangeTimeDetect = false;
  }

  closeModal() {
    this.router.navigate(['/tabs/clock-in-out-request']);
  }

  async initializeForm() {
    this.offerForm = this.fb.group({
      TimePunchesId: new FormControl(
        !!this.Offer ? this.Offer.TimePunchesId : null
      ),
      PunchTime: new FormControl(
        !!this.Offer
          ? utils.getConvertedDateTime(this.Offer.PunchTime)
          : new Date().toLocaleString(),
        Validators.required
      ),
      PunchType: new FormControl(
        !!this.Offer ? this.Offer.PunchType : '',
        Validators.required
      ),
      PunchTimeHoursMinutes: new FormControl(
        !!this.Offer
          ? new Date(this.Offer.PunchTime)
          : this.setPunchTime(new Date()),
        Validators.required
      ),
      reason: new FormControl('', Validators.required),
      NewDate: new FormControl(!!this.Offer ? this.Offer.PunchTime : null),
      OldPunchType: new FormControl(!!this.Offer ? this.Offer.PunchType : ''),
      OldDate: new FormControl(
        !!this.Offer ? new Date(this.Offer.PunchTime) : null
      ),
    });
    this.initalValues = this.offerForm.value;
  }

  initializeMessages() {
    (this.messageList.PunchTime = {
      required: Constants.VALIDATION_MSG.TIME_PUNCH.PUNCH_TIME,
    }),
      (this.messageList.PunchType = {
        required: Constants.VALIDATION_MSG.TIME_PUNCH.PUNCH_TYPE,
      }),
      (this.messageList.Reason = {
        required: Constants.VALIDATION_MSG.TIME_PUNCH.REASON,
      });
  }
  setPunchTime(date) {
    let time = date.toLocaleTimeString().split(':');
    return time[0] + ':' + time[1];
  }
  convertDateTime(date1, date2) {
    console.log(date1, date2);
    let newDate = new Date(date1);
    return this.datepipe.transform(
      new Date(
        newDate.getFullYear(),
        newDate.getMonth(),
        newDate.getDate(),
        date2.getHours(),
        date2.getMinutes(),
        0,
        0
      ),
      'yyyy-MM-dd HH:mm'
    );
  }

  onSubmit() {
    if (
      !!this.Offer &&
      this.initalValues.PunchType == this.offerForm.controls.PunchType.value &&
      !this.noChangeTimeDetect
    ) {
      this.router.navigate(['/tabs/clock-in-out']);
      this.utilityService.showSuccessToast(
        Constants.CLOCK_IN_OUT_NO_CHANGE_DETECTED
      );
    }
    this.formService.markFormGroupTouched(this.offerForm);
    if (this.offerForm.invalid) {
      return;
    }
    if (!!this.Offer) {
      let oldPunchTime = utils.getConvertedDateTime(this.Offer.PunchTime);
      this.offerForm.controls.OldDate.setValue(oldPunchTime);
    }
    let PunchTime = new Date(
      this.offerForm.controls.PunchTime.value
    ).toLocaleString();
    this.offerForm.controls.NewDate.setValue(PunchTime);
    const saveMethod = !!this.Offer
      ? this.offerService.userEditRequest(this.offerForm.value)
      : this.offerService.userAddRequest(this.offerForm.value);
    saveMethod.then(
      (res) => {
        if (res['Success']) {
          this.router.navigate(['/tabs/clock-in-out']);
        }
        console.log('Sent');
      },
      (err) => {}
    );
  }

  onDetectChange() {
    if (!this.Offer) {
      this.noChangeDetect = true;
      return;
    }
    if (
      this.initalValues.punchType != this.offerForm.controls.PunchType.value
    ) {
      this.noChangeDetect = true;
    } else {
      this.noChangeDetect = false;
    }
  }

  onTimeChange(eve: any) {
    this.changedDate = new Date(eve.detail.value);
    if (!this.Offer) {
      this.noChangeDetect = true;
      return;
    }
    if (
      this.initalValues.PunchTimeHoursMinutes.getTime() !=
      this.changedDate.getTime()
    ) {
      this.noChangeTimeDetect = true;
    } else {
      this.noChangeTimeDetect = false;
    }
  }

  hideKey() {
    setTimeout(() => {
      this.keyboard.hide();
    }, 1000);
  }
}
