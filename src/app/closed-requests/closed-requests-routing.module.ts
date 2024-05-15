import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClosedRequestsPage } from './closed-requests.page';

const routes: Routes = [
  {
    path: '',
    component: ClosedRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClosedRequestsPageRoutingModule {}
