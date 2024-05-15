import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { DataService } from '../../services/data/data.service';
 
@Injectable({
  providedIn: 'root'
})
export class DataResolverService implements Resolve<any> {
 
  constructor(private dataService: DataService) { }
 
  resolve(route: ActivatedRouteSnapshot) {
    return this.dataService.getData();
  }
}
