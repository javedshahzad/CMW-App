import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Constants, dropdownList, drpSetting, phoneMask } from '../../constant/constants';
import { SignUpMessageList } from '../../models/signup-model';
import { Role } from '../../models/role-model';
import { CompanyService } from './../../services/company/company.service';
import { LocationService } from '../../services/location/location.service';
import { DepartmentService } from '../../services/department/department.service';
import { ShiftService } from '../../services/shift/shift.service';
import { defaultRoutes } from '../../services/auth/default-routes';
import { UtilityService } from '../../services/utility/utility.service';
import { UserService } from '../../services/user/user.service';
import { AddRequestSwapService } from '../../services/add-request-swap/add-request-swap.service';
import { FormService } from '../../services/form/form.service';
import { EventsService } from 'src/app/services/events/events.service';


@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.page.html',
  styleUrls: ['./edit-profile.page.scss'],
})
export class EditProfilePage implements OnInit {
  dropdownList = dropdownList;
  selectedItems = [];
  dropdownSettings = drpSetting.dropdownSettings;
  isConfirm = false;
  confirmMsg = Constants.COMPANY_CHANGE_CONFIRM_MSG;
  userForm: FormGroup;
  public messageList: any = new SignUpMessageList();
  isSubmitted: boolean = false;
  roleEnum = Role;
  companyId: number;
  companyList = [];
  role: number;
  locationList = [];
  departmentList = [];
  shiftList = [];
  user: any = {};
  isCompanyChange = false;
  allShiftList = [];
  hasPendingOffer = false;
  phoneMask = phoneMask;

  constructor(private events: EventsService, public ref: ChangeDetectorRef, public router: Router, private formService: FormService, public location: Location, private utilityService: UtilityService, private companyService: CompanyService, private departmentService: DepartmentService,
    private shiftService: ShiftService, private locationService: LocationService, private userService: UserService, private addRequestSwapService: AddRequestSwapService, private activeRoute: ActivatedRoute) {
  }

  ngOnInit() {

  }

  async ionViewWillEnter() {
    this.utilityService.showLoadingwithoutDuration();
    this.events.publish("profile_menu", true);
    this.user = this.activeRoute.snapshot.data.user.Data;
    this.ref.detectChanges()
    this.isCompanyChange = false;
    this.isConfirm = false;
    this.role = Number(localStorage.getItem(Constants.ROLE));
    this.companyId = Number(localStorage.getItem(Constants.COMPANYID));
    this.initializeMessages();
    await this.getLocation();
    // setTimeout(() => {
    await this.getDepartment();
    await this.getShift();
    await this.getCompany();
    this.utilityService.hideLoading();
    //  }, 2000);
  }

  initializeUserForm() {
    this.ref.detectChanges()
    this.userForm = new FormGroup(
      {
        userId: new FormControl(!!this.user ? this.user.userId : 0),
        emailId: new FormControl(!!this.user ? this.user.emailId : ''),
        name: new FormControl(!!this.user ? this.user.name : '', Validators.required),
        vCode: new FormControl(!!this.user ? this.user.vCode : ''),
        companyId: new FormControl(!!this.user ? this.user.companyId : this.companyId, Validators.required),
        departmentId: new FormControl(!!this.user ? this.user.departmentId : null, Validators.required),
        locationId: new FormControl(!!this.user ? this.user.locationId : null, Validators.required),
        isRecievingTextMessage: new FormControl(!!this.user ? this.user.isRecievingTextMessage : false),
        phone: new FormControl(!!this.user ? this.user.phone : '',
          Validators.required,
          // Validators.pattern(Constants.REGEX.PHONE_PATTERN)
        ),
        companyUsername: new FormControl(!!this.user ? this.user.companyUsername : '', Validators.required),
        employeeId: new FormControl(!!this.user ? this.user.employeeId : '', Validators.required),
        roleId: new FormControl(!!this.user ? this.user.roleId : localStorage.getItem(Constants.ROLE)),
        shiftId: new FormControl(!!this.user ? this.user.shiftId : null, Validators.required),
        isActive: new FormControl(!!this.user ? this.user.isActive : true),
        GetCommunicationMethod: new FormControl(!!this.user ? this.user.GetCommunicationMethod.map(x => Number(x)) : this.selectedItems, Validators.required),
        password: new FormControl(!!this.user ? this.user.password : ''),
        confirmPassword: new FormControl(''),
        Roles:new FormControl(!!this.user ? this.user.Roles : '')
      });

    this.setOptionalField(this.userForm.controls.roleId.value);
    !!this.userForm.controls.companyUsername.value ? this.userForm.controls['companyUsername'].disable() : this.userForm.controls['companyUsername'].enable();
    !!this.userForm.controls.employeeId.value ? this.userForm.controls['employeeId'].disable() : this.userForm.controls['employeeId'].enable();
  }

