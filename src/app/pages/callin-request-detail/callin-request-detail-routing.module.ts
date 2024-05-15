import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CallinRequestDetailPage } from './callin-request-detail.page';

const routes: Routes = [
  {
    path: '',
    component: CallinRequestDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallinRequestDetailPageRoutingModule {}
