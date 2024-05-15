import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LateInRequestPageRoutingModule } from './late-in-request-routing.module';

import { LateInRequestPage } from './late-in-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LateInRequestPageRoutingModule
  ],
  declarations: [LateInRequestPage]
})
export class LateInRequestPageModule {}
