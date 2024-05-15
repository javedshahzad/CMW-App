import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClockInOutRequestPageRoutingModule } from './clock-in-out-request-routing.module';

import { ClockInOutRequestPage } from './clock-in-out-request.page';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClockInOutRequestPageRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [ClockInOutRequestPage]
})
export class ClockInOutRequestPageModule {}
