import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { API } from '../../routes/api-routes';
import { Constants } from '../../constant/constants';

@Injectable({
  providedIn: 'root'
})
export class AddRequestSwapService {

  constructor(private apiService: ApiService) { }

  addOffer(params) {
    return this.apiService.post(`${API.OFFER_ROUTES.addOffer}`, params, true);
  }

  updateOffer(params) {
    return this.apiService.put(`${API.OFFER_ROUTES.updateOffer}`, params, true);
  }

  hasPendingRequest(userId) {
    return this.apiService.get(
      `${API.OFFER_ROUTES.pendingRequest}?userId=${userId}`,
      true,
      true,
    );
  }

  deleteOfferForUser(Id) {
    return this.apiService.delete(
      `${API.OFFER_ROUTES.deleteOfferUser}?id=${Id}&deletedBy=` + localStorage.getItem(Constants.USERID),
      true,
    );
  }
  
}
