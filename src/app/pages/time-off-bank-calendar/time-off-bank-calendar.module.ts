import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimeOffBankCalendarPageRoutingModule } from './time-off-bank-calendar-routing.module';

import { CalendarModule } from 'ion2-calendar';
import { TimeOffBankCalendarPage } from './time-off-bank-calendar.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimeOffBankCalendarPageRoutingModule,
    CalendarModule
  ],
  declarations: [TimeOffBankCalendarPage]
})
export class TimeOffBankCalendarPageModule {}
