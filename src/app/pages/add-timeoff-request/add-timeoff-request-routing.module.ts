import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddTimeoffRequestPage } from './add-timeoff-request.page';

const routes: Routes = [
  {
    path: '',
    component: AddTimeoffRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddTimeoffRequestPageRoutingModule {}
