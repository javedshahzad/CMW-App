import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddTimeoffRequestPageRoutingModule } from './add-timeoff-request-routing.module';

import { AddTimeoffRequestPage } from './add-timeoff-request.page';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ComponentsModule } from 'src/app/component/components.module';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TimepickerModule } from 'ngx-bootstrap/timepicker';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AddTimeoffRequestPageRoutingModule,
    CKEditorModule,
    ComponentsModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
    ReactiveFormsModule
  ],
  declarations: [AddTimeoffRequestPage]
})
export class AddTimeoffRequestPageModule {}
