import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { FeedbackRequestPageRoutingModule } from './feedback-request-routing.module';
import { ComponentsModule } from 'src/app/component/components.module';
import { FeedbackRequestPage } from './feedback-request.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    FeedbackRequestPageRoutingModule,
    ComponentsModule
  ],
  declarations: [FeedbackRequestPage]
})
export class FeedbackRequestPageModule {}
