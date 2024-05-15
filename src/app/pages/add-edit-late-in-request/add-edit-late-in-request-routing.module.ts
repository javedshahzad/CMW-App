import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditLateInRequestPage } from './add-edit-late-in-request.page';

const routes: Routes = [
  {
    path: '',
    component: AddEditLateInRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEditLateInRequestPageRoutingModule {}
