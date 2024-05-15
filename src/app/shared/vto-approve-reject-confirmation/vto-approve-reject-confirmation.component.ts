import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { Constants } from 'src/app/constant/constants';
import { VtoService } from 'src/app/services/vto/vto.service';

@Component({
  selector: 'app-vto-approve-reject-confirmation',
  templateUrl: './vto-approve-reject-confirmation.component.html',
  styleUrls: ['./vto-approve-reject-confirmation.component.scss'],
})
export class VtoApproveRejectConfirmationComponent implements OnInit {
  @Input() type: string;
  @Input() selectedRecords: string[];
  @Output() close = new EventEmitter<boolean>();
  requestData: any;
  isDisableBtn = true;
  constructor(
    private utilityService: UtilityService,
    private vtoService: VtoService
  ) {}

  ngOnInit() {}

  cancel() {
    this.close.emit(false);
  }

  approveRejectVot() {
    // const postMethod = this.type === 'approved' ? this.votRequestService.approveVotOffer(this.selectedRecords)
    //   :
    this.isDisableBtn = false;
    this.utilityService.showLoading();
    this.vtoService.processVtoRequest(this.selectedRecords).then(
      (response) => {
        if (response['Success']) {
          this.utilityService.hideLoading();
          this.utilityService.showSuccessToast(
            Constants.VTO_REQUEST_PROCESS_SUCCESS_MSG
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
