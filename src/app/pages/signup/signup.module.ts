import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { SignupPageRoutingModule } from './signup-routing.module';
import { SignupPage } from './signup.page';
import {IMaskModule} from 'angular-imask';
import { ComponentsModule } from 'src/app/component/components.module';





@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    SignupPageRoutingModule,
    IMaskModule,
    ComponentsModule
  ],
  declarations: [SignupPage]
  
})
export class SignupPageModule {}
