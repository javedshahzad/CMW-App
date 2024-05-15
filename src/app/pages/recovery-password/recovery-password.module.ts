import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RecoveryPasswordPageRoutingModule } from './recovery-password-routing.module';

import { RecoveryPasswordPage } from './recovery-password.page';
import { ComponentsModule } from 'src/app/component/components.module';
import { ShowHidePasswordComponent } from 'src/app/component/show-hide-password/show-hide-password.component';
import { ValidationMessageComponent } from '../../component/validation-message/validation-message.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    IonicModule,
    RecoveryPasswordPageRoutingModule,
    ComponentsModule
  ],
  declarations: [RecoveryPasswordPage]
})
export class RecoveryPasswordPageModule {}
