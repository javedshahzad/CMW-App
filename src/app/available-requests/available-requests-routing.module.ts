import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvailableRequestsPage } from './available-requests.page';

const routes: Routes = [
  {
    path: '',
    component: AvailableRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvailableRequestsPageRoutingModule {}
