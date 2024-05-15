import { Injectable } from '@angular/core';
import { Constants } from 'src/app/constant/constants';
import { API } from 'src/app/routes/api-routes';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class EarlyOutService {

  constructor(public apiService:ApiService) { }
  addEarlyOutRequest(data) {
    return this.apiService.post(
      `${API.EARLY_OUT_REQUEST.addEarlyOutRequest}`,
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

  getEarlyOutRequestList(currentPage, rowsOnPage) {
    return this.apiService.get(
      `${API.EARLY_OUT_REQUEST.getUserEarlyOutRequestList}?page=` +
      currentPage + `&pageSize=${rowsOnPage}`,
      true,
      true,
    );
  }
  checkWeeklyCallOffRequest(startdate, Enddate, offerId) {
    return this.apiService.post(`${API.CALL_OFF_REQUEST.checkMonthlyCallOffRequest}?startdate=${startdate}&Enddate=${Enddate}&offerId=${offerId}&offerType=${7}`
      , [6,7]
      , true);
  }
  cancelEarlyOutUserRequest(offerType,message) {
    return this.apiService.post(
      `${API.OFFER_LOG.OfferLogEntry}?offerType=${offerType}&message=${message}`,
      null,
      true,
    );
  }
  updateEarlyOutRequestOffer(params) {
    return this.apiService.put(`${API.EARLY_OUT_REQUEST.updateEarlyOutRequest}`, params, true);
  }
  getEarlyOutClosedManagerRequestList(currentPage, rowsOnPage) {
    return this.apiService.get(
      `${API.EARLY_OUT_REQUEST.closedManagerEarlyOutOffers}?companyId=${localStorage.getItem(Constants.COMPANYID)}&page=` +
      currentPage + `&pageSize=${rowsOnPage}`,
      true,
      true,
    );
  }
  userEarltyOutOfferDataFilter(data) {
    return this.apiService.post(`${API.EARLY_OUT_REQUEST.userDataFilter}`, data, true);
  }
  managerClosedEarltyOutOfferDataFilter(data) {
    return this.apiService.post(`${API.EARLY_OUT_REQUEST.managerClosedEarlyOutDataFilter}`, data, true);
  }

  getSettingType(currentPage) {
    return this.apiService.get(
      `${API.EARLY_OUT_REQUEST.settingType}?companyId=${localStorage.getItem(Constants.COMPANYID)}&page=` +
      currentPage,
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
  proceedHroffer(offer) {
    return this.apiService.put(
      `${API.EARLY_OUT_REQUEST.proceedHroffer}`,
      offer,
      true,
    );
  }
}
