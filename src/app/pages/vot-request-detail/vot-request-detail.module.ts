import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VotRequestDetailPageRoutingModule } from './vot-request-detail-routing.module';

import { VotRequestDetailPage } from './vot-request-detail.page';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VotRequestDetailPageRoutingModule,
    BsDatepickerModule.forRoot()
  ],
  declarations: [VotRequestDetailPage]
})
export class VotRequestDetailPageModule {}
