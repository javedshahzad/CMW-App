import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AddRequestSwapPage } from './add-request-swap.page';

const routes: Routes = [
  {
    path: '',
    component: AddRequestSwapPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AddRequestSwapPageRoutingModule {}
