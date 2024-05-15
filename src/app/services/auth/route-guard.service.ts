import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { defaultRoutes } from './default-routes';
import { AuthService } from './auth.service';

@Injectable()
export class RouteGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {
  }

  canActivate(route: ActivatedRouteSnapshot): boolean {
    if (route.data.role.indexOf(this.authService.role) === -1) {
      this.router.navigate([defaultRoutes[this.authService.role]]);
      return false;
    }
    return true;
  }
}