  initializeMessages() {
    this.messageList.name = {
      required: Constants.VALIDATION_MSG.SIGN_UP.NAME_REQUIRED,
    };
    this.messageList.companyId = {
      required: Constants.VALIDATION_MSG.SIGN_UP.COMPANY_REQUIRED,
    };
    this.messageList.departmentId = {
      required: Constants.VALIDATION_MSG.SIGN_UP.DEPARTMENT_REQUIRED,
    };
    this.messageList.locationId = {
      required: Constants.VALIDATION_MSG.SIGN_UP.LOCATION_REQUIRED,
    };
    this.messageList.phone = {
      required: Constants.VALIDATION_MSG.SIGN_UP.PHONE_REQUIRED,
      // pattern: Constants.VALIDATION_MSG.SIGN_UP.PHONE_INVALID
    };
    this.messageList.companyUsername = {
      required: Constants.VALIDATION_MSG.SIGN_UP.COMPANY_NAME_REQUIRED,
    };
    this.messageList.employeeId = {
      required: Constants.VALIDATION_MSG.SIGN_UP.EMPLOYEEID_REQUIRED,
    };
    this.messageList.shiftId = {
      required: Constants.VALIDATION_MSG.SIGN_UP.SHIFT_REQUIRED,
    };
    this.messageList.companyId = {
      required: Constants.VALIDATION_MSG.SIGN_UP.COMPANY_REQUIRED,
    };
    this.messageList.GetCommunicationMethod = {
      required: Constants.VALIDATION_MSG.SIGN_UP.COMMUNICATION_METHOD_REQUIRED
    }
  }

  async getCompany() {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
   
    await this.companyService.getCompanyListWithOutPagination().then(res => {
      if (res['Success']) {
        this.utilityService.hideLoading();
        setTimeout(() => {
          this.initializeUserForm();

        }, 2000);
        this.companyList = res['Data'];
      } else {
        this.utilityService.hideLoading();
        this.companyList = [];
      }
    }, err => {
      this.utilityService.hideLoading();
      this.companyList = [];
    });
  }

  changeValue(event) {
    this.selectedItems = event.detail.value;
    this.userForm.controls.GetCommunicationMethod.setValue(this.selectedItems);
  }

  async getLocation() {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    // this.utilityService.showLoading();
    await this.locationService.getLocationListByCompany(this.companyId, null).then(res => {
      if (res['Success']) {
        // this.utilityService.hideLoading();
        this.locationList = res['Data'];
      } else {
        // this.utilityService.hideLoading();
        this.locationList = [];
      }
    }, err => {
      // this.utilityService.hideLoading();
      this.locationList = [];
    });
  }

  async getDepartment() {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    // this.utilityService.showLoading();
    await this.departmentService.getDepartmentListByCompanyId(null, this.companyId).then(res => {
      if (res['Success']) {
        // this.utilityService.hideLoading();
        this.departmentList = res['Data'];
      } else {
        // this.utilityService.hideLoading();
        this.departmentList = [];
      }
    }, err => {
      // this.utilityService.hideLoading();
      this.departmentList = [];
    });
  }

  async getShift() {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    // this.utilityService.showLoading();
    await this.shiftService.getShiftListByCompanyId(null, this.companyId).then(res => {
      if (res['Success']) {
        // this.utilityService.hideLoading();
        this.allShiftList = res['Data'];
        // this.shiftList = [];
        if (!!this.user && !!this.user.departmentId) {
          this.onDepartmentChange(this.user.departmentId);
        }
      } else {
        // this.utilityService.hideLoading();
        this.shiftList = []; this.allShiftList = [];
      }
    }, err => {
      // this.utilityService.hideLoading();
      this.shiftList = []; this.allShiftList = [];
    })
  }

  cancel() {
    this.isConfirm = false;
    this.router.navigate([defaultRoutes[Number(localStorage.getItem(Constants.ROLE))]]);
  }

  onSubmit() {
    if (this.isCompanyChange) {
      if (!navigator.onLine) {
        return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      }
      this.utilityService.showLoading();
      this.addRequestSwapService.hasPendingRequest(Number(localStorage.getItem(Constants.USERID))).then(res => {
        if (res) {
          if (res['Success']) {
            this.utilityService.hideLoading();
            this.hasPendingOffer = true;
            this.confirmMsg = Constants.OFFER_MSG_WHILE_COMPANY_CHANGE;
          } else {
            this.utilityService.hideLoading();
            this.hasPendingOffer = false;
            this.confirmMsg = Constants.COMPANY_CHANGE_CONFIRM_MSG
          }
          this.isConfirm = true;

        }
      }, err => {
        this.utilityService.hideLoading();
      });
    } else {
      this.utilityService.hideLoading();
      this.updateUserData();
    }
  }

  confirmCompanyChange(event) {
    this.isConfirm = false;
    if (this.userForm.invalid) {
      this.formService.markFormGroupTouched(this.userForm);
      return false;
    } else {
      this.updateUserData();
    }
  }

  updateUserData() {
    this.formService.markFormGroupTouched(this.userForm);
    this.isSubmitted = true;
    if (this.userForm.invalid) {
      return false;
    }
    if (this.userForm.value.GetCommunicationMethod.length > 0) {
      const communicationMethod = this.userForm.value.GetCommunicationMethod;
      this.userForm.get('GetCommunicationMethod').patchValue(communicationMethod);
    } else {
      this.userForm.get('GetCommunicationMethod').patchValue([]);
      this.utilityService.showErrorToast(Constants.VALIDATION_MSG.SIGN_UP.COMMUNICATION_METHOD_REQUIRED);
      return;
    }

    this.userForm.controls.companyId.setValue(Number(this.userForm.controls.companyId.value));
    this.userForm.controls.locationId.setValue(!!this.userForm.controls.locationId.value ? Number(this.userForm.controls.locationId.value) : null);
    this.userForm.controls.departmentId.setValue(!!this.userForm.controls.departmentId.value ? Number(this.userForm.controls.departmentId.value) : null);
    this.userForm.controls.shiftId.setValue(!!this.userForm.controls.shiftId.value ? Number(this.userForm.controls.shiftId.value) : null);
    this.userForm.controls.employeeId.setValue(!!this.userForm.controls.employeeId.value ? this.userForm.controls.employeeId.value : null);
    const Data = {
      ...this.userForm.value,
      employeeId: this.userForm.controls.employeeId.value,
      companyUsername: this.userForm.controls.companyUsername.value
    };
    delete Data.confirmPassword;
    if (this.isCompanyChange) {
      if (!navigator.onLine) {
        return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      }
      this.addRequestSwapService.deleteOfferForUser(Number(localStorage.getItem(Constants.USERID))).then(res => {
        if (res['Success']) {
          this.apiCall(Data);
        }
      }, err => { });
    } else {
      this.apiCall(Data);
    }

  }

  apiCall(Data) {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoading();
    this.userService.updateUser(Data).then((res: any) => {
      if (res['Success']) {
        this.utilityService.hideLoading();
        this.utilityService.showSuccessToast(Constants.PROFILE_SUCCESS_MSG);
        localStorage.setItem(Constants.USERNAME, res['Data'].companyUsername);
        if(res['Data'].AppCompanyId){
        localStorage.setItem(Constants.COMPANYID, res['Data'].AppCompanyId);
        }
        else{
             localStorage.setItem(Constants.COMPANYID, res['Data'].companyId);
        }
        // localStorage.setItem(Constants.ROLE, res['Data'].roleId);
        localStorage.setItem(Constants.USERID, res['Data'].userId);
        localStorage.setItem(Constants.SHIFTID, res['Data'].shiftId);
        localStorage.setItem(Constants.DEPARTMENTID, res['Data'].departmentId);
        localStorage.setItem(Constants.LOCATIONID, res['Data'].locationId);
        if (this.isCompanyChange) {
          this.isConfirm = false;
          this.router.navigate(['']);
        } else {
          this.events.publish("is_redirect_home", "true");
          this.router.navigate([defaultRoutes[Number(localStorage.getItem(Constants.ROLE))]]);
        }
      } else {
        this.utilityService.hideLoading();
        this.utilityService.showErrorToast(res['Message']);
      }
    });
  }

  setOptionalField(value) {
    this.userForm.controls.departmentId.setValidators(value !== 5 ? null : [Validators.required]);
    this.userForm.controls.shiftId.setValidators(value !== 5 ? null : [Validators.required]);
    this.userForm.controls.locationId.setValidators(value !== 5 ? null : [Validators.required]);
    this.userForm.controls.employeeId.setValidators(null);
    this.userForm.controls.departmentId.updateValueAndValidity();
    this.userForm.controls.shiftId.updateValueAndValidity();
    this.userForm.controls.employeeId.updateValueAndValidity();
    this.userForm.controls.locationId.updateValueAndValidity();
  }

  onDepartmentChange(event) {
    this.ref.detectChanges()
    if (!!event.currentTarget) {
      if (!!event.currentTarget.value) {
        this.shiftList = this.allShiftList;
        this.shiftList = this.shiftList.filter(x => x.departmentId === Number(event.currentTarget.value));
        if (localStorage.getItem(Constants.IS_Profile_call) != "1") {
          this.userForm.controls.shiftId.setValue('');
        }
        localStorage.setItem(Constants.IS_Profile_call, "0")
      } else {
        this.shiftList = [];
        this.userForm.controls.shiftId.setValue('');
      }
    } else {
      if (!!event) {
        localStorage.setItem(Constants.IS_Profile_call, "1");
        this.shiftList = this.allShiftList;
        this.shiftList = this.shiftList.filter(x => x.departmentId === Number(event));
      } else {
        this.shiftList = [];
        this.userForm.controls.shiftId.setValue('');
      }
    }
  }
}