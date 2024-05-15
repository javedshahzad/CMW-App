import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VotRequestDetailPage } from './vot-request-detail.page';

const routes: Routes = [
  {
    path: '',
    component: VotRequestDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VotRequestDetailPageRoutingModule {}
