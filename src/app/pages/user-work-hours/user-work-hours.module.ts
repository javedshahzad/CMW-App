import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UserWorkHoursPageRoutingModule } from './user-work-hours-routing.module';

import { UserWorkHoursPage } from './user-work-hours.page';
import { ComponentsModule } from 'src/app/component/components.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    ComponentsModule,
    UserWorkHoursPageRoutingModule
  ],
  declarations: [UserWorkHoursPage]
})
export class UserWorkHoursPageModule {}
