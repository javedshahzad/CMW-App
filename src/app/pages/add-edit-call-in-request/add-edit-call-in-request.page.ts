import {
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnInit,
  Output,
} from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { ModalController, AlertController } from '@ionic/angular';
import { Offer } from '../../models/offer.model';
import {
  Constants,
  SubscriptionType,
  bsConfig,
  OfferTypesEnum,
} from '../../constant/constants';
import {
  FormGroup,
  FormControl,
  FormBuilder,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { FormService } from '../../services/form/form.service';
import { CallInRequestService } from '../../services/call-in-request/call-in-request.service';
import { DatePipe } from '@angular/common';
import { UtilityService } from '../../services/utility/utility.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { EventsService } from 'src/app/services/events/events.service';
import { DomSanitizer } from '@angular/platform-browser';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { utils } from 'src/app/constant/utils';

@Component({
  selector: 'app-add-edit-call-in-request',
  templateUrl: './add-edit-call-in-request.page.html',
  styleUrls: ['./add-edit-call-in-request.page.scss'],
})
export class AddEditCallInRequestPage implements OnInit {
  @Input() offer: Offer;
  @Output() closeRequest = new EventEmitter<boolean>();
  @Output() showSwap = new EventEmitter(false);
  public offerForm: FormGroup;
  public isPaidTimeOff: boolean = false;
  IsCoverMyWork: boolean = false;
  enable: boolean = true;
  public paidTimeOff: any = {};
  public settingList: any = [];
  public moduleId: any;
  bsConfig = bsConfig;
  public flma: any = {};
  public FMLAWarning: boolean = false;
  today = new Date().toLocaleString();
  tomorrow = new Date(this.today);
  public paidWarning = true;
  messageList: any = new Offer();
  public message: any;
  public message1: any;
  public IsHRCallBack: any = {};
  isSubmitted: boolean = false;
  public isConfirmWarning: boolean = false;
  OtherReason: string;
  SettingType: string;
  swapReq: any;
  isSwap: boolean;
  description: any = [];
  otherReason = false;
  termsConditionList = [];
  companyId: number;
  departmentId: number;
  shiftToSkip: number;
  reasonList = [];
  tryHalfDay: boolean = false;
  enableVal: any;
  isShow: boolean = false;
  tryHalfDayMsg: string;
  Editor = ClassicEditor;
  isSwapRequest: boolean = false;
  currentPage = Constants.CURRENT_PAGE;
  swapRequestMsg: string;
  settingType: any = [];
  totalItems: any;
  offerTypeEnum = OfferTypesEnum;
  cancleCallOffMsg: string = 'system successfully prevented a call off.';
  Message: any;
  utoWarningMsg = '';
  toaster: any;
  action: any;
  callOffDate: any;
  minDate = new Date(this.today).toISOString();
  maxYear = new Date('2050-12-31').toISOString();
  pickerOption: { buttons: { text: string; handler: (x: any) => void }[] };
  formDate: string;
  selectedDate: Date;
  constructor(
    public modal: ModalController,
    private datePipe: DatePipe,
    private router: Router,
    public alertController: AlertController,
    private callInRequestService: CallInRequestService,
    private formService: FormService,
    private utilityService: UtilityService,
    public events: EventsService,
    public sanitizer: DomSanitizer,
    public keyboard: Keyboard,
    public route: ActivatedRoute,
    public fb: FormBuilder,
  ) {
    this.isPaidTimeOff = false;
    this.FMLAWarning = false;
    this.isSubmitted = false;
    this.isConfirmWarning = false;
    this.isSwapRequest = false;

    this.IsCoverMyWork =
      localStorage.getItem(Constants.APP_NAME) === 'CoverMyWork' ? true : false;
    this.Editor.defaultConfig = {
      toolbar: {
        items: [],
      },
    };
    this.route.queryParams.subscribe((params) => {
      this.action = params.action;
    });
    // if (this.paidWarning == true) {
    //   this.message =
    //     'All missed time will be covered by your Unpaid Time Off (UTO) balance. It is your responsibility to ensure that you have enough UTO accumulated to cover this absence.';
    // }
  }

  ngOnInit() {}

  async ionViewWillEnter() {
    try{
      if(this.offerForm){
        this.offerForm.reset();
      }
      this.utilityService.showLoadingwithoutDuration();
      this.isSwapRequest = JSON.parse(
        localStorage.getItem(Constants.IS_SWAP_REQUEST)
      );
      if (this.action == 'edit') {
        this.offer = JSON.parse(localStorage.getItem(Constants.CALL_IN_DATA));
      } else {
        this.offer = null;
      }
      this.companyId = Number(localStorage.getItem(Constants.COMPANYID));
      this.departmentId = Number(localStorage.getItem(Constants.DEPARTMENTID));
      this.shiftToSkip = Number(localStorage.getItem(Constants.SHIFTID));
      const today = new Date();

      const tomorrow = new Date(today.setDate(today.getDate()));
      const tDate = utils.getConvertedDateToISO(tomorrow);
      this.minDate = tDate;
      await this.getReasonList();
      await this.initializeCallInForm();
      await this.initializeMessages();
      await this.getSettingByCompanyID();
      // this.getMessage();
  
      // this.paidWarning = true;
      // if (this.paidWarning == true) {
      //   this.message =
      //     'All missed time will be covered by your Unpaid Time Off (UTO) balance. It is your responsibility to ensure that you have enough UTO accumulated to cover this absence.';
      // }
      await this.isSwapReq();
      await this.msgShow();
  
      this.pickerOption = {
        buttons: [
          {
            text: 'Cancle',
            handler: (x) => {
              let val = this.offerForm.controls.dateToSkip.value;
              this.offerForm.controls.dateToSkip.setValue('');
              this.offerForm.controls.dateToSkip.setValue(val);
            },
          },
          {
            text: 'Done',
            handler: (x) => {
              this.offerForm.controls.dateToSkip.setValue('');
              this.offerForm.controls.dateToSkip.setValue(x);
            },
          },
        ],
      };
      
      this.utilityService.hideLoading();
    }catch(e){
      console.log(e);
      this.utilityService.hideLoading();
    }
  }

  initializeCallInForm() {
    this.offerForm = this.fb.group({
      offerId: new FormControl(!!this.offer ? this.offer.offerId : 0),
      dateToSkip: new FormControl(
        !!this.offer
          ? utils.getConvertedDate(this.offer.dateToSkip).toLocaleString()
          : this.today,
        Validators.required
      ),
      status: new FormControl(!!this.offer ? this.offer.status : 5),
      ReasonId: new FormControl(
        !!this.offer ? this.offer.ReasonId : '',
        Validators.required
      ),
      OtherReason: new FormControl(!!this.offer ? this.offer.OtherReason : ''),
      companyId: new FormControl(this.companyId),
      departmentId: new FormControl(this.departmentId),
      offerType: new FormControl(6),
      shiftToSkip: new FormControl(this.shiftToSkip),
      IsHRCallBack: new FormControl(
        !!this.offer ? this.offer.IsHRCallBack : false
      ),
      IsPaidOff: new FormControl(!!this.offer ? this.offer.IsPaidOff : false),
      IsFMlA: new FormControl(!!this.offer ? this.offer['IsFMLA'] : false),
      createdBy: new FormControl(!!this.offer ? this.offer.createdBy : null),
    });
    if (
      this.offerForm.controls.offerId.value > 0 &&
      this.offerForm.controls.ReasonId.value === 1
    ) {
      this.otherReason = true;
      this.offerForm.controls.OtherReason.setValidators(Validators.required);
    }
    if (this.offerForm.controls.offerId.value != 0) {
      // this.setInialDurationLogic();
      this.callOffDate = new Date(
        this.offerForm.controls.dateToSkip.value
      ).toLocaleString();
    } else {
      this.callOffDate = this.datePipe.transform(this.today, 'MM/dd/yyyy');
    }
  }

  initializeMessages() {
    this.messageList.dateToSkip = {
      required: Constants.VALIDATION_MSG.CALL_IN.CALL_OFF_ON,
    };
    this.messageList.CallOffReason = {
      required: Constants.VALIDATION_MSG.CALL_IN.CALL_OFF_FOR,
    };
    this.messageList.CallOffOtherReason = {
      required: Constants.VALIDATION_MSG.CALL_IN.OTHER_REASON,
    };
  }

  async getMessage() {
    let that = this;
    await this.callInRequestService
      .getTermsConditionListByCompanyId(this.companyId, null)
      .then(
        (response) => {
          if (response['Success']) {
            let _setting = (that.description = response['Data'].filter(
              (x) => x.typeFieldstr == 'Call-off UTO Message'
            ));
            if (_setting.length == 0) {
              that.utoWarningMsg = '';
            } else {
              if (that.description[0].length == 0) {
                that.utoWarningMsg = '';
              } else {
                that.utoWarningMsg = that.description[0]['description'].replace(
                  /<[^>]*>/g,
                  ''
                );
              }
            }
          } else {
            that.description = [];
          }

          that.checkBoxClick();
        },
        (err) => {
          that.description = [];
          that.checkBoxClick();
        }
      );
  }
  getTextMessagefromHtml(message, isChatListCache = false) {
    let parser = new DOMParser();
    const parsedDocument = parser.parseFromString(message, 'text/html');
    if (!!parsedDocument.body.firstChild) {
      return parsedDocument.body.innerText;
    } else return '';
  }

  checkBoxClick() {
    //this.utilityService.showLoadingwithcustomDuration(2000);
    if (this.offerForm.value.IsFMlA && this.offerForm.value.IsPaidOff) {
      this.message =
        'Missed time will be covered by available balance in the order of FMLA and Paid Time Off. All remaining time will be covered by your Unpaid Time Off Balance. It is your responsibility to ensure you have enough time balance available in the categories you selected.';
    } else if (this.offerForm.value.IsFMlA && !this.offerForm.value.IsPaidOff) {
      this.message =
        'Missed time will be covered by your FMLA balance, if available. Any uncovered time will be covered by your Unpaid Time Off Balance. It is your responsibility to ensure you have enough FMLA balance available';
    } else if (!this.offerForm.value.IsFMlA && this.offerForm.value.IsPaidOff) {
      // this.message = "All missed time will be covered by your Unpaid Time Off(UTO) balance. It is your responsibility to ensure that you have enough UTO accumulated to cover this absence."

      this.message =
        'All missed time will be covered by your Unpaid Time Off (UTO) balance. If you do not have enough UTO balance to cover the entire absence, Paid Time Off (PTO) will be applied to cover the shortage. It is your responsibility to ensure that you have enough UTO+PTO accumulated to cover this absence.';
    } else if (
      !this.offerForm.value.IsFMLA &&
      !this.offerForm.value.IsPaidOff
    ) {
      // this.message = "All missed time will be covered by your Unpaid Time Off(UTO) balance. It is your responsibility to ensure that you have enough UTO accumulated to cover this absence."

      this.message = this.utoWarningMsg;
    }
  }

  closeModal() {
    if (this.action == 'edit') {
      this.router.navigate(['tabs/callin-request-detail']);
    } else {
      this.router.navigate(['tabs/call-in-requests']);
    }
  }

  control(controlName: string): AbstractControl {
    return this.offerForm.get(controlName);
  }

  value(controlName: string) {
    return this.control(controlName).value;
  }

  async getReasonList() {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }

    await this.callInRequestService.getReasonsByType().then(
      async (response) => {
        if (response['Success']) {
          this.reasonList = response['Data'];

          // TODO: KISHAN not sure why added two times
          // if (!!this.offer) {
          //   this.initializeCallInForm();
          // }
        } else {
          this.reasonList = [];
        }
      },
      (err) => {
        this.reasonList = [];
      }
    );
  }

  reasonChange(value: string) {
    if (parseInt(value) === 1) {
      this.otherReason = true;
      this.offerForm.controls.OtherReason.setValidators(Validators.required);
    } else {
      this.otherReason = false;
      this.offerForm.controls.OtherReason.setValue('');
      this.offerForm.controls.OtherReason.setValidators(null);
      this.offerForm.controls.OtherReason.updateValueAndValidity();
    }
  }

  async getSettingByCompanyID() {
    let that = this;
    let module = SubscriptionType.filter((item) => {
      return item.value === 'Call-Off Module';
    });
    this.moduleId = module[0].id;
    await this.callInRequestService
      .getSettingByCompanyID(this.moduleId, this.companyId)
      .then(
        async (res: any) => {
          if (res['Success']) {
            that.settingList = res.Data;
            if (that.settingList.length > 0) {
              that.settingList.map((item) => {
                if (item.SettingType === 'PaidTimeOff') {
                  item.Name = 'Paid Time Off';
                  that.paidTimeOff = item;
                  if (that.value('offerId') == 0) {
                    if (that.paidTimeOff.Enable == true) {
                      // this.message = "All missed time will be covered by your Unpaid Time Off(UTO) balance. It is your responsibility to ensure that you have enough UTO accumulated to cover this absence."
                      that.isPaidTimeOff = true;
                      // this.message = "All missed time will be covered by your Unpaid Time Off (UTO) balance. If you do not have enough UTO balance to cover the entire absence, Paid Time Off (PTO) will be applied to cover the shortage. It is your responsibility to ensure that you have enough UTO+PTO accumulated to cover this absence."
                      that.offerForm.controls['IsPaidOff'].setValue(true);
                    } else {
                      that.isPaidTimeOff = false;
                      // this.message = "All missed time will be covered by your Unpaid Time Off (UTO) balance. It is your responsibility to ensure that you have enough UTO accumulated to cover this absence."
                      that.offerForm.controls['IsPaidOff'].setValue(false);
                    }
                  }
                } else if (item.SettingType === 'FMLA') {
                  item.Name = item.SettingType;
                  that.flma = item;
                } else if (item.SettingType === 'Call-off intervention') {
                  let callOfIntervention = item;
                  if (that.value('offerId') == 0) {
                    if (
                      callOfIntervention.Enable == true &&
                      item.OfferType == that.offerTypeEnum.CallOffModule
                    ) {
                      that.isConfirmWarning = true;
                    }
                  }
                }
              });
              if (that.value('offerId') > 0) {
                that.editTimeMessage(that.settingList);
              }
            }
          } else {
            that.settingList = [];
          }

          await that.getMessage();
        },
        async (err) => {
          that.settingList = [];
          await that.getMessage();
        }
      );
  }
  editTimeMessage(settingarr) {
    let isFLMA: boolean = false;
    let IsPaidOff: boolean = false;
    settingarr.map((item) => {
      if (item.SettingType === 'PaidTimeOff') {
        if (item.Enable == true) {
          this.message =
            'All missed time will be covered by your Unpaid Time Off (UTO) balance. If you do not have enough UTO balance to cover the entire absence, Paid Time Off (PTO) will be applied to cover the shortage. It is your responsibility to ensure that you have enough UTO+PTO accumulated to cover this absence.';
          IsPaidOff = true;
        } else {
          this.message =
            'All missed time will be covered by your Unpaid Time Off (UTO) balance. It is your responsibility to ensure that you have enough UTO accumulated to cover this absence.';
          this.offerForm.controls['IsPaidOff'].setValue(false);
        }
      } else if (item.SettingType === 'FMLA') {
        if (item.Enable == true) {
          isFLMA = true;
        } else {
          this.offerForm.controls['IsFMlA'].setValue(false);
        }
      }
      this.checkBoxClick();
    });
  }
  //   checkChange(date){
  //   let dateCheck = date.value;
  //   let year = dateCheck.year.value;
  //   let month = dateCheck.month.value;
  //   let day = dateCheck.day.value;
  //   let newdate = new Date(year, month -1, day +1);
  //   this.offerForm.controls.dateToSkip.setValue(newdate.toISOString());
  // }
  async onSubmit() {
    try {
      let that = this;
      this.formService.markFormGroupTouched(this.offerForm);
      if (this.offerForm.invalid) {
        return;
      }
      this.utilityService.showLoadingwithoutDuration();

      let formDate = this.datePipe.transform(
        this.setnewDate(this.offerForm.controls.dateToSkip.value),
        'yyyy-MM-dd'
      );
      let todaysDate = this.datePipe.transform(this.today, 'yyyy-MM-dd');
      console.log(this.SettingType, this.enable);

      await this.callInRequestService.getSettingType(null,this.companyId).then(async (res) => {
        let enableVal = false;
        that.settingType = res;
        let proceed = false;

        if (!!that.settingType && that.settingType.Data.length > 0) {
          enableVal = that.settingType.Data.find(
            (x) => x.SettingType == 'Call-off intervention'
          );

          if (enableVal) {
            if (enableVal['Enable']) {
              proceed = enableVal['Enable'];
            }
          } else {
            that.utilityService.hideLoading();
            that.utilityService.showErrorToast(
              'Setting configurations not found, Please contact HR admin'
            );
            return;
          }
        }
        this.utilityService.hideLoading();

        if (proceed) {
          if (formDate == todaysDate) {
            await that.continueProcess();
          } else {
            // swap true and future day entry
            that.swapReq = localStorage.getItem(Constants.IS_SWAP_REQUEST);
            if (that.swapReq == 'true') {
              that.callSwapAlert();
            } else {
              await that.continueProcess();
            }
          }
        } else {
          await that.proceedSubmit('nodata');
        }
      });
    } catch (e) {
      console.log(e);
      this.utilityService.hideLoading();
    }
  }
  // setnewDate(date) {
  //   let year = date.year.value;
  //   let month = date.month.value;
  //   let day = date.day.value;

  //   return new Date(year, month, day);
  // }
  setnewDate(date) {
    const dateObj = {
      year: +this.datePipe.transform(date, "yyyy"),
      month: +this.datePipe.transform(date, "MM"),
      day: +this.datePipe.transform(date, "dd"),
    };
    return new Date(dateObj["year"], dateObj["month"] - 1, dateObj["day"]);
  }


  async cancelValidationPopUp() {
    let that = this;
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoadingwithoutDuration();
    await this.callInRequestService
      .logCallOffRequest(6, this.cancleCallOffMsg)
      .then(() => {
        that.utilityService.hideLoading();
        that.isSwapRequest = false;
      });
    // if (this.modal !== undefined) {
    //   this.utilityService.hideLoading();
    //   return;
    //   // this.modal.dismiss();
    // }
  }

  proceedHalfDay(event) {
    if (event) {
      // TODO: KISHAN not sure why this line added
      // this.router.navigate(['tabs/call-in-requests']);

      this.tryHalfDay = true;
      this.onClickSecondAlert(this.modal.create);
      //this.tryHalfDayMsg = 'Would you like to consider going to work for half day, instead of calling-off? It is recommended to make every effort to preserve as much UTO as you can'
    }
  }

  closeAll(event) {
    if (event) {
      this.utilityService.hideLoading();
      this.router.navigate(['tabs/call-in-requests']);
    }
  }

  async continueProcess() {
    let that = this;
    var FormDate = this.offerForm.controls.dateToSkip.value;

    const mxdate = new Date(FormDate).toISOString();
    delete this.offerForm.controls.termsMsg;
    const dateToSkip = new Date(mxdate);
    const firstday = new Date(dateToSkip.setDate(dateToSkip.getDate() - 30));
    const startdate = this.datePipe.transform(firstday, 'yyyy-MM-dd');

    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoadingwithoutDuration();
    await this.callInRequestService
      .checkMonthlyCallOffRequest(
        startdate,
        mxdate,
        this.offerForm.controls.offerId.value
      )
      .then(
        async (res) => {
          if (res['Success']) {
            that.utilityService.hideLoading();
            if (parseInt(res['Message']) > 0) {
              // this.onClickAlert(this.modal.create);
              let count = parseInt(res['Message']);
              that.onClickFirstAlert(this.modal.create, count);
            } else {
              await that.proceedSubmit('nodata');
            }
          } else {
            that.utilityService.hideLoading();
            that.utilityService.showErrorToast(res['Message']);
            that.offerForm.controls.dateToSkip.setValue(new Date(mxdate));
          }
        },
        (err) => {
          that.utilityService.hideLoading();
        }
      );
  }

  async proceedSubmit(event) {
    try {
      let that = this;
      if (event == true) {
        this.utilityService.hideLoading();
        this.router.navigate(['tabs/call-in-requests']);
      }

      this.tryHalfDay = false;
      const mxdate = this.datePipe.transform(
        this.setnewDate(this.offerForm.controls.dateToSkip.value),
        'yyyy-MM-dd'
      );
      this.offerForm.controls.dateToSkip.setValue(mxdate);
      this.offerForm.controls.dateToSkip.updateValueAndValidity();

      if (!navigator.onLine) {
        return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      }

      this.utilityService.showLoadingwithoutDuration();
      const saveMethod =
        this.offerForm.controls.offerId.value > 0
          ? this.callInRequestService.updateCallOffRequestOffer(
              this.offerForm.value
            )
          : this.callInRequestService.addCallOffRequestOffer(
              this.offerForm.value
            );
      await saveMethod.then(
        (res) => {
          if (res['Success']) {
            that.utilityService.hideLoading();
            that.utilityService.showSuccessToast(
              that.offerForm.controls.offerId.value > 0
                ? Constants.CALL_OFF_REQUEST_UPDATE_SUCCESS_MSG
                : Constants.CALL_OFF_REQUEST_ADD_SUCCESS_MSG
            );

            that.router.navigate(['tabs/call-in-requests']);
          } else {
            that.utilityService.hideLoading();
            that.utilityService.showErrorToast(res['Message']);
            that.offerForm.controls.dateToSkip.setValue(new Date(mxdate));
          }
        },
        (err) => {
          that.utilityService.hideLoading();
        }
      );
    } catch (e) {
      console.log(e);
    }
  }
  async onClickAlert(data: any) {
    if (this.otherReason) {
    }
    this.formService.markFormGroupTouched(this.offerForm);
    if (this.offerForm.invalid) {
      return;
    }
    let formDate = this.datePipe.transform(
      this.setnewDate(this.offerForm.controls.dateToSkip.value),
      'yyyy-MM-dd'
    );
    let todaysDate = this.datePipe.transform(this.today, 'yyyy-MM-dd');
    if (formDate == todaysDate) {
      let count: any;
      this.onClickFirstAlert(this.modal.create, count);
    }
    // else {
    //   console.log(data)
    // this.callSwapAlert();
    // }
  }
  async callSwapAlert() {
    const alert = await this.alertController.create({
      cssClass: 'delete-popo-up-class',
      message:
        ' <b>Would you like to try shift swap instead of calling off?</b>',
      buttons: [
        {
          text: 'Yes',
          role: 'submit',
          cssClass: 'secondary',
          handler: () => {
            this.redirectToSwap(true);
            console.log('yes');

            let navigationExtras: NavigationExtras = {
              queryParams: {
                action: 'isRequestedOffer',
              },
            };

            localStorage.setItem('selected_tab', 'my_request');
            this.events.publish('selected_tab', 'my_request');
            this.router.navigate(['/tabs/swap-requests'], navigationExtras);
          },
        },
        {
          text: 'No',
          role: 'cancel',
          handler: async () => {
            await this.continueProcess();
            console.log('cancel');
          },
        },
      ],
    });
    await alert.present();
  }

  async onClickFirstAlert(data: any, count: any) {
    console.log(data);
    const alert = await this.alertController.create({
      cssClass: 'delete-popo-up-class',
      message:
        ' <b>You have called off and taken early out for total of </b>' +
        count +
        '<b> time in last 30 days. Are you sure you want to continue?</b>',
      buttons: [
        {
          text: 'Cancel, let me rethink!',
          role: 'cancel',
          cssClass: 'secondary',
          handler: async () => {
            // this.modal.dismiss();
            await this.cancelValidationPopUp();
            console.log('cancel');
          },
        },
        {
          text: 'Yes, Continue to call-off',
          role: 'submit',
          handler: async () => {
            if (this.isShow) {
              this.proceedHalfDay(event);
              //  this.onClickSecondAlert(this.modal.create);
              console.log('Continue to call-off');
            } else {
              await this.proceedSubmit('nodata');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async onClickSecondAlert(data: any) {
    console.log(data);
    const alert = await this.alertController.create({
      cssClass: 'delete-popo-up-class',
      message:
        ' <b>Would you like to consider going to work for half day, instead of calling-off? It is recommended to make every effort to preserve as much UTO as you can</b>',
      buttons: [
        {
          text: 'Yes',
          role: 'submit',
          cssClass: 'secondary',
          handler: () => {
            this.cancleCallOff();
            this.onClickThirdAlert(this.modal.create);
            console.log('yes');
          },
        },
        {
          text: 'No',
          role: 'cancel',
          handler: async () => {
            await this.proceedSubmit('cancel');
            // this.modal.dismiss();
            console.log('cancel');
          },
        },
      ],
    });
    await alert.present();
  }

  async onClickThirdAlert(data: any) {
    console.log(data);
    const alert = await this.alertController.create({
      cssClass: 'delete-popo-up-class',
      message: ' <b>Awesome! see you at work!</b>',
      buttons: [
        {
          text: 'Ok',
          role: 'submit',
          cssClass: 'secondary',
          handler: () => {
            //this.modal.dismiss();
            this.closeAll(event);
            this.router.navigate(['tabs/call-in-requests']);
            console.log('submit');
          },
        },
      ],
    });
    await alert.present();
  }
  redirectToSwap(event) {
    // now you are in a zon
    this.cancelValidationPopUp();
    //this.modal.dismiss();
  }
  cancleCallOff() {
    this.tryHalfDay = false;
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoadingwithThreeSec();
    this.callInRequestService.logCallOffRequest(6, this.cancleCallOffMsg);
    this.utilityService.hideLoading();
  }
  hideKey() {
    setTimeout(() => {
      this.keyboard.hide();
    }, 500);
  }



  async msgShow() {
    let that = this;
    await this.callInRequestService.getSettingType(null,this.companyId).then((res) => {
      that.settingType = res;
      if (!!that.settingType && that.settingType.Data.length > 0) {
        that.enableVal = that.settingType.Data.find(
          (x) =>
            x.SettingType == 'UTO system for attendance' && x.OfferType == 6
        );
      }
      if (!!that.enableVal) {
        if (that.enableVal['Enable']) {
          that.isShow = that.enableVal['Enable'];
        }
      }
    });
  }

  async isSwapReq() {
    let that = this;
    await this.callInRequestService.getUserData().then((res) => {
      if (res['Success']) {
        // this.utilityService.hideLoading();
        localStorage.setItem(Constants.USERNAME, res['Data'].userName);
        // localStorage.setItem(Constants.COMPANYID, res['Data'].companyId);
        if (
          res['Data'].companyId != localStorage.getItem(Constants.COMPANYID)
        ) {
          let id: any = Number(localStorage.getItem(Constants.COMPANYID));
          localStorage.setItem(Constants.COMPANYID, id);
        }
        that.swapReq = localStorage.setItem(
          Constants.IS_SWAP,
          res['Data'].isSwap
        );
      }
    });
  }
}
