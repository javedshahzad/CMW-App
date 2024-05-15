import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VtoRequestsPageRoutingModule } from './vto-requests-routing.module';

import { VtoRequestsPage } from './vto-requests.page';
import { AddVtoRequestPageModule } from '../add-vto-request/add-vto-request.module';
@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VtoRequestsPageRoutingModule,
    AddVtoRequestPageModule
  ],
  declarations: [VtoRequestsPage]
})
export class VtoRequestsPageModule {}
