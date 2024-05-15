import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEditLateInRequestPageRoutingModule } from './add-edit-late-in-request-routing.module';

import { AddEditLateInRequestPage } from './add-edit-late-in-request.page';
import { ComponentsModule } from 'src/app/component/components.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddEditLateInRequestPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot()

  ],
  declarations: [AddEditLateInRequestPage]
})
export class AddEditLateInRequestPageModule {}
