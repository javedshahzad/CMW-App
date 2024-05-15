import {
  Component,
  OnInit,
  Inject,
  Input,
  ChangeDetectorRef,
} from '@angular/core';
import { Router } from '@angular/router';
import { ModalController, ModalOptions } from '@ionic/angular';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Constants, roleList, loginRoleList } from 'src/app/constant/constants';
import { defaultRoutes } from 'src/app/services/auth/default-routes';
import { FormService } from 'src/app/services/form/form.service';
import { RolePopup, Role } from '../../models/role-model';
import { AuthService } from 'src/app/services/auth/auth.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { DOCUMENT } from '@angular/common';
@Component({
  selector: 'app-allow-role',
  templateUrl: './allow-role.page.html',
  styleUrls: ['./allow-role.page.scss'],
})
export class AllowRolePage implements OnInit {
  userData: any;
  roleId: any;
  roleName: string;
  roleList = roleList;
  roleForm: FormGroup;
  public messageList: any = new RolePopup();
  checkedValue: string;
  loginRoleList = loginRoleList;
  showRoleList = [];
  constructor(
    private router: Router,
    private model: ModalController,
    @Inject(DOCUMENT) private document: Document,
    private formService: FormService,
    private authService: AuthService,
    private utilityService: UtilityService,
    public ref: ChangeDetectorRef
  ) {
    this.roleForm = new FormGroup({
      userrole: new FormControl(!!this.checkedValue ? this.checkedValue : '', [
        Validators.required,
      ]),
    });
  }
  ionViewWillEnter() {
    this.initializeForm();
    this.getRole();
    this.initializeMessages();
    this.ref.detectChanges();
  }

  ngOnInit() {}
  initializeForm() {
    localStorage.setItem(
      'identifierUser',
      localStorage.getItem(Constants.USERID)
    );
    let userRoleId = localStorage.getItem('roleId');
    this.checkedValue = userRoleId;
    this.roleForm.controls.userrole.setValue(this.checkedValue);
  }
  initializeMessages() {
    this.messageList.userrole = {
      required: Constants.VALIDATION_MSG.ROLE.USER_ROLE_REQUIRED,
    };
  }
  setChecked(value) {
    this.checkedValue = value;
    this.roleForm.controls.userrole.setValue(this.checkedValue);
  }

  onRoleSubmit() {
    this.formService.markFormGroupTouched(this.roleForm);
    if (this.roleForm.invalid) {
      return;
    }
    let userrole = this.roleForm.controls.userrole.value;
    localStorage.setItem('roleId', this.roleForm.controls.userrole.value);
    let userData =
      this.userData + '&isLoggedInAsAUser=true&LoginRole=' + userrole;
    this.loginAsUser(userData);

    //
    // if (userrole === 5) {
    //   let userData = this.userData + "&isLoggedInAsAUser=true";
    //   this.loginAsUser(userData);
    // } else {
    //   this.onClose();
    // }
  }

  onClose() {
    this.document.body.classList.remove('modal-open');
    this.model.dismiss(1);
    this.router.navigate([defaultRoutes[this.roleId]]);
  }

  getRole() {
    this.showRoleList = [];
    // this.roleId = localStorage.getItem(Constants.ROLE);
    this.roleId = localStorage.getItem(Constants.ROLE);
    let roles = this.roleId.split(',');
    let roleObj;
    roles.forEach((element) => {
      roleObj = this.loginRoleList.find((x) => x.id == element);
      if (!!roleObj) {
        this.showRoleList.push({ Id: element, Role: roleObj.role });
      }
    });
    return true;
    // this.showRoleList = [];
    // this.roleId = localStorage.getItem(Constants.ROLE);

    // let roleObj = this.loginRoleList.filter((element) => {
    //   if (element.id.toString() == this.roleId || element.role == 'User') {
    //     return true;
    //   } else {
    //     return false;
    //   }
    // });
    // this.checkedValue = roleObj[0]['value'];
    // this.showRoleList = roleObj;
  }

  loginAsUser(userData) {
    let userrole = this.roleForm.controls.userrole.value;
    this.utilityService.showLoading();
    this.authService.login(userData).then(
      (res: any) => {
        if (!res.error) {
          // this.utilityService.showSuccessToast("Logged in as a User");
          localStorage.setItem(Constants.ROLE, userrole.toString());
          localStorage.setItem('roleId', userrole.toString());
          localStorage.setItem(Constants.TOKEN, res.access_token);
          if (userrole == 1) {
            this.utilityService.showSuccessToast('Logged in as a Admin');
          } else if (userrole == 2) {
            this.utilityService.showSuccessToast('Logged in as a Purchaser');
          } else if (userrole == 3) {
            this.utilityService.showSuccessToast('Logged in as a HrAdmin');
          } else if (userrole == 4) {
            this.utilityService.showSuccessToast('Logged in as a Manager');
          } else if (userrole == 5) {
            this.utilityService.showSuccessToast('Logged in as a User');
          } else {
            this.utilityService.showSuccessToast(
              'Logged in as a LearningAdmin'
            );
          }
          this.roleId = Role.user;
          this.onClose();
        } else {
          this.utilityService.showErrorToast(res['error_description']);
        }
      },
      (err) => {
        this.utilityService.hideLoading();
        if(!err.error.error_description){
          this.utilityService.showErrorToast('Please select a role');
        }
        else{
          this.utilityService.showErrorToast(err.error.error_description);
        }
      }
    );
  }

  changeEvent($event) {
    this.setChecked(+$event.detail.value);
  }
  // changeValue(value: string) {
  //   // this.selectedItems = value;
  //   this.roleForm.controls.userrole.setValue(value);
  // }
}
