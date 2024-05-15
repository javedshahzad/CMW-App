import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LateInRequestPage } from './late-in-request.page';

const routes: Routes = [
  {
    path: '',
    component: LateInRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LateInRequestPageRoutingModule {}
