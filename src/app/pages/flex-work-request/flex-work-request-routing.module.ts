import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FlexWorkRequestPage } from './flex-work-request.page';

const routes: Routes = [
  {
    path: '',
    component: FlexWorkRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FlexWorkRequestPageRoutingModule {}
