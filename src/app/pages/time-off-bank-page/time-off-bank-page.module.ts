import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimeOffBankPagePageRoutingModule } from './time-off-bank-page-routing.module';

import { CalendarModule } from 'ion2-calendar';
import { TimeOffBankPagePage } from './time-off-bank-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimeOffBankPagePageRoutingModule,
    CalendarModule
  ],
  declarations: [TimeOffBankPagePage]
})
export class TimeOffBankPagePageModule {}
