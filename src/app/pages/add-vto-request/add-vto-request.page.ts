import {
  Component,
  OnInit,
  Input,
  TemplateRef,
  ViewChild,
  EventEmitter,
  Output,
  ChangeDetectorRef,
} from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import {
  Constants,
  vtoType,
  bsConfig,
  vtoTimeList,
  Duration,
} from '../../constant/constants';
import { Role } from '../../models/role-model';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ShiftService } from '../../services/shift/shift.service';
import { FormService } from '../../services/form/form.service';
import { DatePipe } from '@angular/common';
import { UtilityService } from '../../services/utility/utility.service';
import { TermsConditionService } from '../../services/terms-condition/terms-condition.service';
import { DepartmentService } from '../../services/department/department.service';
import { Offer, VtoOffer } from '../../models/offer.model';
import { VtoService } from '../../services/vto/vto.service';
import { EventsService } from 'src/app/services/events/events.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { utils } from 'src/app/constant/utils';

@Component({
  selector: 'app-add-vto-request',
  templateUrl: './add-vto-request.page.html',
  styleUrls: ['./add-vto-request.page.scss'],
})
export class AddVtoRequestPage implements OnInit {
  isMeridian: boolean = false;
  @Input() model_type: string;
  @Input() Offer: Offer;
  @ViewChild('confirmationPopup', { static: false })
  confirmationPopup: TemplateRef<any>;
  @Output() closeRequest = new EventEmitter<boolean>();
  public offerForm: FormGroup;
  bsConfig = bsConfig;
  companyId: number;
  role: number;
  public selectedtab: any;
  roleEnum = Role;
  shiftId: number;
  shiftDetail: any;
  public messageList: any = new VtoOffer();
  departmentList = [];
  weekDayArray = [];
  // shiftList = [];
  timeList = Duration;
  confirmData: any;
  isSubmitted = false;
  removeFieldValue = false;
  action: any;
  dateToSkipValue: any;
  vtoStartTimeValue: any;
  vtoEndTimeValue: any;
  today = new Date();
  minDate = new Date(this.today).toISOString();
  maxYear = new Date('2050-12-31').toISOString();
  isSubmitting: boolean;
  shiftList: any;
  isChange: boolean = false;
  isSelectedCurrectShift = true;
  isTimeChange: boolean = false;
  constructor(
    public modal: ModalController,
    private departmentService: DepartmentService,
    private shiftService: ShiftService,
    public router: Router,
    private datepipe: DatePipe,
    private formService: FormService,
    private utilityService: UtilityService,
    private vtoService: VtoService,
    private fb: FormBuilder,
    public ref: ChangeDetectorRef,
    private events: EventsService,
    public route: ActivatedRoute,
    public keyboard: Keyboard
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
        this.Offer = JSON.parse(localStorage.getItem(Constants.VTO_DATA));
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
      // this.timeList = this.timeList.filter(
      //   (item) => item.id !== 4 && item.id !== 5
      // );

      if (this.role === this.roleEnum.user) {
        const today = new Date();

        const tomorrow = new Date(today.setDate(today.getDate() + 1));
        const tDate = utils.getConvertedDateToISO(tomorrow);
      }
      await this.getDepartmentList();
      await this.initializeOfferForm();
      await this.initializeMessages();
      this.getShiftList();
      this.ref.detectChanges();
      this.utilityService.hideLoading();
    } catch (e) {
      console.log(e);
      this.utilityService.hideLoading();
    }
  }

  enable() {
    this.offerForm.controls.vtoStartTime.enable();
    this.offerForm.controls.vtoEndTime.enable();
    this.offerForm.controls.vtoStartTime.updateValueAndValidity();
    this.offerForm.controls.vtoEndTime.updateValueAndValidity();
  }
  disable() {
    this.offerForm.controls.vtoStartTime.disable();
    this.offerForm.controls.vtoEndTime.disable();
    this.offerForm.controls.vtoStartTime.updateValueAndValidity();
    this.offerForm.controls.vtoEndTime.updateValueAndValidity();
  }
  closeModal() {
    if (this.offerForm.controls.offerId.value > 0 && this.action === 'edit') {
      this.offerForm.reset();
      this.router.navigate(['tabs/vto-request-detail']);
    } else if (this.action === 'add') {
      this.offerForm.reset();
      const navigationExtras: NavigationExtras = {
        queryParams: {
          action: 'isRequestedOffer',
        },
      };
      this.selectedtab = 'my_request';
      localStorage.setItem('selected_tab', this.selectedtab);
      this.events.publish('selected_tab', this.selectedtab);
      this.router.navigate(['/tabs/vto-requests'], navigationExtras);
    }
  }

  async initializeOfferForm() {
    this.offerForm = this.fb.group({
      offerId: new FormControl(!!this.Offer ? this.Offer.offerId : 0),
      // dateToSkip: new FormControl(
      //   !!this.Offer ? new Date(this.Offer.dateToSkip) : null,
      //   Validators.required
      // ),
      dateToSkip: new FormControl(
        !!this.Offer
          ? utils.getConvertedDate(this.Offer.dateToSkip).toLocaleString()
          : null,
        Validators.required
      ),
      companyId: new FormControl(this.companyId),
      departmentId: new FormControl(
        !!this.Offer ? this.Offer.departmentId : '',
        Validators.required
      ),
      shiftToSkip: new FormControl(!!this.Offer ? this.Offer.shiftToSkip : ''),
      vtoStartTime: new FormControl(
        !!this.Offer ? this.Offer.vtoStartTime : '',
        Validators.required
      ),
      vtoEndTime: new FormControl(
        !!this.Offer ? this.Offer.vtoEndTime : '',
        Validators.required
      ),
      vtoType: new FormControl(!!this.Offer ? this.Offer.vtoType : null),
      timeType: new FormControl(
        !!this.Offer ? this.Offer.timeType : '',
        Validators.required
      ),
      vtoCount: new FormControl(!!this.Offer ? this.Offer.vtoCount : null),
      status: new FormControl(
        !!this.Offer
          ? this.Offer.status
          : this.role === this.roleEnum.user
          ? 1
          : 4
      ),
      offerType: new FormControl(5),
      isVtoSms: new FormControl(!!this.Offer ? !!this.Offer.isVtoSms : true),
      createdBy: new FormControl(!!this.Offer ? this.Offer.createdBy : null),
      createdDate: new FormControl(
        !!this.Offer ? this.Offer.createdDate : null
      ),
    });

    if (!!this.Offer) {
      this.vtoStartTimeValue = this.Offer.vtoStartTime;
      this.vtoEndTimeValue = this.Offer.vtoEndTime;
    }

    if (!!this.Offer) {
      // this.enable();

      const skipDate = this.datepipe.transform(
        this.setnewDate(new Date(this.Offer.dateToSkip)),
        'yyyy-MM-dd'
      );
      // await this.getTimeByShiftDateTime(
      //   skipDate,
      //   this.Offer.shiftToSkip,
      //   this.Offer.timeType
      // ).then(() => {});

      // this.disable();
    }
    if (this.offerForm.controls.offerId.value > 0) {
      this.setTimes(this.Offer.vtoStartTime, this.Offer.vtoEndTime);
    }
    if (this.role === this.roleEnum.manager) {
      this.offerForm.controls.vtoCount.setValidators([
        Validators.required,
        Validators.pattern(Constants.REGEX.LIMIT_PATTERN),
      ]);
      this.offerForm.controls.shiftToSkip.setValidators([Validators.required]);
      this.offerForm.controls.shiftToSkip.updateValueAndValidity();
      this.offerForm.controls.vtoCount.updateValueAndValidity();
    } else {
      this.shiftId = Number(localStorage.getItem(Constants.SHIFTID));
      //await this.getshiftDetail(this.shiftId);
      this.offerForm.controls.shiftToSkip.setValue(this.shiftId);
      this.offerForm.controls.departmentId.setValue(
        Number(localStorage.getItem(Constants.DEPARTMENTID))
      );
    }
  }

  initializeMessages() {
    this.messageList.noOfUsers = {
      required: Constants.VALIDATION_MSG.VTO.NO_OF_USER,
      pattern: Constants.VALIDATION_MSG.VTO.NO_Of_USER_PATTERN,
    };
    this.messageList.endTime = {
      required: Constants.VALIDATION_MSG.VTO.END_TIME,
    };
    this.messageList.startTime = {
      required: Constants.VALIDATION_MSG.VTO.START_TME,
    };
    this.messageList.date = {
      required: Constants.VALIDATION_MSG.VTO.DATE,
    };
    this.messageList.departmentId = {
      required: Constants.VALIDATION_MSG.VTO.DEPARTMENT_ID,
    };
    this.messageList.shiftToSkip = {
      required: Constants.VALIDATION_MSG.VTO.SHIFT_ID,
    };
    this.messageList.timeType = {
      required: Constants.VALIDATION_MSG.OFFER.TIME_TYPE_REQUIRED,
    };
  }

  async getDepartmentList() {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }

    await this.departmentService
      .getDepartmentListByCompanyId(null, this.companyId)
      .then(
        (res) => {
          if (res['Success']) {
            this.departmentList = res['Data'];
          } else {
            this.departmentList = [];
          }
        },
        (err) => {
          this.departmentList = [];
        }
      );
  }

  control(controlName: string): AbstractControl {
    return this.offerForm.get(controlName);
  }

  value(controlName: string) {
    return this.control(controlName).value;
  }

  onSubmit() {
    // this.enable();
    this.formService.markFormGroupTouched(this.offerForm);
    if (this.offerForm.invalid) {
      return;
    }
    this.openConfirmationPopup(this.confirmationPopup, this.offerForm.value);
  }

  async save() {
    // this.enable();
    this.formService.markFormGroupTouched(this.offerForm);
    this.isSubmitted = true;
    if (this.offerForm.invalid) {
      return;
    }
    let selectedDateTime = new Date(this.offerForm.controls.dateToSkip.value);
    if (
      selectedDateTime.toDateString() == new Date().toDateString() &&
      new Date(this.offerForm.controls.vtoStartTime.value) < new Date()
    ) {
      this.utilityService.showErrorToast("You cannot add request in past time");
      return;
    }
    // if (!this.isSelectedCurrectShift) {
    //   this.utilityService.showErrorToast(Constants.NO_AVAILABLE_SHIFT);
    //   return;
    // }
    await this.confirm();
  }

  openConfirmationPopup(template: TemplateRef<any>, data: any) {
    this.confirmData = data;
  }

  async confirm() {
    try {
      const mxdate = this.datepipe.transform(
        this.setnewDate(this.offerForm.controls.dateToSkip.value),
        'yyyy-MM-dd'
      );
      this.isSubmitting = true;

      this.offerForm.controls.departmentId.setValue(
        Number(this.offerForm.controls.departmentId.value)
      );
      this.offerForm.controls.shiftToSkip.setValue(
        !!this.offerForm.controls.shiftToSkip.value
          ? Number(this.offerForm.controls.shiftToSkip.value)
          : null
      );
      this.offerForm.controls.vtoCount.setValue(
        Number(this.offerForm.controls.vtoCount.value)
      );
      this.offerForm.controls.vtoType.setValue(
        this.role === this.roleEnum.user
          ? vtoType.myRequest
          : vtoType.managerOffer
      );
      this.offerForm.controls.dateToSkip.setValue(mxdate);

      if (!navigator.onLine) {
        return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      }
      const startTimeValue = this.offerForm.controls.vtoStartTime.value;
      const endTimeValue = this.offerForm.controls.vtoEndTime.value;

      if (
        !!this.offerForm.controls.vtoStartTime.value &&
        startTimeValue instanceof Date
      ) {
        this.offerForm.controls.vtoStartTime.setValue(
          new Date(startTimeValue).getHours() +
            ':' +
            new Date(startTimeValue).getMinutes()
        );
      }
      if (
        !!this.offerForm.controls.vtoEndTime.value &&
        endTimeValue instanceof Date
      ) {
        this.offerForm.controls.vtoEndTime.setValue(
          new Date(endTimeValue).getHours() +
            ':' +
            new Date(endTimeValue).getMinutes()
        );
      }
      this.utilityService.showLoadingwithoutDuration();
      const saveMethod = !!this.offerForm.controls.offerId.value
        ? this.vtoService.updateVtoRequestOffer(this.offerForm.value)
        : this.vtoService.addVtoRequestOffer(this.offerForm.value);
      await saveMethod.then(
        (response) => {
          if (response['Success']) {
            this.isSubmitting = false;
            this.utilityService.hideLoading();
            this.closeRequest.emit(true);
            this.utilityService.showSuccessToast(
              this.offerForm.controls.offerId.value > 0
                ? Constants.VTO_REQUEST_UPDATE_SUCCESS_MSG
                : Constants.VTO_REQUEST_ADD_SUCCESS_MSG
            );
            setTimeout(() => {
              const navigationExtras: NavigationExtras = {
                queryParams: {
                  action: 'isRequestedOffer',
                },
              };
              this.selectedtab = 'my_request';
              localStorage.setItem('selected_tab', this.selectedtab);
              this.events.publish('selected_tab', this.selectedtab);
              this.router.navigate(['/tabs/vto-requests'], navigationExtras);
            }, 500);
          } else {
            this.isSubmitting = false;
            this.utilityService.hideLoading();
            this.utilityService.showErrorToast(response['Message']);
            this.modal.dismiss(true);
            // this.disable();
            this.offerForm.controls.dateToSkip.setValue(new Date(mxdate));
            this.offerForm.controls.vtoStartTime.setValue(startTimeValue);
            this.offerForm.controls.vtoEndTime.setValue(endTimeValue);
          }
        },
        (err) => {
          this.isSubmitting = false;
          this.utilityService.hideLoading();
        }
      );
    } catch (err) {
      this.isSubmitting = false;
      console.log(err);
      this.utilityService.hideLoading();
    }
  }

  setnewDate(date) {
    date = this.offerForm.controls.dateToSkip.value;
    console.log(date, '000000000');
    if (new Date(date).getTime()) {
      const dateObj = {
        year: +this.datepipe.transform(date, 'yyyy'),
        month: +this.datepipe.transform(date, 'MM'),
        day: +this.datepipe.transform(date, 'dd'),
      };
      return new Date(dateObj['year'], dateObj['month'] - 1, dateObj['day']);
    }
    return new Date(date);
  }
  // for the manager
  departmentChange(event) {
    this.offerForm.controls.shiftToSkip.setValue('');
    this.offerForm.controls.timeType.setValue('');
    this.offerForm.controls.vtoStartTime.setValue('');
    this.offerForm.controls.vtoEndTime.setValue('');
    if (!!event.currentTarget) {
      if (!!event.currentTarget.value) {
        if (this.role === this.roleEnum.manager) {
          this.getShiftByDepartment(Number(event.currentTarget.value));
        }
      }
    } else {
      if (!!event) {
        if (this.role === this.roleEnum.manager) {
          this.getShiftByDepartment(Number(event));
        }
      }
    }
  }
  getShiftByDepartment(departmentId) {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }

    if (!this.utilityService.isLoading) {
      this.utilityService.showLoadingwithoutDuration();
    }
    this.shiftService.getShiftListByDepartment(departmentId).then(
      (response) => {
        if (response['Success']) {
          this.shiftList = response['Data'];
        } else {
          this.shiftList = [];
        }
        if (this.utilityService.isLoading) {
          this.utilityService.hideLoading();
        }
      },
      (err) => {
        this.utilityService.hideLoading();
        this.shiftList = [];
      }
    );
  }

  onShiftChange(event) {
    this.isChange = true;
    if (!!event && this.offerForm.controls.shiftToSkip.touched) {
      if (
        !!event.currentTarget.value &&
        !!this.offerForm.controls.timeType.value &&
        !!this.offerForm.controls.dateToSkip.value
      ) {
        this.offerForm.controls.timeType.setValue('');
        this.offerForm.controls.vtoStartTime.setValue('');
        this.offerForm.controls.vtoEndTime.setValue('');

        const skipDate = this.datepipe.transform(
          this.setnewDate(this.offerForm.controls.dateToSkip.value),
          'yyyy-MM-dd'
        );
        this.getTimeByShiftDateTime(
          skipDate,
          event.currentTarget.value,
          this.offerForm.controls.timeType.value
        );
      }
    }
  }

  async onTimeChange(event) {
    this.isChange = true;
    if (!!event && this.offerForm.controls.timeType.touched) {
      if (
        !!event.currentTarget.value &&
        !!this.offerForm.controls.dateToSkip.value &&
        !!this.offerForm.controls.shiftToSkip.value
      ) {
        this.offerForm.controls.vtoStartTime.setValue('');
        this.offerForm.controls.vtoEndTime.setValue('');

        const skipDate = this.datepipe.transform(
          this.setnewDate(this.offerForm.controls.dateToSkip.value),
          'yyyy-MM-dd'
        );
        this.utilityService.showLoadingwithoutDuration();
        await this.getTimeByShiftDateTime(
          skipDate,
          this.offerForm.controls.shiftToSkip.value,
          event.currentTarget.value
        ).then(() => {
          this.utilityService.hideLoading();
        });
      }
    }
  }

  async getTimeByShiftDateTime(date, shift, time) {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    await this.shiftService
      .getTimeByShiftDateTime(date, Number(shift), Number(time))
      .then(
        (response) => {
          if (response['Success']) {
            // this.setTimes(response['Data'].startTime, response['Data'].endTime);
            if (time == 4) {
              if (this.offerForm.controls.offerId.value == 0 || this.isChange) {
                this.defaultCurrentTime();
              } else {
                this.setTimes(this.Offer.vtoStartTime, this.Offer.vtoEndTime);
              }
            } else {
              if (this.offerForm.controls.offerId.value == 0 || this.isChange) {
              
                this.setTimes(
                  response['Data'].startTime,
                  response['Data'].endTime
                );
              if (!this.isSelectedCurrectShift){
                  this.defaultCurrentTime();
                  this.isSelectedCurrectShift = true;
                }
              } else {
                this.setTimes(this.Offer.vtoStartTime, this.Offer.vtoEndTime);
              }
            }
          } else {
            this.offerForm.controls.vtoStartTime.setValue('');
            this.offerForm.controls.vtoEndTime.setValue('');
          }
        },
        (err) => {}
      );
  }

  async skipDateChange(event) {
    this.isChange = true;
    this.isTimeChange = true;
    let currentWeekDay = new Date().getDay() + 1;
    console.log(currentWeekDay);
    this.isSelectedCurrectShift = true;
    if (this.isSelectedCurrectShift) {
      if (
        !!event.target.value &&
        !event.srcElement.classList.contains('ng-untouched')
      ) {
        // this.isSelectedCurrectShift = false;

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
              const startTimeValue = this.offerForm.controls.vtoStartTime.value;
              const endTimeValue = this.offerForm.controls.vtoEndTime.value;
              if (
                !!this.offerForm.controls.vtoStartTime.value &&
                startTimeValue instanceof Date
              ) {
                this.offerForm.controls.vtoStartTime.setValue(
                  new Date(startTimeValue).getHours() +
                    ':' +
                    new Date(startTimeValue).getMinutes()
                );
              }
              if (
                !!this.offerForm.controls.vtoEndTime.value &&
                endTimeValue instanceof Date
              ) {
                this.offerForm.controls.vtoEndTime.setValue(
                  new Date(endTimeValue).getHours() +
                    ':' +
                    new Date(endTimeValue).getMinutes()
                );
              }
              if (
                startTimeValue instanceof Date ||
                endTimeValue instanceof Date
              ) {
                this.setTimes(this.offerForm.controls.vtoStartTime.value, this.offerForm.controls.vtoEndTime.value);
              } else {
                if (this.offerForm.controls.timeType.value == 1) {
                  this.setTimes(shiftWeek.startTime, shiftWeek.endTime);
                }
                if (this.offerForm.controls.timeType.value == 2) {
                  this.setTimes(
                    shiftWeek.startTime,
                    shiftWeek.firstHalfEndTime
                  );
                }
                if (this.offerForm.controls.timeType.value == 3) {
                  this.setTimes(
                    shiftWeek.secondHalfStartTime,
                    shiftWeek.endTime
                  );
                }
                if (this.offerForm.controls.timeType.value == 4) {
                  this.defaultCurrentTime();
                }
              }
              this.isSelectedCurrectShift = true;
              break;
            }
          }
        }
        if (!this.isSelectedCurrectShift) {
          if (
            this.offerForm.controls.vtoStartTime.value instanceof Date ||
            this.offerForm.controls.vtoStartTime.value instanceof Date
          ) {
            this.setTimes(this.offerForm.controls.vtoStartTime.value, this.offerForm.controls.vtoEndTime.value);
          }
          else{
          this.defaultCurrentTime();
        }

          // this.utilityService.showErrorToast(Constants.NO_AVAILABLE_SHIFT);
        }
      }
    }

    if (
      !!event &&
      new Date(event.currentTarget.value).getTime() &&
      this.offerForm.controls.dateToSkip.touched &&
      !this.isSubmitting
    ) {
      if (
        !!this.offerForm.controls.shiftToSkip.value &&
        !!this.offerForm.controls.timeType.value
      ) {
        const skipDate = this.datepipe.transform(
          this.setnewDate(event.currentTarget.value),
          'yyyy-MM-dd'
        );
        this.offerForm.controls.vtoStartTime.setValue('');
        this.offerForm.controls.vtoEndTime.setValue('');

        this.utilityService.showLoadingwithoutDuration();
        if (
          !!this.offerForm.controls.shiftToSkip.value &&
          !!this.offerForm.controls.timeType.value
        ) {
          await this.getTimeByShiftDateTime(
            skipDate,
            this.offerForm.controls.shiftToSkip.value,
            this.offerForm.controls.timeType.value
          ).then(() => {
            this.utilityService.hideLoading();
          });
        }
      }
    }
  }
  // skipDateChange(event) {
  //   if (!!event && event.getTime()) {
  //     const skipDate = this.datepipe.transform(this.setnewDate(event), 'yyyy-MM-dd');
  //     this.offerForm.controls.vtoStartTime.setValue(null);
  //     this.offerForm.controls.vtoEndTime.setValue(null);
  //     if (!!this.offerForm.controls.shiftToSkip.value &&
  //       !!this.offerForm.controls.timeType.value) {
  //       this.getTimeByShiftDateTime(skipDate, this.offerForm.controls.shiftToSkip.value, this.offerForm.controls.timeType.value);
  //     }
  //   }
  // }

  getName(data, type) {
    if (type === 'shift') {
      return this.shiftList.find((x) => x.shiftId === Number(data.shiftToSkip))
        .title;
    }
    if (type === 'time') {
      return this.timeList.find((x) => x.id === Number(data.timeType)).value;
    }
    if (type === 'department') {
      return this.departmentList.find(
        (x) => x.departmentId === Number(data.departmentId)
      ).departmentName;
    }
  }
  hideKey() {
    setTimeout(() => {
      this.keyboard.hide();
    }, 1000);
  }

  setTimes(startTime, endTime) {
    if (!!startTime) {
      const startdate = new Date();
      startdate.setHours(
        Number(startTime.split(':')[0]),
        Number(startTime.split(':')[1])
      );
      this.offerForm.controls.vtoStartTime.setValue(startdate);
    } else {
      this.utilityService.showSuccessToast(
        Constants.SHIFT_START_TIME_CONFIGURE
      );
      this.offerForm.controls.vtoStartTime.setValue('');
    }
    if (!!endTime) {
      const enddate = new Date();
      enddate.setHours(
        Number(endTime.split(':')[0]),
        Number(endTime.split(':')[1])
      );
      this.offerForm.controls.vtoEndTime.setValue(enddate);
    } else {
      if (!this.timeList[3].id) {
        this.utilityService.showErrorToast(Constants.SHIFT_END_TIME_CONFIGURE);
      }
      this.offerForm.controls.vtoEndTime.setValue('');
    }
  }
  async getShiftList() {
    let that = this;

    await this.shiftService
      .getShiftListByUserId(Number(localStorage.getItem(Constants.SHIFTID)))
      .then(
        (response) => {
          if (response['Success']) {
            that.shiftList = response['Data'];
          }
        },
        (err) => {
          that.shiftList = [];
        }
      );
  }

  defaultCurrentTime() {
    var current = new Date();
    var startShiftTime = current.toLocaleTimeString().split(':');
    var startHours =
      startShiftTime[0] + ':' + startShiftTime[1] + ':' + startShiftTime[2];
    this.offerForm.controls.vtoStartTime.setValue(startHours);
    this.offerForm.controls.vtoEndTime.setValue(null);
    let startTime = startHours;
    let endTime = null;
    this.setTimes(startTime, endTime);
  }
}
