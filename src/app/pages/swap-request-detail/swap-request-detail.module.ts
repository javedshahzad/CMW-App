import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SwapRequestDetailPageRoutingModule } from './swap-request-detail-routing.module';

import { SwapRequestDetailPage } from './swap-request-detail.page';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwapRequestDetailPageRoutingModule,
    BsDatepickerModule.forRoot()
  ],
  declarations: [SwapRequestDetailPage]
})
export class SwapRequestDetailPageModule { }
