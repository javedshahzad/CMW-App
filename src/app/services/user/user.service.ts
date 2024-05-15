import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { API } from '../../routes/api-routes';
import { Constants } from '../../constant/constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private apiService: ApiService) { }

  getUserList(currentPage) {
    return this.apiService.get(
      `${API.USER_ROUTE.getUser}?page=` +
      currentPage,
      true,
      true,
    );
  }

  getUserListByCompanyId(currentPage, companyId) {
    return this.apiService.get(
      `${API.USER_ROUTE.getUserByCompany}?id=` + companyId
      + `&page=` + currentPage,
      true,
      true,
    );
  }

  addUser(params) {
    return this.apiService.post(`${API.USER_ROUTE.addUser}`, params, true);
  }

  updateUser(params) {
    return this.apiService.put(`${API.USER_ROUTE.updateUser}`, params, true);
  }

  getUserDetail() {
    return this.apiService.get(
      `${API.USER_ROUTE.getUser}/${localStorage.getItem(Constants.USERID)}`,
      true,
      true,
    );
  }

  dataFilter(data) { //dataFilter
    return this.apiService.post(`${API.USER_ROUTE.dataFilter}`, data, true);
  }

  allDataFilter(data) { //dataFilter
    return this.apiService.post(`${API.USER_ROUTE.allDataFilter}`, data, true);
  }
  getAllManagerList(roleId, companyId, locationId)
  {
    return this.apiService.get(
      `${API.USER_ROUTE.getAllManagerList}?role=` + roleId + `&locationId=` + locationId + `&companyId=`+ companyId,
      true,);
  }
  logout(userId) {  
    return this.apiService.get(`${API.USER_ROUTE.logout}?userId=${userId}`, true, true);
  }

  addFeedbackRequest(data){
    return this.apiService.post(`${API.FEEDBACK_ROUTES.addFeedbackRequest}`, data, true);
  }
}
