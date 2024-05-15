import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserWorkHoursPage } from './user-work-hours.page';

const routes: Routes = [
  {
    path: '',
    component: UserWorkHoursPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserWorkHoursPageRoutingModule {}
