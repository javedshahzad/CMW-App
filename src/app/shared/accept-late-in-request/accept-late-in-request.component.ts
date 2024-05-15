import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { Constants, OfferRequestTypesEnum } from '../../constant/constants';
import { Role } from 'src/app/models/role-model';
import { Offer } from 'src/app/models/offer.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { FormService } from '../../services/form/form.service';
import { CallInRequestService } from '../../services/call-in-request/call-in-request.service';
import { TermsConditionService } from '../../services/terms-condition/terms-condition.service';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { LateInService } from 'src/app/services/lateIn/late-in.service';
@Component({
  selector: 'app-accept-late-in-request',
  templateUrl: './accept-late-in-request.component.html',
  styleUrls: ['./accept-late-in-request.component.scss'],
})
export class AcceptLateInRequestComponent implements OnInit {
  public roleEnum = Role;
  role: number;
  @Input() Offer: Offer;
  public lateInForm: FormGroup;
  public messageList: any = new Offer();
  @Output() CancleRequest = new EventEmitter<boolean>();
  termsConditionList = [];
  companyId: number;
  Editor = ClassicEditor;
  termsAndCondition: string;
  OfferRequestTypesEnum = OfferRequestTypesEnum;
  isDisableBtn = true;
  constructor(
    private utility: UtilityService,
    private lateInService: LateInService,
    private formService: FormService,
    private callInRequestService: CallInRequestService,
    private termsConditionService: TermsConditionService
  ) {
    this.Editor.defaultConfig = {
      toolbar: {
        items: [],
      },
    };
  }

  ngOnInit() {
    this.companyId = Number(localStorage.getItem(Constants.COMPANYID));
    this.role = Number(localStorage.getItem(Constants.ROLE));
    this.initializeMessages();
    this.getTermsAndConditionByCompanyid();
    this.lateInForm = new FormGroup({
      offerId: new FormControl(this.Offer.offerId),
      offerType: new FormControl(this.Offer.offerType),
      status: new FormControl(this.Offer.status),
      companyId: new FormControl(this.Offer.companyId),
      departmentId: new FormControl(this.Offer.departmentId),
      createdBy: new FormControl(this.Offer.createdBy),
      createdDate: new FormControl(this.Offer.createdDate),
      shiftToSkip: new FormControl(this.Offer.shiftToSkip),
      dateToSkip: new FormControl(this.Offer.dateToSkip),
      vtoStartTime: new FormControl(this.Offer.vtoStartTime),
      vtoEndTime: new FormControl(this.Offer.vtoEndTime),
      ReasonId: new FormControl(this.Offer.ReasonId),
      uTOHours: new FormControl(this.Offer.uTOHours),
      isUtoBalance: new FormControl('', Validators.required),
      isWarningCompleted: new FormControl('', Validators.required),
      approvedDate: new FormControl(this.Offer.approvedDate),
      approvedBy: new FormControl(this.Offer.approvedBy),
      IsPaidOff: new FormControl(this.Offer.IsPaidOff),
      IsHRCallBack: new FormControl(this.Offer.IsHRCallBack),
      OtherReason: new FormControl(this.Offer.OtherReason),
      IsFMLA: new FormControl(this.Offer.IsFMLA),
      UTOwarningStr: new FormControl(),
    });
  }
  getTermsAndConditionByCompanyid() {
    this.utility.showLoading();
    this.termsConditionService
      .getTermsConditionListByCompanyId(this.companyId, null)
      .then(
        (res: any) => {
          if (res['Success']) {
            this.utility.hideLoading();
            this.termsConditionList = res.Data;
            this.termsAndCondition = this.termsConditionList.find(
              (x) => x.typeField === 5
            );
            this.lateInForm.controls['UTOwarningStr'].setValue(
              this.termsConditionList.find((x) => x.typeField === 5).description
            );
          } else {
            this.utility.hideLoading();
            this.termsConditionList = [];
          }
        },
        (err) => {
          this.utility.hideLoading();
          this.termsConditionList = [];
        }
      );
  }

  closePopUp() {
    this.CancleRequest.emit(false);
  }
  initializeMessages() {
    this.messageList.isUtoBalance = {
      required: Constants.VALIDATION_MSG.LATE_IN.SELECT_A_OPTION,
    };
    this.messageList.isWarningCompleted = {
      required: Constants.VALIDATION_MSG.LATE_IN.SELECT_A_OPTION,
    };
    this.messageList.UTOwarningStr = {
      required: Constants.VALIDATION_MSG.DESCTIPTION_REQ,
    };
  }
  proceed() {
    if (!navigator.onLine) {
      return this.utility.showErrorToast(Constants.OFFLINE_MSG);
    }
    if (this.lateInForm.controls.isWarningCompleted.value == 'true') {
      this.lateInForm.controls.UTOwarningStr.setValidators(Validators.required);
      this.lateInForm.controls.UTOwarningStr.updateValueAndValidity();
    } else {
      this.lateInForm.controls.UTOwarningStr.setValidators(null);
      this.lateInForm.controls.UTOwarningStr.updateValueAndValidity();
    }
    this.formService.markFormGroupTouched(this.lateInForm);
    if (this.lateInForm.invalid) {
      return;
    }
    this.utility.showLoading();
    this.isDisableBtn = false;
    const saveMethod =
      this.Offer.offerType === 6
        ? this.callInRequestService.approveCallOffOffer(this.lateInForm.value)
        : this.lateInService.proceedHroffer(this.lateInForm.value);
    saveMethod.then(
      (res) => {
        if (res['Success']) {
          this.utility.hideLoading();
          this.Offer.offerType === 6
            ? this.utility.showSuccessToast(
                Constants.CALL_OFF_REQUEST_APPROVE_MSG
              )
            : this.utility.showSuccessToast(
                Constants.LATE_IN_REQUEST_PROCESS_SUCCESS_MSG
              );
          this.CancleRequest.emit(true);
        } else {
          this.utility.hideLoading();
          this.utility.showErrorToast(res['Message']);
        }
      },
      (err) => {
        this.utility.hideLoading();
      }
    );
  }
}
