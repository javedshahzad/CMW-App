import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import { Router } from '@angular/router'
import { environment } from '../../../environments/environment';
import { API } from '../../routes/api-routes';
import { ApiService } from '../api/api.service';
import { Constants } from 'src/app/constant/constants';



@Injectable({
  providedIn: 'root'
})
export class AuthService {
URL = environment.APP_URL;
  constructor(private http: HttpClient, private router: Router,private apiService:ApiService) { }

  get role(): number {
    return Number(localStorage.getItem(Constants.ROLE));
  }
  login(params) {
    if(localStorage.getItem(Constants.API_URL)){
       this.URL= localStorage.getItem(Constants.API_URL)
    }
    const headers = new HttpHeaders()
      .set('Content-Type', 'application/x-www-form-urlencoded');
    return this.http.post(`${this.URL}${API.LOGIN_ROUTES.login}`, params, { headers: headers }).toPromise();
  }

  getUserData() {
    return this.apiService.get(`${API.LOGIN_ROUTES.userData}`, true,true);
  }

  
  hasUserNameEmployeeIdExists(companyId, isUser, userName, employeeId) {
    return this.apiService.get(`${API.SIGN_UP_ROUTES.isUserAuthenticate}?companyId=${companyId}&isUser=${isUser}&userName=${userName}&employeeId=${employeeId}`, false);
  }

  signUp(params) {
    return this.apiService.post(`${API.SIGN_UP_ROUTES.signUp}`, params, false);
  }

  
  getConfiguration() {
    return this.apiService.get(`${API.SIGN_UP_ROUTES.getConfiguration}`, false,true);
  }

  addDeviceInfo(params){
    return this.apiService.post(`${API.SIGN_UP_ROUTES.addDeviceInfo}`, params , true);
  }

  loginAsUser(userId) {
    return this.apiService.get(`${API.LOGIN_ROUTES.loginAsUser}?userId=${userId}`, true, true);
  }
}