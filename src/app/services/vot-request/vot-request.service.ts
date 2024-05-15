import { Injectable } from '@angular/core';
import { Constants } from 'src/app/constant/constants';
import { API } from 'src/app/routes/api-routes';
import { ApiService } from '../api/api.service';

@Injectable({
  providedIn: 'root'
})
export class VotRequestService {

  constructor(public apiService:ApiService) { }
  getVotRequestList(currentPage, rowsOnPage) {
    return this.apiService.get(
      `${API.VOT_REQUEST_ROUTES.getVotRequest}?page=` +
      currentPage + `&pageSize=${rowsOnPage}`,
      true,
      true,
    );
  } 
  closedVotOfferDataFilter(data) {
    return this.apiService.post(`${API.VOT_REQUEST_ROUTES.closedVotDataFilter}`, data, true);
  }
  getVotClosedRequestedOfferList(currentPage, rowsOnPage) {
    return this.apiService.get(
      `${API.VOT_REQUEST_ROUTES.getClosedVotRequestOffer}?companyId=${localStorage.getItem(Constants.COMPANYID)}&page=` +
      currentPage + `&pageSize=${rowsOnPage}`,
      true,
      true,
    );
  }
  votRequestOfferDataFilter(data) { //dataFilter
    return this.apiService.post(`${API.VOT_REQUEST_ROUTES.votRequestOfferDataFilter}`, data, true);
  }
  getSelectedVotHours(ids) {
    return this.apiService.post(`${API.VOT_REQUEST_ROUTES.getVotHours}`, ids, true);
  }

  approveVotOffer(Ids) {
    return this.apiService.put(`${API.VOT_REQUEST_ROUTES.approveVotOffer}`, Ids, true);
  }

  rejectVotOffer(Ids) {
    return this.apiService.put(`${API.VOT_REQUEST_ROUTES.rejectVotOffer}`, Ids, true);
  }

}
