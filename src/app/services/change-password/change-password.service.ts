import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { API } from '../../routes/api-routes';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService { 
  
  constructor(private apiService: ApiService) { }

  updatePassword(params) {
    return this.apiService.post(`${API.RESET_PASSWORD_ROUTES.resetPassword}`, params, true);
  }

  updatePasswordByMail(params) {
    return this.apiService.post(`${API.RESET_PASSWORD_ROUTES.recoveryPassword}`, params, false);
  }
}
