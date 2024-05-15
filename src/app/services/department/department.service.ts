import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { API } from '../../routes/api-routes';
import { Constants } from '../../constant/constants';

@Injectable({
  providedIn: 'root'
})
export class DepartmentService {

  constructor(private apiService: ApiService) { }

  getDepartmentListByCompanyId(currentPage, companyId) {
    return this.apiService.get(
      `${API.DEPARTMENT_ROUTES.getDepartmentByCompany}?companyId=` + companyId
      + `&page=` + currentPage,
      true,
      true,
    );
  }

  getSubDeptByDepartment(departmentId,companyId) {
    return this.apiService.get(
      `${API.SUB_DEPARTMENT_ROUTES.getSubDepartmentByDepartmentId}?departmentId=` + departmentId + `&companyId=` + companyId,
      false,
      true,
    );
  }
}
