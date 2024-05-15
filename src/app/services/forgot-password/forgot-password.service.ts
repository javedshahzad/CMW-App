import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { API } from '../../routes/api-routes';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {

  constructor(private apiService: ApiService) { }


  addEmail(email, isMobile) {
    return this.apiService.post(`${API.FORGOT_PASSWORD_ROUTES.forgotPassword}?email=` + email + `&isMobile=` + isMobile, null, true);
  }
}
