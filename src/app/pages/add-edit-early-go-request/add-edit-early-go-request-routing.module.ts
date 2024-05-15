import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddEditEarlyGoRequestPage } from './add-edit-early-go-request.page';

const routes: Routes = [
  {
    path: '',
    component: AddEditEarlyGoRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddEditEarlyGoRequestPageRoutingModule {}
