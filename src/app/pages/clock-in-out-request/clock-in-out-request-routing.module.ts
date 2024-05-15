import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClockInOutRequestPage } from './clock-in-out-request.page';

const routes: Routes = [
  {
    path: '',
    component: ClockInOutRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClockInOutRequestPageRoutingModule {}
