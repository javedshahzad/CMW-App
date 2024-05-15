import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CallInRequestPage } from './call-in-request.page';

const routes: Routes = [
  {
    path: '',
    component: CallInRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CallInRequestPageRoutingModule {}
