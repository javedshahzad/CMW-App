import { Injectable } from '@angular/core';
import { Constants } from 'src/app/constant/constants';
import { API } from 'src/app/routes/api-routes';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class CallInRequestService {

  constructor(public apiService:ApiService) { }
  getSettingByCompanyID(OfferType, companyId,isLoader?) {
    return this.apiService.get(
      `${API.CALL_OFF_REQUEST.getSettingByCompanyID}?companyId=` + companyId
      + `&OfferType=` + OfferType,
      true,
      true,
      isLoader
    );
  }

  getReasonsByType() {
    return this.apiService.get(
      `${API.CALL_OFF_REQUEST.callOffReasons}?reasonType=1`,
      true,
      true,
    );
  }

  logCallOffRequest(offerType,message){
    return this.apiService.post(
      `${API.OFFER_LOG.OfferLogEntry}?offerType=${offerType}&message=${message}`,
      null,
      true,
    );
  }

  addCallOffRequestOffer(params) {
    return this.apiService.post(`${API.CALL_OFF_REQUEST.addCallOff}`, params, true);
  }

  updateCallOffRequestOffer(params) {
    return this.apiService.put(`${API.CALL_OFF_REQUEST.editCallOff}`, params, true);
  }

  checkMonthlyCallOffRequest(startdate, Enddate, offerId) {
    return this.apiService.post(`${API.CALL_OFF_REQUEST.checkMonthlyCallOffRequest}?startdate=${startdate}&Enddate=${Enddate}&offerId=${offerId}`
      ,[6,7]
      , true);
  }
  getCallOffRequestList(currentPage, rowsOnPage) {
    return this.apiService.get(
      `${API.CALL_OFF_REQUEST.getUserList}?page=` +
      currentPage + `&pageSize=${rowsOnPage}`,
      true,
      true,
    );
  }
  GetCallOffListForManager(currentPage, rowsOnPage) {
    return this.apiService.get(
      `${API.CALL_OFF_REQUEST.getCallOffListForManager}?companyId=${localStorage.getItem(Constants.COMPANYID)}&page=` +
      currentPage + `&pageSize=${rowsOnPage}`,
      true,
      true,
    );
  }
  userCallOffRequestsDataFilter(data) {
    return this.apiService.post(`${API.CALL_OFF_REQUEST.userDataFilter}`, data, true);
  }
  managerCallOffOfferDataFilter(data) {
    return this.apiService.post(`${API.CALL_OFF_REQUEST.managerCallOffOfferDataFilter}`, data, true);
  }

  getSettingType(currentPage,companyId) {
    return this.apiService.get(
      `${API.SETTING_ROUTES.getSetting}?companyId=` + companyId
      + `&page=` + currentPage,
      true,
      true,
    );
  }

  getTermsConditionListByCompanyId(companyId, currentPage) {
    return this.apiService.get(
      `${API.TERMS_CONDITION_ROUTES.getTermsConditionByCompany}?companyid=${companyId}&page=${currentPage}`,
      true,
      true,
    );
  }
  getUserData() {
    return this.apiService.get(`${API.LOGIN_ROUTES.userData}`, true,true);
  }
  approveCallOffOffer(data) {
    return this.apiService.post(`${API.CALL_OFF_REQUEST.approveCallOffOffer}`, data, true);
  }
}
