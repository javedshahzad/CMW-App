import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AvailableLocationsPage } from './available-locations.page';

const routes: Routes = [
  {
    path: '',
    component: AvailableLocationsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AvailableLocationsPageRoutingModule {}
