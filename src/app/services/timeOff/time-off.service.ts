import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { API } from '../../routes/api-routes';

@Injectable({
  providedIn: 'root'
})
export class TimeOffService {

  constructor(public apiService:ApiService) { }

  getTimeOffUser(currentPage, userName) {
    return this.apiService.get(
      `${API.TIME_OFF_USER.timeOffGetAllUser}?userName=` +
        userName +
        `&page=` +
        currentPage,
      true,
      true
    );
  }
  getTimeOff(currentPage, companyId) {
    return this.apiService.get(
      `${API.TIME_OFF_CONFIG.timeOffGetAll}?companyId=` +
        companyId +
        `&page=` +
        currentPage +
        `&pageSize=10`,
      true,
      true
    );
  }
  deleteTimeOffRequest(id) {
    return this.apiService.delete(
      `${API.TIME_OFF_USER.deleteTimeOffRequest}?id=${id}`,
      true
    );
  }
  updateTimeOffRequest(params) {
    return this.apiService.put(
      `${API.TIME_OFF_USER.editTimeOffRequest}`,
      params,
      true
    );
  }

  addTimeOffRequest(params) {
    return this.apiService.post(
      `${API.TIME_OFF_USER.addTimeOffRequest}`,
      params,
      true
    );
  }

  GetAllConfigForUser(){
  return this.apiService.get(
    `${API.TIME_OFF_CONFIG.timeOffGetAllForUser}`,
    true,
    true
  );
}
getUserRequestFilterData(data) {
  return this.apiService.post(
    `${API.TIME_OFF_USER.userDataFilter}`,
    data,
    true
  );
}

getTimeOffConfigTypelist(){
  return this.apiService.get(
    `${API.TIME_OFF_CONFIG.timeOffConfigTypesList}`,
    true,
    true
  );
}
getHrUserList(userId, currentPage, pagesize) {
  return this.apiService.get(
    `${API.TIME_OFF_HR_REQUESTS.gethrUserRequests}?userId=` +
      userId +
      `&page=` +
      currentPage +
      `&pageSize=` +
      pagesize,
    true,
    true
  );
}

getTimeOffBank() {
  return this.apiService.get(
    `${API.TIME_OFF_CONFIG.timeOffBank}`,
  true,
  true
);
}

GetTimeOutCalender(startDate,endTime) {
  return this.apiService.get(
    `${API.TIME_OFF_CONFIG.timeOffBankCalendar}?startDate=` +
    startDate +
      `&endTime=` +
      endTime,
    true,
    true
  );
}
}
