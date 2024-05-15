import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API } from 'src/app/routes/api-routes';
import { Constants } from '../constant/constants';
import { ApiService } from './api/api.service';

@Injectable({
  providedIn: 'root',
})
export class ClockInOutService {
  constructor(public apiService: ApiService, private http: HttpClient) {}

  getClockInOutRequestList(currentPage, userId) {
    return this.apiService.get(
      `${API.CLOCK_IN_OUT_REQUEST.getClockInOut}?userId=` +
        userId +
        `&page=` +
        currentPage,
      true,
      true
    );
  }
  resetIdentity() {
    return this.apiService.get(
      `${API.CLOCK_IN_OUT_REQUEST.resetIdentity}`,
      true,
      true
    );
  }

  getClockInOutPunch(
    UserName,
    SourceType,
    geoLoaction,
    phoneNum,
    identifier,
    punchTime
  ) {
    return this.apiService.get(
      `${API.CLOCK_IN_OUT_REQUEST.getClockInOutPunch}?userName=` +
        UserName +
        `&sourceType=` +
        SourceType +
        `&phoneNum=` +
        phoneNum +
        `&geoLocation=` +
        geoLoaction +
        `&identifier=` +
        identifier +
        `&punchTime=` +
        punchTime,
      true,
      true
    );
  }

  IsDeviceIdentifierExists(identifier) {
    return this.apiService.get(
      `${API.CLOCK_IN_OUT_REQUEST.IsDeviceIdentifierExists}?identifier=` +
        identifier,
      true
    );
  }

  getUserDetail() {
    return this.apiService.get(
      `${API.USER_ROUTE.getUser}/${localStorage.getItem(Constants.USERID)}`,
      true,
      true
    );
  }

  getSettingType() {
    return this.apiService.get(
      `${API.CLOCK_IN_OUT_REQUEST.settingType}?companyId=${localStorage.getItem(
        Constants.COMPANYID
      )}`,
      true,
      true
    );
  }

  userTimePunchesDataFilter(data) {
    //dataFilter
    return this.apiService.post(
      `${API.CLOCK_IN_OUT_REQUEST.timePunchesDataFilter}`,
      data,
      true
    );
  }

  calculateDistants(geoLocation) {
    return this.apiService.get(
      `${API.CLOCK_IN_OUT_REQUEST.calculateDistants}?geoLocation=` +
        geoLocation,
      true
    );
  }

  getUserWeekHours(userId) {
    return this.apiService.get(
      `${API.CLOCK_IN_OUT_REQUEST.getUserWeekHour}?userId=${userId}`,
      true,
      true
    );
  }

  GetUserConfiguration(userId) {
    return this.apiService.get(
      `${API.CLOCK_IN_OUT_REQUEST.GetUserConfiguration}?userId=${userId}`,
      true,
      true
    );
  }

  getPeriodPayloadAPP(
    startDate,
    endDate,
    userId
  ) {
    return this.apiService.get(
      `${API.CLOCK_IN_OUT_REQUEST.getPeriodPayloadAPP}?startDate=` +
      startDate +
        `&endDate=` +
        endDate +
        `&userId=` +
        userId ,
      true,
      true
    );
  }
}
