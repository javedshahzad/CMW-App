import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddVotRequestPage } from './add-vot-request.page';

const routes: Routes = [
  {
    path: '',
    component: AddVotRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddVotRequestPageRoutingModule {}
