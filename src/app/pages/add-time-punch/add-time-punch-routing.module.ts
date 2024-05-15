import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddTimePunchPage } from './add-time-punch.page';

const routes: Routes = [
  {
    path: '',
    component: AddTimePunchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddTimePunchPageRoutingModule {}
