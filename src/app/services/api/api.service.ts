import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Constants } from '../../constant/constants';
import { map } from 'rxjs/operators';
import { UtilityService } from '../utility/utility.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  URL = environment.APP_URL;

  constructor(
    private utility: UtilityService,
    private http: HttpClient,
    private router: Router
  ) {
    if (localStorage.getItem(Constants.API_URL)) {
      this.URL = localStorage.getItem(Constants.API_URL);
    }
  }

  async getHeaders(tokenRequired, formData?) {
    const token: string = localStorage.getItem(Constants.TOKEN);
    if (tokenRequired) {
      const headers = new HttpHeaders()
        .set('authorization', 'bearer ' + token)
        .set('Content-Type', 'application/json');
      headers.set('Access-Control-Allow-Origin', '*');
      //headers.set("Access-Control-Allow-Methods", "GET, POST, DELETE, PUT");
      headers.set(
        'Access-Control-Allow-Headers',
        'X-Requested-With,content-type'
      );
      return headers;
    } else if (formData) {
      const headers = new HttpHeaders().set('authorization', 'bearer ' + token);
      return headers;
    } else {
      const headers = new HttpHeaders().set('Content-Type', 'application/json');
      return headers;
    }
  }

  async get(path: any, authorize, loaderContinue?, showLoadder = true) {
    return new Promise(async (resolve, _) => {
      const success = (res) => {
        // toaster success message
        this.showToastrMsg(res);
        if (loaderContinue) {
          //this.utility.hideLoading();
        }
        resolve(res);
      };
      const error = (err) => {
        return this.handleError(err);
      };
      if (localStorage.getItem(Constants.API_URL)) {
        this.URL = localStorage.getItem(Constants.API_URL);
      }
      if (path.includes('Pricing/GetTerms?TermsType=')) {
        this.URL = environment.APP_URL;
      }
      const netowrkIsConnected = await this.getNetworkConnection();
      if (netowrkIsConnected) {
        if (loaderContinue && showLoadder) {
          // this.utility.showLoading();
        }
        if (!loaderContinue && showLoadder) {
          //  this.utility.showLoading();
        }
        const headers = await this.getHeaders(authorize, false);
        return this.http
          .get(`${this.URL}${path}`, { headers })
          .pipe(map((res) => res))
          .subscribe(success, error);
      } else {
        //this.utility.hideLoading();
        this.utility.showErrorToast(Constants.NO_INTERNET_CONNECTION_MSG);
      }
    });
  }

  async post(path: any, obj: any, authorize) {
    return new Promise(async (resolve, _) => {
      const success = (res) => {
        this.showToastrMsg(res);
        //this.utility.hideLoading();
        resolve(res);
      };
      const error = (err) => {
        return this.handleError(err);
      };
      if (localStorage.getItem(Constants.API_URL)) {
        this.URL = localStorage.getItem(Constants.API_URL);
      }
      const netowrkIsConnected = await this.getNetworkConnection();
      if (netowrkIsConnected) {
        // this.utility.showLoading();
        const headers = await this.getHeaders(authorize, false);
        return this.http
          .post<any>(`${this.URL}${path}`, obj, { headers })
          .pipe(map((res) => res))
          .subscribe(success, error);
      } else {
        // this.utility.hideLoading();
        this.utility.showErrorToast(Constants.NO_INTERNET_CONNECTION_MSG);
      }
    });
  }

  async delete(path: any, authorize) {
    return new Promise(async (resolve, _) => {
      const success = (res) => {
        // toaster success message
        this.showToastrMsg(res);
        // this.utility.hideLoading();
        resolve(res);
      };
      const error = (err) => {
        return this.handleError(err);
      };
      if (localStorage.getItem(Constants.API_URL)) {
        this.URL = localStorage.getItem(Constants.API_URL);
      }
      const netowrkIsConnected = await this.getNetworkConnection();
      if (netowrkIsConnected) {
        //this.utility.showLoading();
        const headers = await this.getHeaders(authorize, false);
        return this.http
          .delete(`${this.URL}${path}`, { headers })
          .subscribe(success, error);
      } else {
        //this.utility.hideLoading();
        this.utility.showErrorToast(Constants.NO_INTERNET_CONNECTION_MSG);
      }
    });
  }
  async put(path: any, obj: any, authorize) {
    return new Promise(async (resolve) => {
      const success = (res) => {
        this.showToastrMsg(res);
        // this.utility.hideLoading();
        resolve(res);
      };
      const error = (err) => {
        return this.handleError(err);
      };
      if (localStorage.getItem(Constants.API_URL)) {
        this.URL = localStorage.getItem(Constants.API_URL);
      }
      const netowrkIsConnected = await this.getNetworkConnection();
      if (netowrkIsConnected) {
        //this.utility.showLoading();
        const headers = await this.getHeaders(authorize, false);
        return this.http
          .put<any>(`${this.URL}${path}`, obj, { headers })
          .pipe(map((res) => res))
          .subscribe(success, error);
      } else {
        // this.utility.hideLoading();
        this.utility.showErrorToast(Constants.NO_INTERNET_CONNECTION_MSG);
      }
    });
  }

  showToastrMsg(res) {
    if (res) {
      const msg = res.message || res.msg || (res.result && res.result.msg);
      if (msg) {
        this.utility.showSuccessToast(msg);
      }
    }
  }

  getNetworkConnection() {
    const isOnline: boolean = navigator.onLine;
    if (isOnline) {
      return true;
    }
    return false;
  }

  handleError(err) {
    if (err.status === 400) {
      const error =
        err.error.error || err.error.message
          ? err.error.error || err.error.message
          : 'Internal Server Error';
      this.utility.showErrorToast(error);
      // this.utility.hideLoading();
    } else if (err.status === 401) {
      const error = err.error.error ? err.error.error : 'Session Expired';
      this.utility.showErrorToast(error);
      this.getAndSetStorage();
      this.utility.hideLoading();

      this.router.navigate(['/login'], {queryParams: {session: "invalid"}});
    } else if (err.status === 403) {
      const error = err.error.error ? err.error.error : 'Insufficient Rights';
      this.utility.showErrorToast(error);
      this.getAndSetStorage();
      this.router.navigate(['/login']);
    } else if (err.status === 404) {
      const error = err.error.error ? err.error.error : 'Internal Server Error';
      this.utility.showErrorToast(error);
      // this.utility.hideLoading();
    } else if (err.status === 500) {
      const error = err.error.error ? err.error.error : 'Internal Server Error';
      this.utility.showErrorToast(error);
      //this.utility.hideLoading();
    } else {
      // this.utility.hideLoading();
    }
  }

  getAndSetStorage() {
    let company = localStorage.getItem(Constants.COMPANY_NAME);
    let userRoleId = localStorage.getItem('roleId');
    let roleId = localStorage.getItem(Constants.ROLE);
    let identifier = localStorage.getItem(Constants.IDENTIFIER);
    let _deviceToken = localStorage.getItem(Constants.DEVICETOKEN);
    let identifierUser = localStorage.getItem('identifierUser');
    let _deviceType = localStorage.getItem(Constants.DEVICETYPE);
    let userName = localStorage.getItem(Constants.USERNAME);
    let password = localStorage.getItem('password');
    let configuredUserName = localStorage.getItem("configuredUserName");
    localStorage.clear();
    localStorage.setItem(Constants.COMPANY_NAME, company);
    localStorage.setItem('roleId', userRoleId);
    localStorage.setItem(Constants.ROLE, roleId);
    localStorage.setItem(Constants.IDENTIFIER, identifier);
    localStorage.setItem('identifierUser', identifierUser);
    localStorage.setItem(Constants.DEVICETOKEN, _deviceToken);
    localStorage.setItem(Constants.DEVICETYPE, _deviceType);
    localStorage.setItem(Constants.USERNAME, userName);
    if(!!configuredUserName || configuredUserName !== 'null'){
      localStorage.setItem('configuredUserName',configuredUserName);
    }
    if(!!password || password !== 'null'){
      localStorage.setItem('password', password);
    }
  }
}
