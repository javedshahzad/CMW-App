import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ClockInOutPage } from './clock-in-out.page';

const routes: Routes = [
  {
    path: '',
    component: ClockInOutPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClockInOutPageRoutingModule {}
