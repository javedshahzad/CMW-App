import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LateinRequestDetailPageRoutingModule } from './latein-request-detail-routing.module';

import { LateinRequestDetailPage } from './latein-request-detail.page';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LateinRequestDetailPageRoutingModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  declarations: [LateinRequestDetailPage]
})
export class LateinRequestDetailPageModule {}
