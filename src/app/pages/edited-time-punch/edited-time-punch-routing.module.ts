import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditedTimePunchPage } from './edited-time-punch.page';

const routes: Routes = [
  {
    path: '',
    component: EditedTimePunchPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditedTimePunchPageRoutingModule {}
