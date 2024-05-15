import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeedbackRequestPage } from './feedback-request.page';

const routes: Routes = [
  {
    path: '',
    component: FeedbackRequestPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeedbackRequestPageRoutingModule {}
