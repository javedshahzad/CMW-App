import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddVtoRequestPageRoutingModule } from './add-vto-request-routing.module';

import { AddVtoRequestPage } from './add-vto-request.page';
import { ValidationMessageComponent } from '../../component/validation-message/validation-message.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ComponentsModule } from 'src/app/component/components.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddVtoRequestPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule,
    CKEditorModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
  ],
  declarations: [AddVtoRequestPage]
})
export class AddVtoRequestPageModule {}
