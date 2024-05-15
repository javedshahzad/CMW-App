import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import {
  FormBuilder,
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Offer } from '../../models/offer.model';
import { Constants, typeField, bsConfig } from '../../constant/constants';
import { Role } from '../../models/role-model';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ShiftService } from '../../services/shift/shift.service';
import { FormService } from '../../services/form/form.service';
import { DatePipe } from '@angular/common';
import { UtilityService } from '../../services/utility/utility.service';
import { TermsConditionService } from '../../services/terms-condition/terms-condition.service';
import { DepartmentService } from '../../services/department/department.service';
import { AddRequestSwapService } from '../../services/add-request-swap/add-request-swap.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as moment from 'moment';
import { EventsService } from 'src/app/services/events/events.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { utils } from 'src/app/constant/utils';

@Component({
  selector: 'app-add-request-swap',
  templateUrl: './add-request-swap.page.html',
  styleUrls: ['./add-request-swap.page.scss'],
})
export class AddRequestSwapPage implements OnInit {
  public selectedtab: any;

  bsConfig = bsConfig;

  @Input() model_type: string;
  @Input() offer: Offer;
  @Output() close = new EventEmitter<boolean>();
  public messageList: any = new Offer();
  public offerForm: FormGroup;
  isSubmitted = false;
  companyId: number;
  shiftId: number;
  departmentId: number;
  public roleEnum = Role;
  role: number;
  shiftList = [];
  shiftDetail: any;
  departmentList = [];
  disableDaysForDateToSkip = [];
  disableDaysForDateToWork = [];
  weekDayArray = [];
  isShowShift = false;
  managerWorkShiftList = [];
  removeFieldValue = false;
  removeWorkValue = false;
  today = new Date();
  tomorrow = new Date(this.today);
  nextMinDate = new Date(
    this.tomorrow.setDate(this.tomorrow.getDate() + 1)
  ).toISOString();
  Editor = ClassicEditor;
  minDate: Date;
  maxDate: Date;
  termsCondition = [];
  termsMsg = '';
  public minSelectabledate: any;
  common: any;
  action: any;
  dateToSkipValue: any;
  dateToWorkValue: any;
  dateToWorkDate = new Date().toISOString();
  // minDate = new Date().toISOString();
  maxYear = new Date('2050-12-31').toISOString();
  constructor(
    public ref: ChangeDetectorRef,
    public modal: ModalController,
    private departmentService: DepartmentService,
    private termsConditionService: TermsConditionService,
    private shiftService: ShiftService,
    public router: Router,
    private datepipe: DatePipe,
    private formService: FormService,
    private utilityService: UtilityService,
    private fb: FormBuilder,
    public route: ActivatedRoute,
    private addRequestSwapService: AddRequestSwapService,
    private events: EventsService,
    public keyboard: Keyboard
  ) {
    this.Editor.defaultConfig = {
      toolbar: {
        items: [],
      },
    };
    this.route.queryParams.subscribe((params) => {
      this.action = params.action;
    });
  }

  ngOnInit() {}

  async ionViewWillEnter() {
    try {
      if(this.offerForm){
        this.offerForm.reset();
      }
      this.shiftList = [];
      this.weekDayArray = [];
      this.disableDaysForDateToSkip = [];
      this.disableDaysForDateToWork = [];
      this.isShowShift = false;

      this.utilityService.showLoadingwithoutDuration();
      if (this.action === 'edit') {
        this.offer = JSON.parse(localStorage.getItem(Constants.SWAP_DATA));
      } else {
        this.offer = null;
      }
      this.removeFieldValue =
        !!this.offer && this.offer.offerId > 0 ? true : false;
      this.removeWorkValue =
        !!this.offer && this.offer.offerId > 0 ? true : false;
      this.role = Number(localStorage.getItem(Constants.ROLE));
      this.companyId = !!this.offer
        ? this.offer.companyId
        : Number(localStorage.getItem(Constants.COMPANYID));

      await this.initializeOfferForm();
     
      await this.initializeMessages();
      await this.getTermsCondition();
      await this.getDepartmentList();
      this.ref.detectChanges();
      this.utilityService.hideLoading();
    } catch (e) {
      console.log(e);
      this.utilityService.hideLoading();
    }
  }

