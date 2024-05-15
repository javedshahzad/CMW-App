import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AvailableRequestsPageRoutingModule } from './available-requests-routing.module';

import { AvailableRequestsPage } from './available-requests.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AvailableRequestsPageRoutingModule
  ],
  declarations: [AvailableRequestsPage]
})
export class AvailableRequestsPageModule {}
