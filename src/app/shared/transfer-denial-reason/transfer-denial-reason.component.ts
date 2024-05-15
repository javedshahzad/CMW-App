import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  Constants,
  bsConfig,
  timeList,
  typeField,
} from 'src/app/constant/constants';
import {
  FormGroup,
  FormControl,
  Validators,
  AbstractControl,
} from '@angular/forms';
import { Offer } from 'src/app/models/offer.model';
import { FormService } from '../../services/form/form.service';
import { DatePipe } from '@angular/common';
import * as moment from 'moment';
import { OfferService } from '../../services/offer/offer.service';
import { UtilityService } from '../../services/utility/utility.service';

@Component({
  selector: 'app-transfer-denial-reason',
  templateUrl: './transfer-denial-reason.component.html',
  styleUrls: ['./transfer-denial-reason.component.scss'],
})
export class TransferDenialReasonComponent implements OnInit {
  @Output() close = new EventEmitter<boolean>();
  @Input() offer: Offer;
  public messageList: any = new Offer();
  public transferDenialForm: FormGroup;
  isDisableBtn = true;
  constructor(
    private utility: UtilityService,
    private formService: FormService,
    private datepipe: DatePipe,
    private OfferService: OfferService
  ) {}

  ngOnInit() {
    this.initializeOfferForm();
    this.initializeMessages();
  }
  initializeOfferForm() {
    this.transferDenialForm = new FormGroup({
      offerId: new FormControl(!!this.offer ? this.offer.offerId : 0),
      reason: new FormControl(
        !!this.offer ? this.offer.reason : '',
        Validators.required
      ),
    });
  }

  initializeMessages() {
    this.messageList.reason = {
      required: Constants.VALIDATION_MSG.DENIAL_REQUEST.REASON_REQUIRED,
    };
  }

  cancel() {
    this.close.emit(false);
  }

  onSubmit() {
    this.formService.markFormGroupTouched(this.transferDenialForm);
    if (this.transferDenialForm.invalid) {
      return;
    }
    this.isDisableBtn = false;
    this.utility.showLoading();
    const saveMethod = this.OfferService.approveDenialRequest(
      this.transferDenialForm.value
    );
    saveMethod.then(
      (res) => {
        if (res['Success']) {
          this.utility.hideLoading();
          this.utility.showSuccessToast(Constants.TRANSFER_REQUEST_DENY_MSG);
          this.close.emit(true);
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
