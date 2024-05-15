import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VotRequestsPage } from './vot-requests.page';

const routes: Routes = [
  {
    path: '',
    component: VotRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VotRequestsPageRoutingModule {}
