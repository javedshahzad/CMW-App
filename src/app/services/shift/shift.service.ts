import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { API } from '../../routes/api-routes';
import { Constants } from '../../constant/constants';

@Injectable({
  providedIn: 'root',
})
export class ShiftService {
  constructor(private apiService: ApiService) {}

  getShiftListByCompanyId(currentPage, companyId) {
    return this.apiService.get(
      `${API.SHIFT_ROUTES.getShiftByCompany}?companyId=` +
        companyId +
        `&page=` +
        currentPage,
      false,
      true
    );
  }

  getShiftListByWorkDate(skipDate, workDate, departmentId) {
    return this.apiService.get(
      `${API.SHIFT_ROUTES.getShiftByDate}?dateToSkip=${skipDate}&dateToWork=${workDate}&department=${departmentId}`,
      true,
      true
    );
  }

  getShiftListByDepartment(departmentId) {
    return this.apiService.get(
      `${API.SHIFT_ROUTES.getShiftByDepartment}?department=` + departmentId,
      true,
      true
    );
  }

  getShiftListBySkipDate(skipDate, departmentId) {
    return this.apiService.get(
      `${API.SHIFT_ROUTES.getSkipShiftByDate}?dateToSkip=${skipDate}&department=${departmentId}`,
      true,
      true
    );
  }

  getShiftDetails(id) {
    return this.apiService.get(`${API.SHIFT_ROUTES.shift}/` + id, true, true);
  }

  getTimeByShiftDateTime(date, shift, time) {
    return this.apiService.get(
      `${API.SHIFT_ROUTES.getTimeByShiftDateTime}?shiftId=${shift}&date=${date}&timeId=${time}`,
      true,
      true
    );
  }

  getStartEndTimeByShift(shift) {
    return this.apiService.get(
      `${API.SHIFT_ROUTES.getStartEndTimeByShift}?shiftId=${shift}`,
      true,
      true
    );
  }

  getShiftDetailsVot(date, shiftId) {
    return this.apiService.get(
      `${API.SHIFT_ROUTES.getShiftDetailsVot}?date=${date}&shiftId=${shiftId}`,
      true,
      true
    );
  }

  getShiftListByUserId(shiftId) {
    return this.apiService.get(
      `${API.SHIFT_ROUTES.getShiftByUser}?id=${shiftId}`,
      true,
      true
    );
  }
}
