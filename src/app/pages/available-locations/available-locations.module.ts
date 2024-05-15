import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvailableLocationsPageRoutingModule } from './available-locations-routing.module';

import { AvailableLocationsPage } from './available-locations.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvailableLocationsPageRoutingModule
  ],
  declarations: [AvailableLocationsPage]
})
export class AvailableLocationsPageModule {}
