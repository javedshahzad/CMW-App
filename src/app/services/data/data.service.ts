import { Injectable } from '@angular/core';
 
@Injectable({
  providedIn: 'root'
})
export class DataService {
 
  private dtldata : any= {};
 
  constructor() { }
 
  setData(data) {
    this.dtldata = data;
  }
 
  getData() {
    return this.dtldata;
  }
}