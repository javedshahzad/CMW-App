import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimeoffRequestDetailPageRoutingModule } from './timeoff-request-detail-routing.module';

import { TimeoffRequestDetailPage } from './timeoff-request-detail.page';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimeoffRequestDetailPageRoutingModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  declarations: [TimeoffRequestDetailPage]
})
export class TimeoffRequestDetailPageModule {}
