import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants } from '../../constant/constants';
import { ForgotPassword } from '../../models/forgotpassword.model';
import { environment } from 'src/environments/environment';
import { UtilityService } from '../../services/utility/utility.service';
import { FormService } from '../../services/form/form.service';
import { ForgotPasswordService } from '../../services/forgot-password/forgot-password.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {
  forgotpasswordForm: FormGroup;
  public messageList: any = new ForgotPassword();
  appName = environment.APP_NAME;
  companyName: string;

  constructor(public router: Router, private forgotpasswordService: ForgotPasswordService,
    private formService: FormService, private utilityService: UtilityService) {
    this.appName = localStorage.getItem(Constants.APP_NAME);
  }

  ngOnInit() {

  }

  ionViewWillEnter() {
    this.initializeForgotPasswordForm();
    this.initializeMessages();
  }

  initializeForgotPasswordForm() {
    this.forgotpasswordForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.pattern(Constants.REGEX.EMAIL_PATTERN)]),
    });
  }

  initializeMessages() {
    this.messageList.email = {
      required: Constants.VALIDATION_MSG.FORGOTPASSWORD.EMAIL_REQUIRED,
      pattern: Constants.VALIDATION_MSG.SIGN_UP.EMAIL_INVALID
    };
  }
  onSubmit() {
    this.formService.markFormGroupTouched(this.forgotpasswordForm);
    if (this.forgotpasswordForm.invalid) {
      return;
    }
    this.utilityService.showLoading();
    let forgotdata={
      "email": this.forgotpasswordForm.controls.email.value,
      "isMobile":true
    }
    this.forgotpasswordService.addEmail( this.forgotpasswordForm.controls.email.value,true).then((res) => {
      if (res['Success']) {
        this.utilityService.hideLoading();
        this.utilityService.showSuccessToast(Constants.EMAIL_ADD_SUCCESS_MSG);
      } else {
        this.utilityService.hideLoading();
        this.utilityService.showErrorToast(!!res['Message'] ? res['Message'] : Constants.VALIDATION_MSG.FORGOTPASSWORD.EMAIL_SERVERDOWN);
      }
      this.router.navigate(['']);
    }, err => {
      this.utilityService.hideLoading();
    });
  }

  redirectToSignIn() {
    this.router.navigate(['/login'])
  }
}
