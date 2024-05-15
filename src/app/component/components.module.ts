import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { ShowHidePasswordComponent } from './show-hide-password/show-hide-password.component';
import { ValidationMessageComponent } from './validation-message/validation-message.component';
import { TransferApproveRequestComponent } from '../shared/transfer-approve-request/transfer-approve-request.component';
import { TransferDenialReasonComponent } from '../shared/transfer-denial-reason/transfer-denial-reason.component';
import { VotApproveRejectConfirmationComponent } from '../shared/vot-approve-reject-confirmation/vot-approve-reject-confirmation.component';
import { VtoApproveRejectConfirmationComponent } from '../shared/vto-approve-reject-confirmation/vto-approve-reject-confirmation.component';
import { FlexProcessConfirmationComponent } from '../shared/flex-process-confirmation/flex-process-confirmation.component';
import { AcceptEarlyGoRequestComponent } from '../shared/accept-early-go-request/accept-early-go-request.component';
import { AcceptLateInRequestComponent } from '../shared/accept-late-in-request/accept-late-in-request.component';
import { ConfirmationComponent } from '../shared/confirmation/confirmation.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule.forRoot(),
    BsDatepickerModule.forRoot(),
    CKEditorModule
  ],
  declarations: [
    ShowHidePasswordComponent,
    ValidationMessageComponent,
    TransferApproveRequestComponent,
    TransferDenialReasonComponent,
    VotApproveRejectConfirmationComponent,
    VtoApproveRejectConfirmationComponent,
    FlexProcessConfirmationComponent,
    AcceptEarlyGoRequestComponent, 
    AcceptLateInRequestComponent,
    ConfirmationComponent,
    
  ],
  exports: [
    ShowHidePasswordComponent,
    ValidationMessageComponent,
    TransferApproveRequestComponent,
    TransferDenialReasonComponent,
    VotApproveRejectConfirmationComponent,
    VtoApproveRejectConfirmationComponent,
    FlexProcessConfirmationComponent,
    AcceptEarlyGoRequestComponent, 
    AcceptLateInRequestComponent,
    ConfirmationComponent,
    
  ],
  entryComponents: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class ComponentsModule {}
