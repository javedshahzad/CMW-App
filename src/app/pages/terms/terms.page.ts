import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { ModalController, Platform } from '@ionic/angular';
import { TermsConditionService } from '../../services/terms-condition/terms-condition.service';
import { Constants, ContentEnum } from '../../constant/constants';
import { UtilityService } from '../../services/utility/utility.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-terms',
  templateUrl: './terms.page.html',
  styleUrls: ['./terms.page.scss'],
  providers: [TermsConditionService]
})
export class TermsPage implements OnInit {
  @Input() data: any;
  content = '';
  @Input() btnText?= Constants.BTN_TEXT;
  @Input() cancleBtnText?= Constants.CANCLE_BTN_TEXT;
  @Output() closePopup = new EventEmitter<boolean>();
  @Input() isBtnDisplayed = true;
  @Input() title: any;
  @Input() contentType: any
  role: number;
  downloadLink: any;
  type = ContentEnum;
  pdfSrc: any;

  constructor(public modal: ModalController, private termsConditionService: TermsConditionService, private utilityService: UtilityService) { }

  ionViewWillEnter() {
    if (this.contentType === this.type.TNC) {
      this.getTermsAndCondition();
    }

    this.role = Number(localStorage.getItem(Constants.ROLE));
  }

  ngOnInit() {

  }

  agree() {
    this.closePopup.emit(true);
  }

  disAgree() {
    this.closePopup.emit(false);
  }

  getTermsAndCondition() {
    if (!navigator.onLine) {
      return  this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoading();
    this.termsConditionService.getTermsCondition(this.contentType).
      then(response => {
        if (response['Success']) {
          this.utilityService.hideLoading();
          this.content = response['Data'].htmlContent;
          this.downloadLink = response['Data'].pdfLink;
          this.utilityService.hideLoading();
        }
        else {
          this.utilityService.hideLoading();
          this.utilityService.showErrorToast(response['Message']);
        }
      }, err => {
        this.utilityService.hideLoading();
      });
  }

  downloadFile() {
    const a = document.createElement('a');
    a.setAttribute('style', 'display:none;');
    document.body.appendChild(a);
    a.href = environment.BLOB_URL + this.downloadLink;
    a.download = this.downloadLink.split('/')[1];
    a.target = 'blank';
    a.click();
  }

  closeModal() {
    this.modal.dismiss();
  }
}
