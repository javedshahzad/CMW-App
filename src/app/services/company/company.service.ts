import { Injectable } from '@angular/core';
import { API } from '../../routes/api-routes';
import { ApiService } from '../api/api.service';
import { Constants } from '../../constant/constants';



@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private apiService: ApiService) { 

  }

 
  getCompanyListWithOutPagination(isShowLoader = true){
    return this.apiService.get(`${API.COMPANY_ROUTES.company}`, false, true, isShowLoader);
  }

  getUserCompanyList(uname) {
    return this.apiService.get(`${API.COMPANY_ROUTES.getCompany}?username=${uname}`, false, true);
  }
}
