import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClockInOutFilterPage } from './clock-in-out-filter.page';

const routes: Routes = [
  {
    path: '',
    component: ClockInOutFilterPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClockInOutFilterPageRoutingModule {}
