import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HrCalendarViewPageRoutingModule } from './hr-calendar-view-routing.module';

import { HrCalendarViewPage } from './hr-calendar-view.page';
import { CalendarModule } from 'ion2-calendar';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ModalModule, } from 'ngx-bootstrap/modal';
import { ConfirmationComponent } from '../../shared/confirmation/confirmation.component';
import { VotApproveRejectConfirmationComponent } from '../../shared/vot-approve-reject-confirmation/vot-approve-reject-confirmation.component';
import { VtoApproveRejectConfirmationComponent } from '../../shared/vto-approve-reject-confirmation/vto-approve-reject-confirmation.component';
import { FlexProcessConfirmationComponent } from '../../shared/flex-process-confirmation/flex-process-confirmation.component';
import { AcceptEarlyGoRequestComponent } from '../../shared/accept-early-go-request/accept-early-go-request.component';
import { AcceptLateInRequestComponent } from '../../shared/accept-late-in-request/accept-late-in-request.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { ValidationMessageComponent } from '../../component/validation-message/validation-message.component';
import { TransferDenialReasonComponent } from '../../shared/transfer-denial-reason/transfer-denial-reason.component';
import { TransferApproveRequestComponent } from '../../shared/transfer-approve-request/transfer-approve-request.component';
import { ComponentsModule } from 'src/app/component/components.module';
@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    HrCalendarViewPageRoutingModule,
    CalendarModule,
    CKEditorModule,
    BsDatepickerModule.forRoot(),
    ModalModule.forRoot(),
  ],
  declarations: [HrCalendarViewPage,]
})
export class HrCalendarViewPageModule {}
