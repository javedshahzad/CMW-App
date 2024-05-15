import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { API } from '../../routes/api-routes';
import { Constants } from '../../constant/constants';

@Injectable({
  providedIn: 'root'
})
export class OfferService {

  constructor(private apiService: ApiService) { }

  getAvailableOfferList(currentPage) {
    return this.apiService.get(
      `${API.OFFER_ROUTES.availableOffer}?companyId=${localStorage.getItem(Constants.COMPANYID)}&page=` +
      currentPage,
      true,
      true,
    );
  }

  getMyOfferList(currentPage) {
    return this.apiService.get(
      `${API.OFFER_ROUTES.getMyOffers}?page=` +
      currentPage,
      true,
      true,
    );
  }

  availableOfferDataFilter(data) { //dataFilter
    return this.apiService.post(`${API.OFFER_ROUTES.availableOfferDataFilter}`, data, true);
  }

  myRequestOfferDataFilter(data) { //dataFilter
    return this.apiService.post(`${API.OFFER_ROUTES.myRequestOfferDataFilter}`, data, true);
  }
  
  deleteOffer(Id) {
    return this.apiService.delete(
      `${API.OFFER_ROUTES.deleteOffer}${Id}?deletedBy=` + localStorage.getItem(Constants.USERID),
      true,
    );
  }

  getShiftWorkingDetails(date) {
    return this.apiService.get(
      `${API.OFFER_ROUTES.getShiftWorkingDetails}?date=${date}`,
      true,
      true,
    );
  }
  
  acceptOffer(Id) {
    return this.apiService.put(`${API.OFFER_ROUTES.acceptOffer}?offerID=${Id}&acceptedBy=${localStorage.getItem(Constants.USERID)}`, null, true);
  }

  getAllModuleCloseList(currentPage, offerTypeEnum) {
    return this.apiService.get(
      `${API.OFFER_ROUTES.getAllModuleCloseList}?offerTypeEnum=` +
      offerTypeEnum +
        `&page=` +
        currentPage,
      true,
      true
    );
  }


  getAllModulePendingList(currentPage, offerTypeEnum) {
    return this.apiService.get(
      `${API.OFFER_ROUTES.getAllModulePendingList}?offerTypeEnum=` +
      offerTypeEnum +
        `&page=` +
        currentPage,
      true,
      true
    );
  }

  approveOffer(Id) {
    return this.apiService.put(`${API.OFFER_ROUTES.approveOffer}?offerID=${Id}&approvedBy=${localStorage.getItem(Constants.USERID)}`, null, true);
  }

  rejectOffer(Id) {
    return this.apiService.put(`${API.OFFER_ROUTES.rejectOffer}?offerID=${Id}&rejectedBy=${localStorage.getItem(Constants.USERID)}`, null, true);
  }

  approvedDeniedUserRequests(ids, isApproved) {
    return this.apiService.put(
      `${API.TIME_OFF_HR_REQUESTS.approveDeniedUserRequest}?isApproved=` +
        isApproved,
      ids,
      true
    );
  }

  approvedDeniedPunchHrRequests(timePunchId, status) {
    return this.apiService.post(
      `${API.TIME_PUNCH.approveRejectTimePuncheEditRequest}?id=${timePunchId}&status=` +
        status,
      true,
      true
    );
  }
  approveDenialRequest(params) {
    return this.apiService.post(`${API.TRANSFER_REQUEST_ROUTES.approveDenialRequest}`, params, true);
  }
  approveTransferRequest(params) {
    return this.apiService.post(`${API.TRANSFER_REQUEST_ROUTES.approveTransferRequest}`, params, true);
  }
  TransferProcessOffer(data) {
    return this.apiService.put(`${API.TRANSFER_REQUEST_ROUTES.transferProcessRequest}`, data, true);
  }
  pendingApprovalRequestDataFilter(data,offerTypeEnum) { //dataFilter
    return this.apiService.post(`${API.OFFER_ROUTES.pendingApprovalRequestDataFilter}?offerTypeEnum=` +
    offerTypeEnum , data, true);
  }
  closeApprovalRequestDataFilter(data,offerTypeEnum) { //dataFilter
    return this.apiService.post(`${API.OFFER_ROUTES.closeListFilterData}?offerTypeEnum=` +
    offerTypeEnum , data, true);
  }
  hrAdminCalendarView(statusType, offerTypeEnum, dateTime,startDate,endDate) {
    return this.apiService.get(
      `${API.OFFER_ROUTES.hrAdminCalendarView}?offerTypeEnum=` +
      offerTypeEnum +
        `&statusType=` +
        statusType +
        `&selectedDate=` +
        dateTime +
        `&startDate=${startDate}&endDate=${endDate}`,
      true,
      true
    );
  }

  userAddRequest(data) {
    return this.apiService.post(
      `${API.TIME_PUNCH.userAddRequest}`,
      data,
      true
    );
  }

  userEditRequest(data) {
    return this.apiService.post(
      `${API.TIME_PUNCH.editUserRequest}`,
      data,
      true
    );
  }

  userEditedRequests(currentPage) {
    return this.apiService.get(
      `${API.TIME_PUNCH.getUserRequest}?page=${currentPage}`,
      true,
      true
    );
  }

  userEditedDataFilter(data) {
    return this.apiService.post(`${API.TIME_PUNCH.getUserRequestDataFilter}`, data, true);
  }

  removeTimePunchRequest(timePunchId) {
    return this.apiService.delete(
      `${API.CLOCK_IN_OUT_REQUEST.removeTimePunchRequest}?timePunchId=${timePunchId}`,
      true
    );
  }

}
