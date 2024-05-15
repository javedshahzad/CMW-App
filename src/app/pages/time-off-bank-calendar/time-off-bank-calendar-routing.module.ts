import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeOffBankCalendarPage } from './time-off-bank-calendar.page';

const routes: Routes = [
  {
    path: '',
    component: TimeOffBankCalendarPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeOffBankCalendarPageRoutingModule {}
