import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Constants, typeField } from 'src/app/constant/constants';
import { TermsConditionService } from 'src/app/services/terms-condition/terms-condition.service';
import { UtilityService } from '../../services/utility/utility.service';

@Component({
  selector: 'app-terms-condition',
  templateUrl: './terms-condition.page.html',
  styleUrls: ['./terms-condition.page.scss'],
})
export class TermsConditionPage implements OnInit {
  @Input() offerId: number;
  termsCondition = [];
  termsMsg: string = '';
  companyId: number;

  @Output() acceptOfferId = new EventEmitter<any>();
  @Output() close = new EventEmitter<boolean>();

  constructor(private termsConditionService: TermsConditionService, private modal: ModalController, private utilityService: UtilityService) { }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.companyId = Number(localStorage.getItem(Constants.COMPANYID));
    this.getTermsCondition();
  }

  getTermsCondition() {
    if (!navigator.onLine) {
      return  this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoading();
    this.termsConditionService.getTermsConditionListByCompanyId(this.companyId, null).then(res => {
      if (res['Success']) {
        this.utilityService.hideLoading();
        this.termsCondition = res['Data'];
        const findTerms = this.termsCondition.find(x => x.typeField === typeField[0].id);
        if (!!findTerms) {
          this.termsMsg = findTerms.description;
        }
      }
      else {
        this.utilityService.hideLoading();
        this.termsCondition = [];
      }
    }, err => {
      this.utilityService.hideLoading();
      this.termsCondition = [];
    });
  }

  disAgree() {
    this.modal.dismiss();
  }

  closeModal() {
    this.modal.dismiss();
  }

  agree() {
    this.modal.dismiss(this.offerId);
  }

}
