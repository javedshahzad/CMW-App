import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EarlygoRequestDetailPage } from './earlygo-request-detail.page';

const routes: Routes = [
  {
    path: '',
    component: EarlygoRequestDetailPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EarlygoRequestDetailPageRoutingModule {}
