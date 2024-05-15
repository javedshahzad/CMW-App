import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeoffRequestDetailPage } from './timeoff-request-detail.page';

const routes: Routes = [
  {
    path: '',
    component: TimeoffRequestDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeoffRequestDetailPageRoutingModule {}
