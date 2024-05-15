import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CompanyService } from 'src/app/services/company/company.service';
import { DepartmentService } from 'src/app/services/department/department.service';
import { ShiftService } from 'src/app/services/shift/shift.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { environment } from '../../../environments/environment';
import { Constants, phoneMask, dropdownList } from '../../constant/constants';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { ValidatorService } from 'src/app/services/validator/validator.service';
import { SignUpMessageList } from '../../models/signup-model';
import { LocationService } from 'src/app/services/location/location.service';
import { AuthService } from 'src/app/services/auth/auth.service';
import { FormService } from 'src/app/services/form/form.service';
import { UserService } from 'src/app/services/user/user.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.page.html',
  styleUrls: ['./signup.page.scss'],
})
export class SignupPage implements OnInit {
  dropdownList = dropdownList;
  public methods: any = [];
  public selectedItems: any = [];
  public subDepartmentList: any = [];
  public isValidUser = true;
  public messageList: any = new SignUpMessageList();
  public signUpForm: FormGroup;
  isSubmitted: boolean = false;
  shiftList = [];
  appName = environment.APP_NAME;
  isShowCompany: boolean = false;
  allShift = [];
  phoneMask = phoneMask;
  public departmentList: any = []
  companyName = '';
  public companyList: any = [];
  companyId: number;
  public locationList: any = [];
  public api_url:any;
  isShowManager = false;
  public managerUserList :any = [];
  locationId: number = 0;
  roleId: number = 4;
  customActionSheetOptions: any = {
    header: 'Select',
  };
  constructor(private route: ActivatedRoute, private formService: FormService, private utilityService: UtilityService, private authService: AuthService, private locationService: LocationService, private validationService: ValidatorService, private fb: FormBuilder, public router: Router, 
    private companyService: CompanyService, private utility: UtilityService,
     private departmentService: DepartmentService, private shiftService: ShiftService , public userService:UserService) {

  }

  ngOnInit() {
    // if (window.location.hostname.split('.').length > 2 && window.location.hostname.split('.')[0] !== 'www') {
    //   this.companyName = window.location.hostname.split('.')[0];
    // } else {
    //   this.route.queryParams.subscribe(params => {
    //     if (!params.hasOwnProperty('company')) {
    //       this.router.navigate(['/signup'], { queryParams: { company: '' } });
    //     } else {
    //       this.companyName = params['company'];
    //     }
    //   });
    // }
    // this.getCompany();
    // this.initializeSignUpForm();

  }

  ionViewWillEnter() {
    // if(localStorage.getItem(Constants.API_URL)){
    //   if(localStorage.getItem(Constants.API_URL)!="0"){
    //   this.api_url = localStorage.getItem(Constants.API_URL)
    // }
    // else{
      localStorage.setItem(Constants.API_URL,environment.APP_URL)
    // }
  // }
    this.getCompany();
    this.initializeSignUpForm()
    this.initializeMessages();
  }

  initializeSignUpForm() {
    this.signUpForm = this.fb.group(
      {
        companyId: new FormControl(!!this.companyId ? this.companyId : '', this.isShowCompany ? Validators.required : null),
        locationId: new FormControl('', Validators.required),
        departmentId: new FormControl('', [Validators.required]),
        subDepartmentId: new FormControl(''),
        shiftId: new FormControl('', Validators.required),
        emailId: new FormControl('', [
          Validators.required,
          Validators.pattern(Constants.REGEX.EMAIL_PATTERN),
        ]),
        phone: new FormControl('', [
          Validators.required,
          // Validators.pattern(Constants.REGEX.PHONE_PATTERN)
        ]),
        name: new FormControl('', Validators.required),
        companyUsername: new FormControl('', Validators.required),
        employeeId: new FormControl('', Validators.required),
        isRecievingTextMessage: new FormControl(false),
        GetCommunicationMethod: new FormControl([], Validators.required),
        password: new FormControl('', [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(16),
        ]),
        confirmPassword: new FormControl('', Validators.required),
        isActive: new FormControl(true),
        roleId: new FormControl(5),
        vCode: new FormControl(''),
        userId: new FormControl(0),
        managerId: new FormControl(''),
      },
      {
        validators: this.validationService.confirmedValidator(
          'password',
          'confirmPassword',
        ),
      },
    );
  }

  redirectToSignIn() {
    this.router.navigate(['/login'])
  }
  onLocationChange(event: any) {
    const id = Number(event.currentTarget.value);
    if (!!id) {
      this.locationId = id;
      this.getDepartment();
      this.getManager();
      this.getShift();
      
    } else {
      this.locationId = 0;
      this.signUpForm.get('departmentId').setValue('');
      this.signUpForm.get('shiftId').setValue('');
      this.signUpForm.get('locationId').setValue('');
    }
    this.checkValidUser();
  }
  onCompanyChange(event: any) {
    console.log(event)
    const id = Number(event.detail.value);
    this.companyList.map((e)=>{
      if(e.companyId==event.detail.value){
        if(e.AppUrl!=null){
        localStorage.setItem(Constants.API_URL,e.AppUrl);
        }
        else{
          localStorage.setItem(Constants.API_URL,'0');
          return this.utilityService.showErrorToast("Backend server is not configured, please contact admin person")
        }
      
      }
    })
    if(localStorage.getItem(Constants.API_URL)=='0'){
      return;
    }
    if (!!id) {
      this.companyId = id;
      this.getDepartment();
      this.getManager();
      this.getShift();
      this.getLocation();
      
    } else {
      this.companyId = 0;
      this.departmentList = [];
      this.shiftList = [];
      this.managerUserList = [];
      this.signUpForm.get('departmentId').setValue('');
      this.signUpForm.get('shiftId').setValue('');
      this.signUpForm.get('locationId').setValue('');
    }
    this.checkValidUser();
  }

  onDepartmentChange(event) {
    const id = event.currentTarget.value;
    if (!!id) {
      this.shiftList = this.allShift;
      this.shiftList = this.shiftList.filter(x => x.departmentId === Number(id));
      this.getSubDeptByDepartment(Number(event.detail.value), this.companyId);
    } else {
      this.shiftList = [];
    }
    this.signUpForm.controls.shiftId.setValue('');
  }


  getSubDeptByDepartment(departmentId, companyId) {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoading();
    this.departmentService.getSubDeptByDepartment(departmentId, companyId)
      .then(response => {
        if (response['Success']) {
          this.utilityService.hideLoading();
          this.subDepartmentList = response['Data'];
        } else {
          this.utilityService.hideLoading();
          this.subDepartmentList = [];
        }
      }, err => {
        this.utilityService.hideLoading();
        this.subDepartmentList = [];
      });
  }

  getCompany() {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoading();
    this.companyService.getCompanyListWithOutPagination().then(res => {
      console.log(res,"company")
      if (res['Success']) {
        this.utilityService.hideLoading();
        this.companyList = res['Data'];
        if (!!this.companyName) {
          const index = this.companyList.findIndex(x => x.companyName.toLowerCase() === this.companyName.toLowerCase());
          if (index !== -1) {
            this.companyId = this.companyList[index].companyId;
            this.isShowCompany = !!this.companyId ? false : true;
            this.signUpForm.controls.companyId.setValue(this.companyId);
          } else {
            this.isShowCompany = true;
            this.utility.showErrorToast(Constants.COMPANY_NOT_EXIST_MSG);

          }
        } else {
          this.isShowCompany = true;
        }
        if (!!this.companyId) {
          this.getDepartment();
          this.getShift();
        }
      } else {
        this.utilityService.hideLoading();
        this.companyList = [];
      }
    }, err => {
      this.utilityService.hideLoading();
      this.companyList = [];
    });
  }

  getDepartment() {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoading();
    this.departmentService.getDepartmentListByCompanyId(null, this.companyId).then(res => {
      if (res['Success']) {
        this.utilityService.hideLoading();
        this.departmentList = res['Data'];
      } else {
        this.utilityService.hideLoading();
        this.departmentList = [];
      }
    }, err => {
      this.utilityService.hideLoading();
      this.departmentList = [];
    });
  }
  getManager() {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.userService.getAllManagerList(this.roleId = 4, this.companyId, this.locationId).then(res => {

      if (res['Success']) {
        this.managerUserList = res['Data'];
      } else { this.managerUserList = [];
       }
    }, err => { this.managerUserList = []; });
  }
  getShift() {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoading();
    this.shiftService.getShiftListByCompanyId(null, this.companyId).then(res => {
      if (res['Success']) {
        this.utilityService.hideLoading();
        this.allShift = res['Data'];
        this.shiftList = [];
      } else {
        this.utilityService.hideLoading();
        this.shiftList = []; this.allShift = [];
      }
    }, err => {
      this.utilityService.hideLoading();
      this.shiftList = []; this.allShift = [];
    })
  }

  getLocation() {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoading();
    this.locationService.getLocationListByCompany(this.companyId, null).then(res => {
      console.log(res)
      if (res['Success']) {
        this.utilityService.hideLoading();
        this.locationList = res['Data'];
      } else {
        this.utilityService.hideLoading();
        this.locationList = [];
      }
    }, err => {
      this.utilityService.hideLoading();
      this.locationList = [];
    });
  }

  checkValidUser() {
    if (!!this.signUpForm.controls.companyUsername.value && !!this.signUpForm.controls.employeeId.value && this.companyId) {
      if (!navigator.onLine) {
        return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      }
      this.utilityService.showLoading();
      this.authService.hasUserNameEmployeeIdExists(this.companyId, false, this.signUpForm.controls.companyUsername.value, this.signUpForm.controls.employeeId.value).then(res => {
        if (res['Success']) {
          this.utilityService.hideLoading();
          this.isValidUser = false;
          this.isShowManager = true;
        } else {
          this.utilityService.hideLoading();
          this.isValidUser = true;
          this.isShowManager = false;
          this.utilityService.showErrorToast(res['Message']);
        }
        this.utilityService.hideLoading();
      }, err => {
        this.utilityService.hideLoading();
      });
    } else {
      this.utilityService.hideLoading();
      this.isValidUser = true;
    }
  }

