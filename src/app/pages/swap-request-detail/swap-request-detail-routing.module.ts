import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SwapRequestDetailPage } from './swap-request-detail.page';

const routes: Routes = [
  {
    path: '',
    component: SwapRequestDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SwapRequestDetailPageRoutingModule {}
