import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CallinRequestDetailPageRoutingModule } from './callin-request-detail-routing.module';

import { CallinRequestDetailPage } from './callin-request-detail.page';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CallinRequestDetailPageRoutingModule,
    BsDatepickerModule.forRoot()
  ],
  declarations: [CallinRequestDetailPage]
})
export class CallinRequestDetailPageModule {}