  initializeMessages() {
    this.messageList.companyId = {
      required: Constants.VALIDATION_MSG.SIGN_UP.COMPANY_REQUIRED
    };
    this.messageList.locationId = {
      required: Constants.VALIDATION_MSG.SIGN_UP.LOCATION_REQUIRED,
    };
    this.messageList.departmentId = {
      required: Constants.VALIDATION_MSG.SIGN_UP.DEPARTMENT_REQUIRED,
    };

    this.messageList.subDepartmentId = {
      required: Constants.VALIDATION_MSG.SUB_DEPARTMENT.SUB_DEPARTMENT_NAME_REQUIRED,
    };

    this.messageList.shiftId = {
      required: Constants.VALIDATION_MSG.SIGN_UP.SHIFT_REQUIRED,
    };
    this.messageList.email = {
      required: Constants.VALIDATION_MSG.SIGN_UP.EMAIL_REQUIRED,
      pattern: Constants.VALIDATION_MSG.SIGN_UP.EMAIL_INVALID,
    };
    this.messageList.phoneNumber = {
      required: Constants.VALIDATION_MSG.SIGN_UP.PHONE_REQUIRED,
      // pattern: Constants.VALIDATION_MSG.SIGN_UP.PHONE_INVALID
    };
    this.messageList.name = {
      required: Constants.VALIDATION_MSG.SIGN_UP.NAME_REQUIRED,
    };
    this.messageList.companyUsername = {
      required: Constants.VALIDATION_MSG.SIGN_UP.COMPANY_NAME_REQUIRED,
    };
    this.messageList.employeeId = {
      required: Constants.VALIDATION_MSG.SIGN_UP.EMPLOYEEID_REQUIRED,
    };
    this.messageList.password = {
      required: Constants.VALIDATION_MSG.SIGN_UP.PASSWORD_REQUIRED,
    };
    this.messageList.confirmPassword = {
      required: Constants.VALIDATION_MSG.SIGN_UP.CONFIRM_PASSWORD_REQUIRED,
      confirmedValidator: Constants.VALIDATION_MSG.SIGN_UP.PASSWORD_CONFIRM_PASSWORD_NOT_MATCH
    };
    this.messageList.GetCommunicationMethod = {
      required: Constants.VALIDATION_MSG.SIGN_UP.COMMUNICATION_METHOD_REQUIRED
    }
  }

  changeValue(event) {
    this.selectedItems = event.detail.value;
    this.signUpForm.controls.GetCommunicationMethod.setValue(this.selectedItems);
  }

  onSubmit() {
    this.formService.markFormGroupTouched(this.signUpForm);
    this.isSubmitted = true;
    if (this.signUpForm.invalid) {
      return;
    }
    if(localStorage.getItem(Constants.API_URL)=="0"){
      return this.utilityService.showErrorToast("Backend server is not configured, please contact admin person")
        }
    if (this.signUpForm.value.GetCommunicationMethod.length > 0) {
      const communicationMethod = this.signUpForm.value.GetCommunicationMethod.map(x => x.id.toString());
      this.signUpForm.get('GetCommunicationMethod').patchValue(communicationMethod);
    } else {
      this.signUpForm.get('GetCommunicationMethod').patchValue([]);
      this.utilityService.showErrorToast(Constants.VALIDATION_MSG.SIGN_UP.COMMUNICATION_METHOD_REQUIRED);
      return;
    }
    this.signUpForm.controls.companyId.setValue(Number(this.signUpForm.controls.companyId.value));
    this.signUpForm.controls.locationId.setValue(Number(this.signUpForm.controls.locationId.value));
    this.signUpForm.controls.departmentId.setValue(Number(this.signUpForm.controls.departmentId.value));
    if (!!this.signUpForm.value.subDepartmentId) {
      this.signUpForm.controls.subDepartmentId.setValue(Number(this.signUpForm.controls.subDepartmentId.value));
    }
    this.signUpForm.controls.shiftId.setValue(Number(this.signUpForm.controls.shiftId.value));
    const signUpData = {
      ...this.signUpForm.value,
    };
    delete signUpData.confirmPassword;

    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoading();
    this.authService.signUp(signUpData).then((res: any) => {
      if (res['Success']) {
        this.utilityService.hideLoading();
        this.utilityService.showSuccessToast('User signup successfully!');
        this.router.navigate(['/login']);
      } else {
        this.utilityService.hideLoading();
        this.utilityService.showErrorToast(res['Message']);
        this.selectedItems = [];
        this.methods = [];
        this.signUpForm.value.GetCommunicationMethod.forEach(element => {
          const getMethod = this.dropdownList.find(x => x.id == Number(element));
          if (!!getMethod) {
            this.methods.push(getMethod);
          }
        });
        this.selectedItems = this.methods;
        this.signUpForm.get('GetCommunicationMethod').patchValue(this.methods);
      }
    });
  }

}