  async initializeOfferForm() {
    this.offerForm = this.fb.group({
      offerId: new FormControl(!!this.offer ? this.offer.offerId : 0),
      dateToSkip: new FormControl(
        !!this.offer
          ? utils.getConvertedDate(this.offer.dateToSkip).toLocaleString()
          : null,
        Validators.required
      ),
      dateToWork: new FormControl(
        !!this.offer
          ? utils.getConvertedDate(this.offer.dateToWork).toLocaleString()
          : null,
        Validators.required
      ),
      status: new FormControl(!!this.offer ? this.offer.status : 0),
      shiftToSkip: new FormControl(
        !!this.offer ? this.offer.shiftToSkip : '',
        Validators.required
      ),
      shiftToWork: new FormControl(
        !!this.offer ? this.offer.shiftToWork : '',
        Validators.required
      ),
      companyId: new FormControl(this.companyId),
      departmentId: new FormControl(
        !!this.offer ? this.offer.departmentId : '',
        Validators.required
      ),
      termsMsg: new FormControl(''),
      createdBy: new FormControl(!!this.offer ? this.offer.createdBy : null),
      createdDate: new FormControl(
        !!this.offer ? this.offer.createdDate : null
      ),
      offerType: new FormControl(1),
    });
    if (this.offer == null) {
      await this.getShiftList();
    }
    if (!!this.offer) {
      this.dateToSkipValue = utils
        .getConvertedDate(this.offer.dateToSkip)
        .toLocaleString();
      this.dateToWorkValue = utils
        .getConvertedDate(this.offer.dateToWork)
        .toLocaleString();
    }
    this.shiftId = !!this.offer
      ? this.offer.shiftToSkip
      : Number(localStorage.getItem(Constants.SHIFTID));
    if (this.role === this.roleEnum.user) {
      this.departmentId = !!this.offer
        ? this.offer.departmentId
        : Number(localStorage.getItem(Constants.DEPARTMENTID));
      this.offerForm.controls.shiftToSkip.setValue(this.shiftId);

      this.offerForm.controls.departmentId.setValue(this.departmentId);
      await this.getshiftDetail().then(() => {});
    }
    if (this.role === this.roleEnum.manager) {
      this.shiftList = [];
      if (!!this.offer && !!this.offer.departmentId) {
        await this.onDepartmentChange(this.offer.departmentId);
      }
    }
  }

