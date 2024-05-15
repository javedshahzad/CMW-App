import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClockInOutDetailPage } from './clock-in-out-detail.page';

const routes: Routes = [
  {
    path: '',
    component: ClockInOutDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClockInOutDetailPageRoutingModule {}
