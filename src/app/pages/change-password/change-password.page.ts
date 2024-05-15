import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { ChangePasswordService } from '../../services/change-password/change-password.service';
import { Constants } from '../../constant/constants';
import { ValidationService } from '../../services/validation/validation.service';
import { ChangePassword } from '../../models/changepassword.model';
import { FormService } from 'src/app/services/form/form.service';
import { EventsService } from 'src/app/services/events/events.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.page.html',
  styleUrls: ['./change-password.page.scss'],
})
export class ChangePasswordPage implements OnInit {
  changePasswordForm: FormGroup;
  isShowConfirmPassword = false;
  isShowNewPassword = false;
  isSubmitted: boolean = false;
  public messageList: any = new ChangePassword();
  public eyeShow = false;
  constructor(private events: EventsService, private formService: FormService, public validationService: ValidationService, public router: Router, public location: Location, private fb: FormBuilder, private utilityService: UtilityService, private changePasswordService: ChangePasswordService) { }

  ngOnInit() {
   // this.utilityService.hideLoading();
  }

  initializeChangePasswordForm() {
    this.changePasswordForm = this.fb.group({
      currentPassword: new FormControl('', [Validators.required, , Validators.minLength(6), Validators.maxLength(16)]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
      confirmPassword: new FormControl('', [Validators.required]),
      userName: new FormControl(localStorage.getItem(Constants.USERNAME)),
      isChangePassword: new FormControl(true),
      companyId: new FormControl(Number(localStorage.getItem(Constants.COMPANYID))),
    },
      {
        validators: this.validationService.confirmedValidator(
          'newPassword',
          'confirmPassword',
        )
      },
    );
  }

  ionViewWillEnter() {
    this.events.publish("change_password_menu", true);
    this.initializeChangePasswordForm();
    this.initializeMessages();
  }

  initializeMessages() {
    this.messageList.currentPassword = {
      required: Constants.VALIDATION_MSG.CHANGEPASSWORD.CURRENT_PASSWORD_REQUIRED
    };
    this.messageList.newPassword = {
      required: Constants.VALIDATION_MSG.CHANGEPASSWORD.NEW_PASSWORD_REQUIRED,
    };
    this.messageList.confirmPassword = {
      required: Constants.VALIDATION_MSG.CHANGEPASSWORD.CONFIRM_PASSWORD_REQUIRED,
      confirmedValidator: Constants.VALIDATION_MSG.CHANGEPASSWORD.PASSWORD_CONFIRM_PASSWORD_NOT_MATCH
    };
  }

  onSubmit() {
    this.formService.markFormGroupTouched(this.changePasswordForm);
    this.isSubmitted = true;
    if (this.changePasswordForm.invalid) {
      return;
    }
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.changePasswordService.updatePassword(this.changePasswordForm.value).then((res) => {
      if (res['Success']) {
        this.utilityService.showSuccessToast(Constants.PASSWORD_UPDATE_SUCCESS_MSG);
        this.router.navigate(['/login']);

      } else {
        this.utilityService.showErrorToast(res['Message']);
      }
    }, err => { });
  }
}
