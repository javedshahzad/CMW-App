import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddEditCallInRequestPageRoutingModule } from './add-edit-call-in-request-routing.module';

import { AddEditCallInRequestPage } from './add-edit-call-in-request.page';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ComponentsModule } from 'src/app/component/components.module';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    AddEditCallInRequestPageRoutingModule,
    CKEditorModule,
    ComponentsModule,
    BsDatepickerModule.forRoot()
  ],
  declarations: [AddEditCallInRequestPage]
})
export class AddEditCallInRequestPageModule {}
