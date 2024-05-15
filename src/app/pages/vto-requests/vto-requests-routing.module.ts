import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VtoRequestsPage } from './vto-requests.page';

const routes: Routes = [
  {
    path: '',
    component: VtoRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VtoRequestsPageRoutingModule {}
