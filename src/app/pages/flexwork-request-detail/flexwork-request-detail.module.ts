import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlexworkRequestDetailPageRoutingModule } from './flexwork-request-detail-routing.module';

import { FlexworkRequestDetailPage } from './flexwork-request-detail.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexworkRequestDetailPageRoutingModule
  ],
  declarations: [FlexworkRequestDetailPage]
})
export class FlexworkRequestDetailPageModule {}
