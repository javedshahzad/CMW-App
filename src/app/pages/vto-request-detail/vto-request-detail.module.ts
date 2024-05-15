import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VtoRequestDetailPageRoutingModule } from './vto-request-detail-routing.module';

import { VtoRequestDetailPage } from './vto-request-detail.page';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VtoRequestDetailPageRoutingModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
  ],
  declarations: [VtoRequestDetailPage]
})
export class VtoRequestDetailPageModule {}
