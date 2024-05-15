import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddTimePunchPageRoutingModule } from './add-time-punch-routing.module';

import { AddTimePunchPage } from './add-time-punch.page';
import { ComponentsModule } from 'src/app/component/components.module';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    AddTimePunchPageRoutingModule,
    CKEditorModule,
    BsDatepickerModule.forRoot()
  ],
  declarations: [AddTimePunchPage],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ]
})
export class AddTimePunchPageModule {}
