import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { API } from '../../routes/api-routes';
import { Constants } from '../../constant/constants';

@Injectable({
  providedIn: 'root'
})
export class LocationService {

  constructor(private apiService: ApiService) { }


  getLocationListByCompany(companyId, currentPage) {
    return this.apiService.get(
      `${API.LOCATION_ROUTES.getLocationByCompany}?companyId=${companyId}&page=${currentPage}`,
      false,
      false,
      false
    );
  }
}
