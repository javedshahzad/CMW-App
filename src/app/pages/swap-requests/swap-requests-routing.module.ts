import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SwapRequestsPage } from './swap-requests.page';

const routes: Routes = [
  {
    path: '',
    component: SwapRequestsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwapRequestsPageRoutingModule {}
