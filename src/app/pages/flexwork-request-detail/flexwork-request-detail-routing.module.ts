import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlexworkRequestDetailPage } from './flexwork-request-detail.page';

const routes: Routes = [
  {
    path: '',
    component: FlexworkRequestDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlexworkRequestDetailPageRoutingModule {}
