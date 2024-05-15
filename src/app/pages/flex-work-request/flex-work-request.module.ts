import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FlexWorkRequestPageRoutingModule } from './flex-work-request-routing.module';

import { FlexWorkRequestPage } from './flex-work-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FlexWorkRequestPageRoutingModule
  ],
  declarations: [FlexWorkRequestPage]
})
export class FlexWorkRequestPageModule {}
