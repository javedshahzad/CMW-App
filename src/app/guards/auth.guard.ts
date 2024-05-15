import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  UrlTree,
  Router,
} from '@angular/router';
import { Observable } from 'rxjs';
import { Constants, Role } from '../constant/constants';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    let token = localStorage.getItem(Constants.TOKEN);
    let roleId = localStorage.getItem(Constants.ROLE);
    if(token && roleId === Role.hrAdmin.toString()){
      return this.router.navigate(['/tabs/pending-requests']);
    }
    else if (token) {
      console.log('data  role', route?.data?.role);
      console.log('Userrole', roleId);
      if (
        !!route?.data &&
        !!route?.data?.role &&
        route?.data?.role.indexOf(parseInt(roleId)) === -1
      ) {
        window.location.href = this.defualtRoutes(roleId);
        return false;
      }
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }

  defualtRoutes(userRole) {
    console.log("from hereee")
    if (userRole === Role.user.toString()) {
      return '/tabs/my-requests';
    }
  }
}
