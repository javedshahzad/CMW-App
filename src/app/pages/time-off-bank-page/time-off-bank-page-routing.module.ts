import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TimeOffBankPagePage } from './time-off-bank-page.page';

const routes: Routes = [
  {
    path: '',
    component: TimeOffBankPagePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TimeOffBankPagePageRoutingModule {}
