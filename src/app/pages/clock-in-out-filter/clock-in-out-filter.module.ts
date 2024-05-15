import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClockInOutFilterPageRoutingModule } from './clock-in-out-filter-routing.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { ClockInOutFilterPage } from './clock-in-out-filter.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClockInOutFilterPageRoutingModule,
    BsDatepickerModule.forRoot(),
  ],
  declarations: [ClockInOutFilterPage]
})
export class ClockInOutFilterPageModule {}
