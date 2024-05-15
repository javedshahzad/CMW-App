import { Injectable } from '@angular/core';
import { API } from 'src/app/routes/api-routes';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class FlexRequestService {

  constructor(public apiService:ApiService) { }
  getAvailableFlexRequestList(currentPage, rowsOnPage, companyId) {
    return this.apiService.get(
      `${API.FLEX_REQUEST_ROUTES.availableFlexRequest}?page=` +
      currentPage + `&pageSize=${rowsOnPage}&companyId=${companyId}`,
      true,
      true,
    );
  }
  getHrAdminAvailableFlexRequestList(currentPage, rowsOnPage, date) {
    return this.apiService.get(
      `${API.FLEX_REQUEST_ROUTES.availableHrAdminFlexOffers}?page=` +
      currentPage + `&pageSize=${rowsOnPage}&date=${date}`,
      true,
      true,
    );
  }
  flexHrAdminrAvailableRequestDataFilter(data, date) { //dataFilter
    return this.apiService.post(`${API.FLEX_REQUEST_ROUTES.flexHrAdminAvailableRequestDataFilter}?date=${date}`, data, true);
  }
  flexAvailableRequestOfferDataFilter(data) { //dataFilter
    return this.apiService.post(`${API.FLEX_REQUEST_ROUTES.availableFlexOfferDataFilter}`, data, true);
  }
  getMyFlexRequestList(currentPage, rowsOnPage, date) {
    return this.apiService.get(
      `${API.FLEX_REQUEST_ROUTES.getFlexRequest}?page=` +
      currentPage + `&pageSize=${rowsOnPage}&date=${date}`,
      true,
      true,
    );
  }
  acceptFlexOffer(Id) {
    return this.apiService.put(`${API.FLEX_REQUEST_ROUTES.acceptFlexOffer}?offerID=${Id}`, null, true);
  }
  flexRequestOfferDataFilter(data, date) { //dataFilter
    return this.apiService.post(`${API.FLEX_REQUEST_ROUTES.flexRequestOfferDataFilter}?date=${date}`, data, true);
  }
  processFlexRequest(ids) {
    return this.apiService.put(`${API.FLEX_REQUEST_ROUTES.processFlexRequest}`, ids, true);
  }
}