  formatDate(date) {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  initializeMessages() {
    this.messageList.dateToSkip = {
      required: Constants.VALIDATION_MSG.OFFER.SKIP_DATE_REQUIRED,
    };
    this.messageList.dateToWork = {
      required: Constants.VALIDATION_MSG.OFFER.WORK_ON_DATE_REQUIRED,
    };
    this.messageList.shiftToSkip = {
      required: Constants.VALIDATION_MSG.OFFER.SKIP_SHIFT_REQUIRED,
    };
    this.messageList.shiftToWork = {
      required:
        this.role === this.roleEnum.hrAdmin
          ? Constants.VALIDATION_MSG.OFFER.WORK_SHIFT_REQUIRED
          : Constants.VALIDATION_MSG.OFFER.WORK_OFFER_SHIFT_REQUIRED,
    };
    this.messageList.departmentId = {
      required: Constants.VALIDATION_MSG.OFFER.DEPARTMENT_REQUIRED,
    };
  }

  getshiftDetail() {
    return new Promise(async (resolve, reject) => {
      if (!navigator.onLine) {
        return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      }

      await this.shiftService.getShiftDetails(this.shiftId).then(
        async (res) => {
          if (res['Success']) {
            this.shiftDetail = res['Data'].shiftWeekDay;
            this.shiftDetail.map((x) => {
              if (x.weekday > 0) {
                this.weekDayArray.push(x.weekday - 1);
              }
            });
            for (let i = 0; i < 7; i++) {
              if (this.weekDayArray.indexOf(i) === -1) {
                this.disableDaysForDateToSkip.push(i);
              } else {
                this.disableDaysForDateToWork.push(i);
              }
            }
            await this.skipDateChange(this.offerForm.controls.dateToSkip.value);
            resolve(this.shiftDetail);
          }
        },
        (err) => {}
      );
    });
  }

  async getTermsCondition() {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    await this.termsConditionService
      .getTermsConditionListByCompanyId(this.companyId, null)
      .then(
        (res) => {
          if (res['Success']) {
            this.termsCondition = res['Data'];
            if (this.role === this.roleEnum.user) {
              this.getTermsMsg(1);
            } else if (this.role === this.roleEnum.manager) {
              this.getTermsMsg(2);
            }
          } else {
            this.termsCondition = [];
          }
        },
        (err) => {
          this.termsCondition = [];
        }
      );
  }

  getTermsMsg(index) {
    const findTerms = this.termsCondition.find(
      (x) => x.typeField === typeField[index].id
    );
    if (!!findTerms) {
      this.termsMsg = findTerms.description;
      this.offerForm.controls.termsMsg.setValue(this.termsMsg);
    }
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

  async getShiftList() {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    await this.shiftService.getShiftListByCompanyId(null, this.companyId).then(
      async (res) => {
        if (res['Success']) {
          this.shiftList = res['Data'];
          this.isShowShift = res['Data'].length > 2;
          if (this.isShowShift === false) {
            this.offerForm.controls.shiftToWork.setValidators(null);
            this.offerForm.controls.shiftToWork.updateValueAndValidity();
          }
          if (this.isShowShift && !!this.offer && this.role === this.roleEnum.user) {
            this.workDateChange(this.offerForm.controls.dateToWork.value);
          }
        } else {
          this.shiftList = [];
        }
      },
      (err) => {
        this.shiftList = [];
      }
    );
  }

  async onSubmit() {
    try {
      this.formService.markFormGroupTouched(this.offerForm);
      if (this.offerForm.invalid) {
        return;
      }
      this.isSubmitted = true;
      if (this.role === this.roleEnum.user) {
        if (
          this.disableDaysForDateToSkip.includes(
            new Date(this.offerForm.controls.dateToSkip.value).getDay()
          )
        ) {
          return this.utilityService.showErrorToast(
            Constants.NO_AVAILABLE_SHIFT
          );
        }

        if (
          this.disableDaysForDateToWork.includes(
            new Date(this.offerForm.controls.dateToWork.value).getDay()
          )
        ) {
          return this.utilityService.showErrorToast(
            Constants.USER_WORKING_ON_SKIP_Date
          );
        }

        // let dateToWorkDate = this.datepipe.transform(new Date(this.offerForm.controls.dateToWork.value), 'yyyy-MM-dd');
        // let dateToskipDate = this.datepipe.transform(new Date(this.offerForm.controls.dateToSkip.value), 'yyyy-MM-dd');
        // if (dateToWorkDate === dateToskipDate && this.offer.offerId > 0) {
        //   return this.utilityService.showErrorToast(Constants.VALIDATION_MSG.OFFER.DATE_MSG2);
        // }
      }
      if (this.offerForm.invalid) {
        return;
      }
      const mndate = this.datepipe.transform(
        this.setnewDate(this.offerForm.controls.dateToSkip.value),
        'yyyy-MM-dd'
      );
      const mxdate = this.datepipe.transform(
        this.setnewDate(this.offerForm.controls.dateToWork.value),
        'yyyy-MM-dd'
      );

      if (this.role === this.roleEnum.manager) {
        // if (this.offerForm.controls.dateToWork.value.getTime() === this.offerForm.controls.dateToSkip.value.getTime()) {
        //   this.toaster.error(Constants.VALIDATION_MSG.OFFER.DATE_MSG);
        //   return;
        // }
        if (mndate === mxdate) {
          this.utilityService.showSuccessToast(
            Constants.VALIDATION_MSG.OFFER.DATE_MSG
          );
          return;
        }
      }
      delete this.offerForm.controls.termsMsg;
      this.removeFieldValue = true;
      this.removeWorkValue = true;

      // this.offerForm.controls.dateToWork.setValue(mxdate);
      // this.offerForm.controls.dateToSkip.setValue(mndate);
      this.offerForm.controls.departmentId.setValue(
        Number(this.offerForm.controls.departmentId.value)
      );
      this.offerForm.controls.shiftToSkip.setValue(
        Number(this.offerForm.controls.shiftToSkip.value)
      );
      if (this.role === this.roleEnum.user) {
        const shift = this.shiftList.filter(
          (x) => x.shiftId !== Number(localStorage.getItem(Constants.SHIFTID))
        );
        if(!!shift && shift.length > 0){
        this.isShowShift
          ? this.offerForm.controls.shiftToWork.setValue(
              Number(this.offerForm.controls.shiftToWork.value)
            )
          : this.offerForm.controls.shiftToWork.setValue(
              shift.length > 0 ? shift[0].shiftId : null
            );
        }
      } else {
        this.offerForm.controls.shiftToWork.setValue(
          Number(this.offerForm.controls.shiftToWork.value)
        );
      }

      if(this.offerForm.controls.shiftToWork.value === null ||
        this.offerForm.controls.shiftToWork.value === undefined ||
        this.offerForm.controls.shiftToWork.value === ''){
          return this.utilityService.showErrorToast(
            Constants.VALID_WORK_ON_DATE
          );
      }
      let obj: any = Object.assign({}, this.offerForm.value);
      obj.dateToSkip = mndate;
      obj.dateToWork = mxdate;

      if (!navigator.onLine) {
        return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      }
      this.utilityService.showLoadingwithoutDuration();
      const saveMethod =
        this.offerForm.controls.offerId.value > 0
          ? this.addRequestSwapService.updateOffer(obj)
          : this.addRequestSwapService.addOffer(obj);

      await saveMethod.then(
        (res) => {
          if (res['Success']) {
            this.utilityService.hideLoading();
            this.utilityService.showSuccessToast(
              this.offerForm.controls.offerId.value > 0
                ? Constants.OFFER_UPDATE_SUCCESS_MSG
                : Constants.OFFER_ADD_SUCCESS_MSG
            );
            let navigationExtras: NavigationExtras = {
              queryParams: {
                action: 'isRequestedOffer',
              },
            };
            this.selectedtab = 'my_request';
            localStorage.setItem('selected_tab', this.selectedtab);
            this.events.publish('selected_tab', this.selectedtab);
            this.router.navigate(['/tabs/swap-requests'], navigationExtras);
          } else {
            this.utilityService.hideLoading();
            this.utilityService.showErrorToast(res['Message']);
            this.removeFieldValue = true;
            this.removeWorkValue = true;
          }
        },
        (err) => {
          this.utilityService.hideLoading();
        }
      );
    } catch (err) {
      this.utilityService.hideLoading();
      console.log(err);
    }
  }

  control(controlName: string): AbstractControl {
    return this.offerForm.get(controlName);
  }

  value(controlName: string) {
    return this.control(controlName).value;
  }

  async skipDateChange(event) {
    if (!!event &&
      this.offerForm.controls.dateToSkip.touched) {
      this.minDate = moment(event).startOf('week').toDate();
      this.maxDate = moment(event).endOf('week').toDate();
      if (!!this.shiftDetail && this.role === this.roleEnum.user) {
        this.disableDaysForDateToWork = [];
        if (this.role === this.roleEnum.user) {
          for (let k = 0; k < 7; k++) {
            if (this.disableDaysForDateToSkip.indexOf(k) < 0) {
              this.disableDaysForDateToWork.push(k);
            }
          }
        }
      }
      for (let j = 0; j < moment(event).day(); j++) {
        if (
          moment(this.minDate).add(j, 'days').toDate() <=
          new Date(this.nextMinDate)
        ) {
          if (this.disableDaysForDateToWork.indexOf(j) < 0) {
            this.disableDaysForDateToWork.push(j);
          }
        }
      }

      // if (!!this.offerForm.controls.dateToSkip.value) {
      //   // console.log("workdatechange", this.offerForm.controls.dateToSkip.value)
      //   if (this.disableDaysForDateToWork.includes(new Date(event.detail.value).getDay())) {
      //     // return this.utilityService.showErrorToast(Constants.NO_AVAILABLE_SHIFT);
      //     // console.log("date to work valid")
      //   }
      //   else {
      //     // console.log("date to work invalid")
      //     return this.utilityService.showErrorToast(Constants.NO_AVAILABLE_SHIFT);
      //     // this.offerForm.controls.dateToSkip.value=null;
      //   }
      // }

      if (
        new Date(this.offerForm.controls.dateToWork.value) >= this.minDate &&
        new Date(this.offerForm.controls.dateToWork.value) <= this.maxDate
      ) {
        this.offerForm.controls.dateToWork.setErrors(null);
      } else {
        this.offerForm.controls.dateToWork.setValue('');
        this.offerForm.controls.dateToWork.setErrors({ required: true });
      }
      if (
        this.role === this.roleEnum.manager &&
        !!this.offerForm.controls.dateToSkip.value &&
        !!this.offerForm.controls.departmentId.value
      ) {
        this.shiftList = [];
        this.offer.offerId > 0
          ? null
          : this.offerForm.controls.shiftToSkip.setValue('');
        !this.removeFieldValue
          ? this.offerForm.controls.shiftToSkip.setValue('')
          : (this.removeFieldValue = false);
        const skipDate = this.datepipe.transform(
          this.setnewDate(event.target.value),
          'yyyy-MM-dd'
        );
        await this.skipShiftByManager(
          skipDate,
          Number(this.offerForm.controls.departmentId.value)
        );
      }
    }
    // let dateToWorkDate = this.datepipe.transform(new Date(this.offerForm.controls.dateToWork.value), 'yyyy-MM-dd');
    // let dateToskipDate = this.datepipe.transform(new Date(this.offerForm.controls.dateToSkip.value), 'yyyy-MM-dd');
    // if (dateToWorkDate === dateToskipDate && this.offerForm.controls.offerId.value > 0) {
    //   return this.utilityService.showErrorToast(Constants.VALIDATION_MSG.OFFER.DATE_MSG2);
    // }
  }
  hideKey() {
    setTimeout(() => {
      this.keyboard.hide();
    }, 500);
  }

  setnewDate(date) {
    const dateObj = {
      year: +this.datepipe.transform(date, 'yyyy'),
      month: +this.datepipe.transform(date, 'MM'),
      day: +this.datepipe.transform(date, 'dd'),
    };
    return new Date(dateObj['year'], dateObj['month'] - 1, dateObj['day']);
  }
  async workDateChange(event) {
    if (!!event && this.offerForm.controls.dateToWork.touched) {
      //this.utilityService.showLoading();
      const workDate = this.datepipe.transform(
        this.setnewDate(this.offerForm.controls.dateToWork.value),
        'yyyy-MM-dd'
      );
      const skipDate = this.datepipe.transform(
        this.setnewDate(this.offerForm.controls.dateToSkip.value),
        'yyyy-MM-dd'
      );
      if (this.role === this.roleEnum.user) {
        this.departmentId = !!this.offer
          ? this.offer.departmentId
          : Number(localStorage.getItem(Constants.DEPARTMENTID));
        this.shiftList = [];
        if (!this.offerForm.controls.dateToWork.value) {
          if (
            this.disableDaysForDateToWork.includes(
              new Date(this.offerForm.controls.dateToWork.value).getDay()
            )
          ) {
            return this.utilityService.showErrorToast(
              Constants.NO_AVAILABLE_SHIFT
            );
          } else {
          }
        }
        if (
          skipDate === workDate &&
          this.offerForm.controls.offerId.value > 0
        ) {
          return this.utilityService.showErrorToast(
            Constants.VALIDATION_MSG.OFFER.DATE_MSG
          );
        }
        // this.offerForm.controls.offerId.value > 0
        //   ? null
        //   : this.offerForm.controls.shiftToSkip.setValue('');
        !this.removeWorkValue
          ? this.offerForm.controls.shiftToWork.setValue('')
          : (this.removeWorkValue = false);
        await this.shiftFilterByDateAndDepartment(
          skipDate,
          workDate,
          this.departmentId
        );
      } else if (
        this.role === this.roleEnum.manager &&
        !!this.offerForm.controls.departmentId.value
      ) {
        this.managerWorkShiftList = [];
        this.offer.offerId > 0
          ? null
          : this.offerForm.controls.shiftToSkip.setValue('');
        await this.shiftFilterByDateAndDepartment(
          skipDate,
          workDate,
          Number(this.offerForm.controls.departmentId.value)
        );
      }
    }
  }

  async shiftFilterByDateAndDepartment(skipDate, workDate, departmentId) {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }

    await this.shiftService
      .getShiftListByWorkDate(skipDate, workDate, departmentId)
      .then(
        (res) => {
          if (res['Success']) {
            this.role == this.roleEnum.manager
              ? (this.managerWorkShiftList = res['Data'])
              : (this.shiftList = res['Data']);
          } else {
            this.shiftList = [];
            this.managerWorkShiftList = [];
            this.offerForm.controls.shiftToWork.setValidators(null);
          }

          this.isShowShift = this.shiftList.length > 1;
          if (this.isShowShift === false) {
            this.offerForm.controls.shiftToWork.setValidators(null);
          }
          else{
            this.offerForm.controls.shiftToWork.setValue(this.shiftList[0].shiftId);
          }
          this.offerForm.controls.shiftToWork.updateValueAndValidity();
        },
        (err) => {
          this.shiftList = [];
          this.managerWorkShiftList = [];
        }
      );
  }

  async onDepartmentChange(event) {
    if (!!event.currentTarget) {
      if (!!event.currentTarget.value) {
        //this.utilityService.showLoading();
        this.shiftList = [];
        this.managerWorkShiftList = [];
        this.offerForm.controls.shiftToSkip.setValue('');
        this.offerForm.controls.shiftToWork.setValue('');
        if (
          !!this.offerForm.controls.dateToWork.value &&
          !!this.offerForm.controls.dateToSkip.value
        ) {
          const workDate = this.datepipe.transform(
            this.setnewDate(this.offerForm.controls.dateToWork.value),
            'yyyy-MM-dd'
          );
          const skipDate = this.datepipe.transform(
            this.setnewDate(this.offerForm.controls.dateToSkip.value),
            'yyyy-MM-dd'
          );
          await this.shiftFilterByDateAndDepartment(
            skipDate,
            workDate,
            Number(event.currentTarget.value)
          );
          await this.skipShiftByManager(
            skipDate,
            Number(event.currentTarget.value)
          );
        }
        //this.utilityService.hideLoading();
      } else {
        this.shiftList = [];
        this.managerWorkShiftList = [];
        this.offerForm.controls.shiftToSkip.setValue('');
        this.offerForm.controls.shiftToWork.setValue('');
      }
    } else {
      if (!!event) {
        this.shiftList = [];
        this.managerWorkShiftList = [];
        if (
          !!this.offer &&
          !!this.offer.dateToSkip &&
          !!this.offer.dateToWork &&
          !!this.offer.departmentId
        ) {
          //this.utilityService.showLoading();
          const workDate = this.datepipe.transform(
            this.setnewDate(new Date(this.offer.dateToWork)),
            'yyyy-MM-dd'
          );
          const skipDate = this.datepipe.transform(
            this.setnewDate(new Date(this.offer.dateToSkip)),
            'yyyy-MM-dd'
          );

          await this.shiftFilterByDateAndDepartment(
            skipDate,
            workDate,
            Number(event)
          );
          await this.skipShiftByManager(skipDate, Number(event));
          //this.utilityService.hideLoading();
        }
      } else {
        this.shiftList = [];
        this.managerWorkShiftList = [];
        this.offerForm.controls.shiftToSkip.setValue('');
        this.offerForm.controls.shiftToWork.setValue('');
      }
    }
  }

  async skipShiftByManager(skipDate, departmentId) {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    await this.shiftService.getShiftListBySkipDate(skipDate, departmentId).then(
      (res) => {
        if (res['Success']) {
          this.shiftList = res['Data'];
        } else {
          this.shiftList = [];
        }
      },
      (err) => {
        this.shiftList = [];
      }
    );
  }

  closeModal() {
    if (this.offerForm.controls.offerId.value > 0 && this.action == 'edit') {
      //this.modal.dismiss();
      this.router.navigate(['tabs/swap-request-detail']);
    } else if (this.action == 'add') {
      let navigationExtras: NavigationExtras = {
        queryParams: {
          action: 'isRequestedOffer',
        },
      };
      this.selectedtab = 'my_request';
      localStorage.setItem('selected_tab', this.selectedtab);
      this.events.publish('selected_tab', this.selectedtab);
      this.router.navigate(['/tabs/swap-requests'], navigationExtras);
    }
  }
}
