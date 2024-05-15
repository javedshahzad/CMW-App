import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEditEarlyGoRequestPageRoutingModule } from './add-edit-early-go-request-routing.module';

import { AddEditEarlyGoRequestPage } from './add-edit-early-go-request.page';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ComponentsModule } from 'src/app/component/components.module';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    AddEditEarlyGoRequestPageRoutingModule,
    ComponentsModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot()
  ],
  declarations: [AddEditEarlyGoRequestPage]
})
export class AddEditEarlyGoRequestPageModule {}
