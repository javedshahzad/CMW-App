import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { VotRequestService } from 'src/app/services/vot-request/vot-request.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { Constants } from 'src/app/constant/constants';
import { Offer } from 'src/app/models/offer.model';

@Component({
  selector: 'app-vot-approve-reject-confirmation',
  templateUrl: './vot-approve-reject-confirmation.component.html',
  styleUrls: ['./vot-approve-reject-confirmation.component.scss'],
})
export class VotApproveRejectConfirmationComponent implements OnInit {
  @Input() type: string;
  @Input() Offer: Offer;
  @Input() selectedRecords: string[];
  @Output() close = new EventEmitter<boolean>();
  requestData: any;
  IsCoverageCatch: boolean = false;
  isDisableBtn = true;
  constructor(
    private votRequestService: VotRequestService,
    private utilityService: UtilityService
  ) {}

  ngOnInit() {
    this.IsCoverageCatch =
      localStorage.getItem(Constants.APP_NAME) === 'CoverageCatch'
        ? true
        : false;
    this.getVotRequestHours();
  }

  getVotRequestHours() {
    this.utilityService.showLoading();
    this.votRequestService.getSelectedVotHours(this.selectedRecords).then(
      (response) => {
        if (response['Success']) {
          this.utilityService.hideLoading();
          this.requestData = response['Data'];
        }
      },
      (err) => {
        this.utilityService.hideLoading();
      }
    );
  }

  cancel() {
    this.close.emit(false);
  }

  approveRejectVot() {
    this.isDisableBtn = false;
    this.utilityService.showLoading();
    const postMethod =
      this.type === 'approved'
        ? this.votRequestService.approveVotOffer(this.selectedRecords)
        : this.votRequestService.rejectVotOffer(this.selectedRecords);
    postMethod.then(
      (response) => {
        if (response['Success']) {
          this.utilityService.hideLoading();
          this.type === 'approved'
            ? this.utilityService.showSuccessToast(
                Constants.VOT_REQUEST_APPROVE_MSG
              )
            : this.utilityService.showSuccessToast(
                Constants.VOT_REQUEST_DENIED_MSG
              );
          this.close.emit(true);
        } else {
          this.utilityService.hideLoading();
          this.utilityService.showErrorToast(response['Message']);
        }
      },
      (err) => {
        this.utilityService.hideLoading();
      }
    );
  }
}
