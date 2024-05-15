import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VtoRequestDetailPage } from './vto-request-detail.page';

const routes: Routes = [
  {
    path: '',
    component: VtoRequestDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VtoRequestDetailPageRoutingModule {}
