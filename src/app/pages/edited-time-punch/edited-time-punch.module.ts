import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditedTimePunchPageRoutingModule } from './edited-time-punch-routing.module';

import { EditedTimePunchPage } from './edited-time-punch.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditedTimePunchPageRoutingModule
  ],
  declarations: [EditedTimePunchPage]
})
export class EditedTimePunchPageModule {}
