import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  AbstractControl,
  FormBuilder,
  Validators,
} from '@angular/forms';
import { Role } from 'src/app/models/role-model';
import { ModalController, Platform } from '@ionic/angular';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import {
  Constants,
  timeList,
  typeField,
  bsConfig,
  SubscriptionType,
} from '../../constant/constants';
import { Router, NavigationExtras, ActivatedRoute } from '@angular/router';
import { ShiftService } from '../../services/shift/shift.service';
import { FormService } from '../../services/form/form.service';
import { DatePipe } from '@angular/common';
import { UtilityService } from '../../services/utility/utility.service';
import { TermsConditionService } from '../../services/terms-condition/terms-condition.service';
import { DepartmentService } from '../../services/department/department.service';
import { Offer } from '../../models/offer.model';
import { OfferService } from '../../services/offer/offer.service';
import { VotService } from '../../services/vot/vot.service';
import { CallInRequestService } from '../../services/call-in-request/call-in-request.service';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { utils } from 'src/app/constant/utils';

@Component({
  selector: 'app-add-vot-request',
  templateUrl: './add-vot-request.page.html',
  styleUrls: ['./add-vot-request.page.scss'],
})
export class AddVotRequestPage implements OnInit {
  @Input() offer: Offer;
  @Output() closeRequest = new EventEmitter<boolean>();
  isSubmitted: boolean = false;

