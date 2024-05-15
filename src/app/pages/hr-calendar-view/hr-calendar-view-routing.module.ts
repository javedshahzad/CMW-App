import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HrCalendarViewPage } from './hr-calendar-view.page';

const routes: Routes = [
  {
    path: '',
    component: HrCalendarViewPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HrCalendarViewPageRoutingModule {}
