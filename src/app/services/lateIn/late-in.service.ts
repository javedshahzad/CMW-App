import { Injectable } from '@angular/core';
import { Constants } from 'src/app/constant/constants';
import { API } from 'src/app/routes/api-routes';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class LateInService {

  constructor(public apiService:ApiService) { }

  checkWeeklyCallOffRequest(startdate, Enddate, offerId) {
    return this.apiService.post(`${API.CALL_OFF_REQUEST.checkMonthlyCallOffRequest}?startdate=${startdate}&Enddate=${Enddate}&offerId=${offerId}&offerType=${7}`
      , [6,7]
      , true);
  }
  cancelLateInUserRequest(offerType,message) {
    return this.apiService.post(
      `${API.OFFER_LOG.OfferLogEntry}?offerType=${offerType}&message=${message}`,
      null,
      true,
    );
  }
  addLateInRequest(data) {
    return this.apiService.post(
      `${API.LATE_IN_REQUEST.addLateInRequest}`,
      data,
      true,
    );
  }

  getReasons() {
    return this.apiService.get(
      `${API.CALL_OFF_REQUEST.callOffReasons}?reasonType=2`,
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
  getLateInRequestList(currentPage, rowsOnPage) {
    return this.apiService.get(
      `${API.LATE_IN_REQUEST.getUserLateInRequestList}?page=` +
      currentPage + `&pageSize=${rowsOnPage}`,
      true,
      true,
    );
  }
  updateLateInRequestOffer(params) {
    return this.apiService.put(`${API.LATE_IN_REQUEST.updateLateInRequest}`, params, true);
  }
  getSettingType(currentPage) {
    return this.apiService.get(
      `${API.LATE_IN_REQUEST.settingType}?companyId=${localStorage.getItem(Constants.COMPANYID)}&page=` +
      currentPage,
      true,
      true,
    );
  }
  getUserRequestFilterData(data) {
    return this.apiService.post(`${API.LATE_IN_REQUEST.userDataFilter}`, data, true);
  }
  getLateInClosedManagerRequestList(currentPage, rowsOnPage) {
    return this.apiService.get(
      `${API.LATE_IN_REQUEST.closedManagerLateInOffers}?companyId=${localStorage.getItem(Constants.COMPANYID)}&page=` +
      currentPage + `&pageSize=${rowsOnPage}`,
      true,
      true,
    );
  }
  proceedHroffer(offer) {
    return this.apiService.put(
      `${API.LATE_IN_REQUEST.proceedHroffer}`,
      offer,
      true,
    );
  }
}
