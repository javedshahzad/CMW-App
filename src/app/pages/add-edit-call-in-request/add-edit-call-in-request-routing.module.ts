import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditCallInRequestPage } from './add-edit-call-in-request.page';

const routes: Routes = [
  {
    path: '',
    component: AddEditCallInRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEditCallInRequestPageRoutingModule {}
