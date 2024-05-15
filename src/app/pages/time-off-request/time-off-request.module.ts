import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimeOffRequestPageRoutingModule } from './time-off-request-routing.module';

import { TimeOffRequestPage } from './time-off-request.page';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimeOffRequestPageRoutingModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  declarations: [TimeOffRequestPage]
})
export class TimeOffRequestPageModule {}
