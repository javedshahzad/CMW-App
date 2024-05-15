import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AllowRolePageRoutingModule } from './allow-role-routing.module';

import { AllowRolePage } from './allow-role.page';
import { ValidationMessageComponent } from '../../component/validation-message/validation-message.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    AllowRolePageRoutingModule
  ],
  declarations: [AllowRolePage,ValidationMessageComponent]
})
export class AllowRolePageModule {}
