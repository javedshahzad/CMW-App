import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AddVotRequestPageRoutingModule } from './add-vot-request-routing.module';

import { AddVotRequestPage } from './add-vot-request.page';
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
    AddVotRequestPageRoutingModule,
    ReactiveFormsModule,
    CKEditorModule,
    ComponentsModule,
    BsDatepickerModule.forRoot(),
    TimepickerModule.forRoot(),
  ],
  declarations: [AddVotRequestPage]
})
export class AddVotRequestPageModule {}
