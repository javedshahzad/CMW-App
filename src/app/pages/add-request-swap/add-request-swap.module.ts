import { NgModule ,CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AddRequestSwapPageRoutingModule } from './add-request-swap-routing.module';
import { AddRequestSwapPage } from './add-request-swap.page';
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
    AddRequestSwapPageRoutingModule,
    CKEditorModule,
    BsDatepickerModule.forRoot()
  ],
  declarations: [AddRequestSwapPage],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA
  ],
})
export class AddRequestSwapPageModule { }
