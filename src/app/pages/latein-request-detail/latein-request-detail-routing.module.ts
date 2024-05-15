import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LateinRequestDetailPage } from './latein-request-detail.page';

const routes: Routes = [
  {
    path: '',
    component: LateinRequestDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LateinRequestDetailPageRoutingModule {}
