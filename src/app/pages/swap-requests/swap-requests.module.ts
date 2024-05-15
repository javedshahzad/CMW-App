import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SwapRequestsPageRoutingModule } from './swap-requests-routing.module';

import { SwapRequestsPage } from './swap-requests.page';
import { DatePipe } from '@angular/common';
import { AddRequestSwapPageModule } from '../add-request-swap/add-request-swap.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SwapRequestsPageRoutingModule,
    AddRequestSwapPageModule
  ],
  declarations: [SwapRequestsPage],
  providers:[DatePipe]
})
export class SwapRequestsPageModule {}
