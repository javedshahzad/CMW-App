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
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-transfer-approve-request',
  templateUrl: './transfer-approve-request.component.html',
  styleUrls: ['./transfer-approve-request.component.scss'],
})
export class TransferApproveRequestComponent implements OnInit {
  @Input() offer: Offer;
  public messageList: any = new Offer();
  public transferApproveForm: FormGroup;
  @Output() close = new EventEmitter<boolean>();
  bsConfig = bsConfig;
  today = new Date();
  tomorrow = new Date(this.today);
  nextMinDate = new Date(this.tomorrow.setDate(this.tomorrow.getDate() + 1));
  currentDate: Date;
  disableDaysForDateToWork = [];
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
  cancel() {
    this.close.emit(false);
  }

  async initializeOfferForm() {
    console.log(this.offer.startDate);
    this.transferApproveForm = new FormGroup({
      offerId: new FormControl(!!this.offer ? this.offer.offerId : 0),
      startDate: new FormControl(
        !!this.offer ? this.offer.startDate : null,
        Validators.required
      ),
    });
  }

  initializeMessages() {
    this.messageList.startDate = {
      required:
        Constants.VALIDATION_MSG.TRANSFER_APPROVE_REQUEST.START_DATE_REQUIRED,
    };
  }

  async onSubmit() {
    this.formService.markFormGroupTouched(this.transferApproveForm);
    if (this.transferApproveForm.invalid) {
      return;
    }
    console.log(this.transferApproveForm.controls.startDate.value);
    const startDate = this.datepipe.transform(
      this.setnewDate(this.transferApproveForm.controls.startDate.value),
      'yyyy-MM-dd'
    );
    let obj = {
      offerId: this.transferApproveForm.value.offerId,
      startDate: startDate,
    };
    this.isDisableBtn = false;
    this.utility.showLoading();
    const saveMethod = this.OfferService.approveTransferRequest(obj);
    saveMethod.then(
      (res) => {
        if (res['Success']) {
          this.utility.hideLoading();
          this.utility.showSuccessToast(Constants.TRANSFER_REQUEST_APPROVE_MSG);
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

  skipDateChange(event) {
    if (!!event) {
      const skipDate = this.datepipe.transform(
        this.setnewDate(event),
        'yyyy-MM-dd'
      );
    }
  }

  setnewDate(date) {
    const dateObj = {
      year: +this.datepipe.transform(date, 'yyyy'),
      month: +this.datepipe.transform(date, 'MM'),
      day: +this.datepipe.transform(date, 'dd'),
    };
    return new Date(dateObj['year'], dateObj['month'] - 1, dateObj['day']);

    // return new Date(date)
  }
}
