import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { API } from '../../routes/api-routes';

@Injectable({
  providedIn: 'root'
})
export class VotService {

  constructor(private apiService: ApiService) { }

  addVotRequestOffer(params) {
    return this.apiService.post(`${API.VOT_REQUEST_ROUTES.addVotRequest}`, params, true);
  }

  updateVotRequestOffer(params) {
    return this.apiService.put(`${API.VOT_REQUEST_ROUTES.updateVotRequest}`, params, true);
  }

}
