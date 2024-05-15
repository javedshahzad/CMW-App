import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EarlygoRequestDetailPageRoutingModule } from './earlygo-request-detail-routing.module';

import { EarlygoRequestDetailPage } from './earlygo-request-detail.page';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EarlygoRequestDetailPageRoutingModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  declarations: [EarlygoRequestDetailPage]
})
export class EarlygoRequestDetailPageModule {}
