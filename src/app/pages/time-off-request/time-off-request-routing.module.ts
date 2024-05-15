import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeOffRequestPage } from './time-off-request.page';

const routes: Routes = [
  {
    path: '',
    component: TimeOffRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeOffRequestPageRoutingModule {}
