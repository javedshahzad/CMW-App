import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ClockInOutDetailPageRoutingModule } from './clock-in-out-detail-routing.module';

import { ClockInOutDetailPage } from './clock-in-out-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClockInOutDetailPageRoutingModule
  ],
  declarations: [ClockInOutDetailPage]
})
export class ClockInOutDetailPageModule {}
