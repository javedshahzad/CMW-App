import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { CallInRequestPageRoutingModule } from './call-in-request-routing.module';

import { CallInRequestPage } from './call-in-request.page';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { DatePipe } from '@angular/common';
import { AddEditCallInRequestPageModule } from '../add-edit-call-in-request/add-edit-call-in-request.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CallInRequestPageRoutingModule,
    CKEditorModule,
    AddEditCallInRequestPageModule,
    BsDatepickerModule
  ],
  declarations: [CallInRequestPage],
  providers:[DatePipe]
})
export class CallInRequestPageModule {}
