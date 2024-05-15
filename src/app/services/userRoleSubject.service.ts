import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class userRoleSubject {
  private userRole: BehaviorSubject<Number> = new BehaviorSubject(null);
  getUserRole(): Observable<Number> {
    return this.userRole.asObservable();
  }
  setUserRole(userRole: Number) {
    console.log('userRole', userRole);
    this.userRole.next(userRole);
  }
}
