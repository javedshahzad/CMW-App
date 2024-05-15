import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { FlexRequestService } from 'src/app/services/flexRequest/flex-request.service';
import { Constants } from 'src/app/constant/constants';

@Component({
  selector: 'app-flex-process-confirmation',
  templateUrl: './flex-process-confirmation.component.html',
  styleUrls: ['./flex-process-confirmation.component.scss'],
})
export class FlexProcessConfirmationComponent implements OnInit {
  @Input() selectedRecords: string[];
  @Output() close = new EventEmitter<boolean>();
  requestData: any;
  isDisableBtn = true;
  constructor(
    private utilityService: UtilityService,
    private flexService: FlexRequestService
  ) {}

  ngOnInit() {}

  cancel() {
    this.close.emit(false);
  }

  approveRejectVot() {
    this.isDisableBtn = false;
    this.utilityService.showLoading();
    this.flexService.processFlexRequest(this.selectedRecords).then(
      (response) => {
        if (response['Success']) {
          this.utilityService.hideLoading();
          this.utilityService.showSuccessToast(
            Constants.FLEX_REQUEST_PROCESS_SUCCESS_MSG
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
