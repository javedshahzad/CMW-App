import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { API } from '../../routes/api-routes';
import { Constants } from 'src/app/constant/constants';

@Injectable({
  providedIn: 'root'
})
export class VtoService {

  constructor(private apiService: ApiService) { }
  acceptVtoRequestOffer(Id){
    return this.apiService.put(`${API.VTO_REQUEST_ROUTES.acceptVtoOffer}?offerID=${Id}`, null, true);
  }


  addVtoRequestOffer(params) {
    return this.apiService.post(`${API.VTO_REQUEST_ROUTES.addVtoRequest}`, params, true);
  }

  updateVtoRequestOffer(params) {
    return this.apiService.put(`${API.VTO_REQUEST_ROUTES.updateVtoRequest}`, params, true);
  }

  getMyVtoRequestList(currentPage, rowsOnPage, date) {
    return this.apiService.get(
      `${API.VTO_REQUEST_ROUTES.getVtoRequest}?page=` +
      currentPage + `&pageSize=${rowsOnPage}&date=${date}`,
      true,
      true,
    );
  }

  getAvailableVtoRequestList(currentPage, rowsOnPage, companyId) {
    return this.apiService.get(
      `${API.VTO_REQUEST_ROUTES.availableVtoRequest}?page=` +
      currentPage + `&pageSize=${rowsOnPage}&companyId=${companyId}`,
      true,
      true,
    );
  }
  
  getManagerAvailableVtoRequestList(currentPage, rowsOnPage, date) {
    return this.apiService.get(
      `${API.VTO_REQUEST_ROUTES.availableManagerVtoOffers}?page=` +
      currentPage + `&pageSize=${rowsOnPage}&date=${date}`,
      true,
      true,
    );
  }
  vtoRequestOfferDataFilter(data, date) { //dataFilter
    return this.apiService.post(`${API.VTO_REQUEST_ROUTES.vtoRequestOfferDataFilter}?date=${date}`, data, true);
  }

  vtoAvailableRequestOfferDataFilter(data) { //dataFilter
    return this.apiService.post(`${API.VTO_REQUEST_ROUTES.availableVtoOfferDataFilter}`, data, true);
  }

  deleteOffer(Id) {
    return this.apiService.delete(
      `${API.OFFER_ROUTES.deleteOffer}${Id}?deletedBy=` + localStorage.getItem(Constants.USERID),
      true,
    );
  }

  processVtoRequest(ids) {
    return this.apiService.put(`${API.VTO_REQUEST_ROUTES.processVtoRequest}`, ids, true);
  }
}
