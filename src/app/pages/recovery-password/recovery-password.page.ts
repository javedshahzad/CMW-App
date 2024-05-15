import { Component, NgZone, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormService } from '../../services/form/form.service';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { ChangePasswordService } from '../../services/change-password/change-password.service';
import { Constants } from '../../constant/constants';
import { ValidationService } from '../../services/validation/validation.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ChangePassword } from '../../models/changepassword.model';

@Component({
  selector: 'app-recovery-password',
  templateUrl: './recovery-password.page.html',
  styleUrls: ['./recovery-password.page.scss'],
})
export class RecoveryPasswordPage implements OnInit {
  changePasswordForm: FormGroup;
  isShowConfirmPassword = false;
  isShowNewPassword = false;
  isSubmitted: boolean = false;
  public messageList: any = new ChangePassword();
  IsChangePassword:any = false;
  token:any;
  public companyId:any;
  public username:any;

  constructor(private route: ActivatedRoute, private formService: FormService, public validationService: ValidationService,
    public router: Router, public location: Location, private fb: FormBuilder, private utilityService: UtilityService,
    private changePasswordService: ChangePasswordService, public ngZone:NgZone) {
   
     }

  ngOnInit() {
  }

  ionViewWillEnter() {
 
    
    let data = this.route.snapshot.paramMap.get('token').split('AccessToken=');
    let url = data[1];
    let ispassword = url.split('&IsChangePassword=');
    this.IsChangePassword = ispassword[1];
    this.token = ispassword[0];
    this.token = encodeURIComponent(this.token);
   console.log('token',this.token);

    if(localStorage.getItem(Constants.COMPANYID)){
      this.companyId = Number(localStorage.getItem(Constants.COMPANYID));
    }
    else{
      this.companyId = 0;
    }
    if(localStorage.getItem(Constants.USERNAME)){
      this.username = localStorage.getItem(Constants.USERNAME);
    }
    else{
      this.username = null;
    }
    if(this.IsChangePassword==""){
      this.IsChangePassword = false;
    }
    this.initializeChangePasswordForm();
    this.initializeMessages();
    
 
    
  }


  initializeChangePasswordForm() {
    this.ngZone.run(()=>{
      this.changePasswordForm = this.fb.group({
        currentPassword: new FormControl('', null),
        newPassword: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(16)]),
        confirmPassword: new FormControl('', [Validators.required]),
        userName: new FormControl(this.username),
        isChangePassword: new FormControl(this.IsChangePassword),
        accessToken: new FormControl(this.token),
        companyId: new FormControl(this.companyId),
      },
        {
          validators: this.validationService.confirmedValidator(
            'newPassword',
            'confirmPassword',
          )
        },
      );
    })
  
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
    this.utilityService.showLoading();
    console.log("form value",this.changePasswordForm.controls.accessToken.value)
    this.changePasswordService.updatePasswordByMail(this.changePasswordForm.value).then((res) => {
      if (res['Success']) {
        this.utilityService.hideLoading();
        this.utilityService.showSuccessToast(Constants.PASSWORD_UPDATE_SUCCESS_MSG);
        this.router.navigate(['/login']);
      } else {
        this.utilityService.hideLoading();
        this.utilityService.showErrorToast(res['Message']);
      }
      //this.router.navigate([defaultRoutes[Number(localStorage.getItem(Constants.ROLE))]]);
    }, err => {
      this.utilityService.hideLoading();
    });
  }


}
