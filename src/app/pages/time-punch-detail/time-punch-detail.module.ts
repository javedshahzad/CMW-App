import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { TimePunchDetailPageRoutingModule } from './time-punch-detail-routing.module';

import { TimePunchDetailPage } from './time-punch-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TimePunchDetailPageRoutingModule
  ],
  declarations: [TimePunchDetailPage]
})
export class TimePunchDetailPageModule {}