  public getWorkingShiftDetails: any = {};
  public workDate: any;
  public HourLate: any = {};
  public HourEarly: any = {};
  public settingList: any = [];
  public moduleId: any;
  public isCheckboxDisabled: boolean = true;
  public isShiftDetailVot: boolean = false;
  public isDisabledTimeDrp: boolean = false;
  public messageList: any = new Offer();
  public offerForm: FormGroup;
  today = new Date();
  tomorrow = new Date(this.today);
  nextMinDate = new Date(this.tomorrow.setDate(this.tomorrow.getDate() + 1));
  currentDate: Date;
  public roleEnum = Role;
  role: number;
  disclaimerMsg = Constants.MANAGER_OFFER_DISCLAIMER;
  disclaimer = Constants.DISCLAIMER;
  hrOfferText = Constants.HR_TERMS_AND_CONDITION_OFFER_TEXT;
  departmentList = [];
  shiftList = [];
  companyId: number;
  shiftId: number;
  departmentId: number;
  shiftDetail: any;
  removeFieldValue = false;
  disableDaysForDateToSkip = [];
  disableDaysForDateToWork = [];
  termsCondition = [];
  termsMsg: string = '';
  Editor = ClassicEditor;
  bsConfig = bsConfig;
  weekDayArray = [];
  timeList = timeList;
  IsCoverMyWork: boolean = false;
  public isskipDate: boolean = false;
  action: any;
  subscriptionType = SubscriptionType;
  minDate = new Date().toISOString();
  maxYear = new Date('2050-12-31').toISOString();
  departOptions: any = {
    header: 'Please select the department you want to work',
  };
  shiftOptions: any = {
    header: 'Please select the Date you want to work on first',
  };
  timeOptions: any = {
    header: 'Please select Time',
  };
  // pickerOption: { buttons: { text: string; handler: (x: any) => void; }[]; };
  constructor(
    public modal: ModalController,
    private offerService: OfferService,
    private callInRequstService: CallInRequestService,
    private votService: VotService,
    private departmentService: DepartmentService,
    private termsConditionService: TermsConditionService,
    private shiftService: ShiftService,
    public router: Router,
    private datepipe: DatePipe,
    private formService: FormService,
    private utilityService: UtilityService,
    private fb: FormBuilder,
    public route: ActivatedRoute,
    public ref: ChangeDetectorRef,
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
      if (this.offerForm) {
        this.offerForm.reset();
      }
      this.workDate = null;
      this.utilityService.showLoadingwithoutDuration();

      if (this.action == 'edit') {
        this.offer = JSON.parse(localStorage.getItem(Constants.VOT_DATA));
      } else {
        // this.okfferForm = new FormGroup();
        this.offer = null;
      }

      this.IsCoverMyWork =
        localStorage.getItem(Constants.APP_NAME) === 'CoverMyWork'
          ? true
          : false;
      this.timeList.splice(3, 2);

      this.removeFieldValue =
        !!this.offer && this.offer.offerId > 0 ? true : false;
      this.role = Number(localStorage.getItem(Constants.ROLE));
      this.companyId = !!this.offer
        ? this.offer.companyId
        : Number(localStorage.getItem(Constants.COMPANYID));

      const today = new Date();

      const tomorrow = new Date(today.setDate(today.getDate()));
      const tDate = utils.getConvertedDateToISO(tomorrow);
      this.minDate = tDate;

      await this.getTermsCondition();
      await this.getDepartmentList();
      await this.getShiftListByDateAndDepartmentID();
      await this.initializeOfferForm();
      await this.initializeMessages();
      await this.getSettingByCompanyID();
      this.offerForm.controls.departmentId.enable();
      this.offerForm.controls.shiftToWork.enable();
      this.offerForm.controls.timeType.enable();
      this.ref.detectChanges();
      this.utilityService.hideLoading();
    } catch (e) {
      console.log(e);
      this.utilityService.hideLoading();
    }
  }

  closeModal() {
    if (this.action == 'edit') {
      this.router.navigate(['tabs/vot-request-detail']);
    } else if (this.action == 'add') {
      this.router.navigate(['tabs/vot-requests']);
    }
  }

  async initializeOfferForm() {
    this.offerForm = new FormGroup({
      offerId: new FormControl(!!this.offer ? this.offer.offerId : 0),
      dateToWork: new FormControl(
        {
          value: !!this.offer
            ? utils.getConvertedDate(this.offer.dateToWork).toLocaleString()
            : '',
          disabled: false,
        },
        Validators.required
      ),
      status: new FormControl(!!this.offer ? this.offer.status : 1),
      shiftToWork: new FormControl(
        !!this.offer ? this.offer.shiftToWork : '',
        Validators.required
      ),
      companyId: new FormControl(this.companyId),
      departmentId: new FormControl(
        !!this.offer ? this.offer.departmentId : '',
        Validators.required
      ),
      termsMsg: new FormControl(!!this.offer ? this.termsMsg : ''),
      createdBy: new FormControl(!!this.offer ? this.offer.createdBy : null),
      createdDate: new FormControl(
        !!this.offer ? this.offer.createdDate : null
      ),
      offerType: new FormControl(2),
      timeType: new FormControl(
        !!this.offer ? this.offer.timeType : '',
        Validators.required
      ),
      isHourEarly: new FormControl({
        value: !!this.offer ? this.offer.isHourEarly : false,
        disabled: false,
      }),
      isHourLate: new FormControl({
        value: !!this.offer ? this.offer.isHourLate : false,
        disabled: false,
      }),
    });
    this.shiftId = Number(localStorage.getItem(Constants.SHIFTID));
    this.offerForm.controls.termsMsg.setValue(this.termsMsg);

    this.offerForm.controls.departmentId.updateValueAndValidity();
    this.offerForm.controls.shiftToWork.updateValueAndValidity();
    this.offerForm.controls.timeType.updateValueAndValidity();
    if (this.offerForm.controls.offerId.value > 0) {
      const workDate = this.datepipe.transform(
        this.setnewDate(this.offerForm.controls.dateToWork.value),
        'yyyy-MM-dd'
      );
      this.workDate = workDate;
      this.getShiftWorkingDetails(workDate, '');
    }

    // TODO: KISHAN not sure why this added for already defined
    // console.log(this.offerForm.controls.shiftToWork.value);
    // console.log(this.offer);
    // if (this.offer) {
    //   if (this.offerForm.controls.offerId.value > 0) {
    //       await this.GetShiftDetailsVot(
    //         this.workDate,
    //         this.offerForm.controls.shiftToWork.value
    //       );
    //   }
    //   this.offerForm.controls.termsMsg.setValue(this.termsMsg);
    // }
    await this.getshiftDetail().then(() => {});
    console.log(this.offerForm.value, 'formvalue');
  }

  initializeMessages() {
    this.shiftOptions = {
      header: 'Please select the Date you want to work on first',
    };
    this.messageList.dateToWork = {
      required: Constants.VALIDATION_MSG.OFFER.WORK_ON_DATE_REQUIRED,
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
    this.messageList.timeType = {
      required: Constants.VALIDATION_MSG.OFFER.TIME_TYPE_REQUIRED,
    };
  }

  getshiftDetail() {
    return new Promise(async (resolve, reject) => {
      if (!navigator.onLine) {
        return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      }

      await this.shiftService.getShiftDetails(this.shiftId).then(
        (res) => {
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

            resolve(this.shiftDetail);
          }
        },
        (err) => {}
      );
    });
  }

  async workDateChange(event) {
    if (!!event && event != 'Invalid Date') {
      const workDate = this.datepipe.transform(
        this.setnewDate(this.offerForm.controls.dateToWork.value),
        'yyyy-MM-dd'
      );
      // console.log(workDate);
       if (!this.offerForm.controls.dateToWork.touched) return;
      this.shiftOptions = {
        header: 'Please select the department you want to work on first',
      };
      if (this.workDate != undefined) {
        if (this.workDate != workDate) {
          this.utilityService.showLoadingwithoutDuration();
          await this.getShiftWorkingDetails(workDate, 'DATE_CHANGED').then(
            () => {
              this.utilityService.hideLoading();
            }
          );
        }
      } else {
        this.utilityService.showLoadingwithoutDuration();
        await this.getShiftWorkingDetails(workDate, '').then(() => {
          this.utilityService.hideLoading();
        });
      }

      this.workDate = workDate;

      this.departmentId = 0;
      if (!!this.offerForm.controls.departmentId.value) {
        this.departmentId = !!this.offer
          ? this.offer.departmentId
          : Number(this.offerForm.controls.departmentId.value);
      }
      // TODO - KISHAN dont know why this added, IN WEB not there
      // !this.removeFieldValue
      //   ? this.offerForm.controls.shiftToWork.setValue('')
      //   : (this.removeFieldValue = false);
    }
  }
  hideKey() {
    setTimeout(() => {
      this.keyboard.hide();
    }, 500);
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

            this.getTermsMsg(3);
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
      // if (!!this.offerForm) {
      //   this.offerForm.controls.termsMsg.setValue(this.termsMsg);
      // }
      // else{
      //   setTimeout(() => {
      //     this.offerForm.controls.termsMsg.setValue(this.termsMsg);
      //   }, 2000);
      // }
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

  async getShiftListByDateAndDepartmentID() {
    if (this.offer) {
      if (this.offer.offerId > 0) {
        await this.shiftFilterByDateAndDepartment(
          this.offer.dateToWork,
          Number(this.offer.departmentId)
        ).then(() => {});
      }
    }
  }

  async onSubmit() {
    try {
      this.formService.markFormGroupTouched(this.offerForm);
      this.isSubmitted = true;
      if (this.offerForm.invalid) {
        return;
      }
      const mxdate = this.datepipe.transform(
        this.setnewDate(this.offerForm.controls.dateToWork.value),
        'yyyy-MM-dd'
      );

      delete this.offerForm.controls.termsMsg;
      this.removeFieldValue = true;

      console.log(this.offerForm.getRawValue());
      this.offerForm.controls.dateToWork.setValue(mxdate);
      this.offerForm.controls.departmentId.setValue(
        Number(this.offerForm.controls.departmentId.value)
      );
      this.offerForm.controls.shiftToWork.setValue(
        Number(this.offerForm.controls.shiftToWork.value)
      );
      if (this.offerForm.controls.isHourEarly.value == null) {
        this.offerForm.controls.isHourEarly.setValue(false);
      }
      if (this.offerForm.controls.isHourLate.value == null) {
        this.offerForm.controls.isHourLate.setValue(false);
      }
      if (this.offerForm.controls.timeType.value) {
        this.offerForm.controls.timeType.setValue(
          Number(this.offerForm.controls.timeType.value)
        );
      }
      console.log('data here ', this.offerForm.value);

      if (!navigator.onLine) {
        return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      }
      this.utilityService.showLoadingwithoutDuration();
      const saveMethod =
        this.offerForm.controls.offerId.value > 0
          ? this.votService.updateVotRequestOffer(this.offerForm.getRawValue())
          : this.votService.addVotRequestOffer(this.offerForm.getRawValue());

      await saveMethod.then(
        (res) => {
          if (res['Success']) {
            this.utilityService.hideLoading();
            this.utilityService.showSuccessToast(
              this.offerForm.controls.offerId.value > 0
                ? Constants.VOT_REQUEST_UPDATE_MSG
                : Constants.VOT_REQUEST_ADD_MSG
            );
            this.router.navigate(['tabs/vot-requests']);
          } else {
            this.modal.dismiss(true);
            this.utilityService.hideLoading();
            this.utilityService.showErrorToast(res['Message']);
            this.removeFieldValue = true;
            this.offerForm.controls.dateToWork.setValue(utils.getConvertedToDateOnly(mxdate));
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

  setnewDate(date) {
    const dateObj = {
      year: +this.datepipe.transform(date, 'yyyy'),
      month: +this.datepipe.transform(date, 'MM'),
      day: +this.datepipe.transform(date, 'dd'),
    };
    return new Date(dateObj['year'], dateObj['month'] - 1, dateObj['day']);
  }

  async getShiftWorkingDetails(workDate, data: any) {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }

    await this.offerService.getShiftWorkingDetails(workDate).then(
      async (res) => {
        if (res['Success']) {
          this.getWorkingShiftDetails = res['Data'];
          this.offerForm.controls.departmentId.patchValue(
            this.getWorkingShiftDetails.department.departmentId
          );

          await this.shiftFilterByDateAndDepartment(
            workDate,
            this.getWorkingShiftDetails.department.departmentId
          ).then(() => {
            this.offerForm.controls.shiftToWork.patchValue(
              this.getWorkingShiftDetails.shift.shiftId
            );

            this.offerForm.controls.departmentId.updateValueAndValidity();
            this.offerForm.controls.shiftToWork.updateValueAndValidity();
          });

          this.offerForm.controls.timeType.setValue(this.timeList[0].id);
          this.offerForm.controls.departmentId.disable();
          this.offerForm.controls.shiftToWork.disable();
          this.offerForm.controls.timeType.disable();
        } else {
          this.getWorkingShiftDetails = {};
          this.offerForm.controls.departmentId.enable();
          this.offerForm.controls.shiftToWork.enable();
          this.offerForm.controls.timeType.enable();

          if (data == 'DATE_CHANGED') {
            this.offerForm.controls.departmentId.setValue('');
            this.offerForm.controls.shiftToWork.setValue('');
            this.offerForm.controls.timeType.setValue('');
          }
        }
      },
      (err) => {
        this.getWorkingShiftDetails = {};
      }
    );
  }

  shiftFilterByDateAndDepartment(workDate, departmentId) {
    return new Promise(async (resolve) => {
      if (!navigator.onLine) {
        return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      }

      await this.shiftService
        .getShiftListBySkipDate(workDate, departmentId)
        .then(
          (res) => {
            if (res['Success']) {
              if (!!res['Data'] && res['Data'].length > 0) {
                this.shiftOptions = {
                  header:
                  'Please select the shift you would like to work on first',
                };
              } else {
                this.shiftOptions = {
                  header:
                  'Please select the department you want to work on first',
                };
              }

              this.shiftList = res['Data'];

              // TODO : KISHAN dont know why this things added, in WEB not there
              // if (this.offer) {
              //   if (this.offer.offerId == 0) {
              //     this.offerForm.controls.shiftToWork.setValue(
              //       this.getWorkingShiftDetails.shift.shiftId
              //     );
              //   } else {
              //     // this.offerForm.controls.shiftToWork.setValue(this.getWorkingShiftDetails.shift['shiftId']);
              //   }
              // } else {
              //   this.offerForm.controls.shiftToWork.setValue(
              //     this.getWorkingShiftDetails.shift.shiftId
              //   );
              // }
              // if (this.offer) {
              //   if (this.offer.offerId > 0) {
              //     if (this.getWorkingShiftDetails.shift) {
              //       this.offerForm.controls.shiftToWork.setValue(
              //         this.getWorkingShiftDetails.shift.shiftId
              //       );
              //     }
              //   }
              // }
            } else {
              this.shiftOptions = {
                header:
                  'Please select the department you want to work on first',
              };
              this.shiftList = [];
            }

            resolve('success');
          },
          (err) => {
            this.shiftList = [];
          }
        );
    });
  }

  async onDepartmentChange(event) {
    if (!this.offerForm.controls.departmentId.touched) return;
    if (!!event.currentTarget) {
      if (!!event.currentTarget.value) {
        this.shiftList = [];

        this.offerForm.controls.shiftToWork.setValue('');
        if (!!this.offerForm.controls.dateToWork.value) {
          const workDate = this.datepipe.transform(
            this.setnewDate(this.offerForm.controls.dateToWork.value),
            'yyyy-MM-dd'
          );
          this.utilityService.showLoadingwithoutDuration();
          await this.shiftFilterByDateAndDepartment(
            workDate,
            Number(event.currentTarget.value)
          ).then(() => {
            this.offerForm.controls.departmentId.updateValueAndValidity();
            this.offerForm.controls.shiftToWork.updateValueAndValidity();
            this.utilityService.hideLoading();
          });
        }
      } else {
        this.shiftOptions = {
          header: 'Please select the Date you want to work on first',
        };
        this.shiftList = [];
        this.offerForm.controls.shiftToWork.setValue('');
      }
    } else {
      if (!!event) {
        this.shiftList = [];
        if (
          !!this.offer &&
          !!this.offer.dateToWork &&
          !!this.offer.departmentId
        ) {
          const workDate = this.datepipe.transform(
            this.setnewDate(new Date(this.offer.dateToWork)),
            'yyyy-MM-dd'
          );
          this.utilityService.showLoadingwithoutDuration();
          await this.shiftFilterByDateAndDepartment(
            workDate,
            Number(event)
          ).then(() => {
            this.offerForm.controls.departmentId.updateValueAndValidity();
            this.offerForm.controls.shiftToWork.updateValueAndValidity();
            this.utilityService.hideLoading();
          });
        }
      } else {
        this.shiftList = [];
        this.offerForm.controls.shiftToWork.setValue('');
      }
    }
  }

  async onShiftChange(event) {
   if (!this.offerForm.controls.shiftToWork.touched) return;
    if (!!event.currentTarget) {
      if (!!event.currentTarget.value) {
        if (this.offerForm.controls.dateToWork.value) {
          var workDate = this.datepipe.transform(
            this.setnewDate(this.offerForm.controls.dateToWork.value),
            'yyyy-MM-dd'
          );
          this.utilityService.showLoadingwithoutDuration();
          await this.GetShiftDetailsVot(
            workDate,
            Number(event.currentTarget.value)
          ).then(() => {
            this.utilityService.hideLoading();
          });
        }
      }
    } else {
      if (!!event) {
        this.shiftList = [];
        if (
          !!this.offer &&
          !!this.offer.dateToWork &&
          !!this.offer.shiftToWork
        ) {
          var workDate = this.datepipe.transform(
            this.setnewDate(new Date(this.offer.dateToWork)),
            'yyyy-MM-dd'
          );
          this.utilityService.showLoadingwithoutDuration();
          await this.GetShiftDetailsVot(workDate, Number(event)).then(() => {
            this.utilityService.hideLoading();
          });
        }
      }
    }
  }

  async GetShiftDetailsVot(workDate, shiftId) {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    if (workDate === undefined) {
      workDate = this.datepipe.transform(
        this.setnewDate(this.offerForm.controls.dateToWork.value),
        'yyyy-MM-dd'
      );
    }
    await this.shiftService.getShiftDetailsVot(workDate, shiftId).then(
      (res) => {
        if (res['Success']) {
          this.isShiftDetailVot = res['Data'];
        }
      },
      (err) => {
        this.offerForm.controls.timeType.enable();
      }
    );
  }

  async getSettingByCompanyID() {
    let that = this;
    let module = SubscriptionType.filter((item) => {
      return item.value === 'VOT Request Module';
    });
    this.moduleId = module[0].id;
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }

    await this.callInRequstService
      .getSettingByCompanyID(this.moduleId, this.companyId)
      .then(
        async (res: any) => {
          if (res['Success']) {
            that.settingList = res.Data;
            if (!!that.offerForm) {
              if (that.offerForm.controls.offerId.value > 0) {
                await that.GetShiftDetailsVot(
                  that.workDate,
                  that.offerForm.controls.shiftToWork.value
                );
              }
            }

            console.log(that.settingList);
            if (that.settingList.length > 0) {
              that.settingList.map((item) => {
                if (item.SettingType === 'Hour Early') {
                  item.Name = 'An Hour Early';
                  that.HourEarly = item;
                } else if (item.SettingType === 'Hour Late') {
                  item.Name = 'An Hour Late';
                  that.HourLate = item;
                }
              });
            }
          } else {
            that.settingList = [];
          }
        },
        (err) => {
          that.settingList = [];
        }
      );
  }

  checkBoxClick() {}
}
