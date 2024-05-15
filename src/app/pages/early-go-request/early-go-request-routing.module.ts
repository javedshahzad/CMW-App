import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EarlyGoRequestPage } from './early-go-request.page';

const routes: Routes = [
  {
    path: '',
    component: EarlyGoRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EarlyGoRequestPageRoutingModule {}
