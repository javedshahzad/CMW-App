import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { API } from '../../routes/api-routes';

@Injectable({
  providedIn: 'root'
})
export class TermsConditionService {

  
  constructor(private apiService:ApiService) { }

  getTermsCondition(type) {
    return this.apiService.get(
      `${API.TERMS_CONDITION_ROUTES.getTerms}?TermsType=${type}`,
      true,
      true
    );
  }

  downloadPrivacyPolicy(){
    return this.apiService.get(
      `${API.TERMS_CONDITION_ROUTES.downloadPrivacyPolicy}`,
      true,
      true
    );
  }
  
  getTermsConditionListByCompanyId(companyId, currentPage) {
    return this.apiService.get(
      `${API.TERMS_CONDITION_ROUTES.getTermsConditionByCompany}?companyid=${companyId}&page=${currentPage}`,
      true,
      true,
    );
  }


  

}