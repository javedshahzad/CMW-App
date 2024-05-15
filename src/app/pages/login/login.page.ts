import { Component, NgZone, OnInit, Output, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { Constants, ContentEnum } from '../../constant/constants';
import { ModalController, Platform } from '@ionic/angular';
import { TermsPage } from '../terms/terms.page';
import { AuthService } from '../../services/auth/auth.service';
import { defaultRoutes } from '../../services/auth/default-routes';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { CompanyService } from 'src/app/services/company/company.service';
import { File } from '@ionic-native/file/ngx';
import { Title } from '@angular/platform-browser';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { TermsConditionService } from 'src/app/services/terms-condition/terms-condition.service';
import {
  DocumentViewer,
  DocumentViewerOptions,
} from '@ionic-native/document-viewer/ngx';
import { FormService } from '../../services/form/form.service';
import { environment } from 'src/environments/environment';
import { SignIn } from '../../models/signIn.model';
import { EventsService } from 'src/app/services/events/events.service';
import { AllowRolePage } from '../allow-role/allow-role.page';
import { userRoleSubject } from 'src/app/services/userRoleSubject.service';
import { BsModalRef } from 'ngx-bootstrap/modal';
import {
  FingerprintAIO,
  FingerprintOptions,
} from '@ionic-native/fingerprint-aio/ngx';
import { UserService } from 'src/app/services/user/user.service';
import { BiometricAuthService } from 'src/app/services/biometric-auth.service';
// import { FingerprintAIO } from 'ionic-native'
@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  public cacheFolder: any = 'coverMyWork_temp';
  public cacheFolderPath: any;
  public folderResolved: any;
  public folderCommon: any;
  public liveUrl: any;
  public messageList: any = new SignIn();
  isShowCompany: boolean = true;
  companyList = [];
  companyName = '';
  public loginForm: FormGroup;
  public signInForm: any;
  public companyId: any;
  public userClaims: any = {};
  isSubmitted: boolean = false;
  title = Constants.TERMS_CONDITION;
  contentType = ContentEnum;
  type: any;
  appName = environment.APP_NAME;
  logoUrl = '';
  webUrl = '';
  public api_url: any;
  public AppCompanyId: any;
  password: any;
  userName: string;
  modalRef: BsModalRef;
  userData: any;
  companyApiCallCounter: number = 0;
  public isBiometric = true;
  public isAvailable = false;
  public isPasswordAvailable = false;
  public isFaceId = false;
  isMultiple: boolean = false;
  changeCompany = true;
  userCompanyId: any;
  userCompanyName: any;
  showCompanyName: boolean = false;
  isChangeCompany: boolean = false;
  fingerPrintCompanyId: any;
  isFingerPrint: boolean = true;
  BiometricCheck: any = false;
  validationChecker: any;
  IsEnabledBiometric: string;
  IsLogoutFromDasboard: string;

  constructor(
    private formService: FormService,
    private userRoleSubjectService: userRoleSubject,
    public platform: Platform,
    private termService: TermsConditionService,
    private fileOpener: FileOpener,
    private file: File,
    private companyService: CompanyService,
    public router: Router,
    private utilityService: UtilityService,
    public fb: FormBuilder,
    private titleService: Title,
    public modal: ModalController,
    private authService: AuthService,
    private document: DocumentViewer,
    private events: EventsService,
    private ngZone: NgZone,
    private faio: FingerprintAIO,
    private userService: UserService,
    private activeRoute: ActivatedRoute,
    private BiometricSr :BiometricAuthService
  ) {
    this.userName = localStorage.getItem(Constants.USERNAME);
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.IsEnabledBiometric = localStorage.getItem('IsEnabledBiometric') ? localStorage.getItem('IsEnabledBiometric') : "";
    this.IsLogoutFromDasboard = localStorage.getItem('IsLogoutFromDasboard') ? localStorage.getItem('IsLogoutFromDasboard') : "";
    if (this.activeRoute.snapshot.queryParams.session == 'invalid') {
      localStorage.setItem('canCheckFingerPrint', 'false');
    }
    this.companyApiCallCounter = 0;
    this.isSubmitted = false;
    if (localStorage.getItem(Constants.COMPANY_NAME)) {
      this.companyName = localStorage.getItem(Constants.COMPANY_NAME);
    }
    if (localStorage.getItem(Constants.USERNAME)) {
      this.userName = localStorage.getItem(Constants.USERNAME);
    }
    if (localStorage.getItem('password')) {
      this.password = localStorage.getItem('password');
      // if (this.password != null || this.password != undefined) {
      //   this.isPasswordAvailable = true;
      // }
    }

    if (this.platform.is('ios')) {
      this.isFaceId = true;
    } else {
      this.isFaceId = false;
    }
    if(this.IsLogoutFromDasboard === "false" && this.IsEnabledBiometric === "true") {
      this.showFingeerprintAuthentication();
    }
    //   if(localStorage.getItem(Constants.API_URL)){
    //   if(localStorage.getItem(Constants.API_URL)!="0"){
    //     this.api_url = localStorage.getItem(Constants.API_URL)
    //   }
    //   else{
    //     localStorage.setItem(Constants.API_URL,environment.APP_URL)
    //   }
    // }

    localStorage.setItem(Constants.API_URL, environment.APP_URL);
    // }
    // this.getCompanyList();
    this.userCompanyName = localStorage.getItem(Constants.COMPANY_NAME);
    if (!!this.userCompanyName) {
      this.showCompanyName = true;
      this.isChangeCompany = true;
    }
    this.formInit();
  }

  getCompanyList(userName) {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoading();
    this.companyService.getUserCompanyList(userName).then(
      (res) => {
        this.isFingerPrint = false;
        if (res['Success']) {
          this.utilityService.hideLoading();
          this.companyList = res['Data'];
          // if (Number(localStorage.getItem(Constants.APPCOMPANYID))) {
          //   this.signInForm.controls.companyId.setValue(
          //     Number(localStorage.getItem(Constants.APPCOMPANYID))
          //   );
          // }
          if (this.changeCompany == false) {
            this.companyList = res['Data'];
          }
          let selectedUserName = localStorage.getItem(Constants.USERNAME);
          let selectedCompanyId = localStorage.getItem(
            Constants.RETURNING_COMPANYID
          );
          localStorage.setItem(
            'password',
            encodeURIComponent(this.signInForm.controls.password.value)
          );
          if (res['Data'] == null) {
            if (this.isFingerPrint == false) {
              this.utilityService.showErrorToast(
                Constants.VALIDATION_MSG.SIGN_UP.USER_INVALID
              );
              return;
            }
          }
          if (res['Data'].length > 1) {
            if (
              selectedUserName ==
                this.signInForm.controls.companyUserName.value &&
              selectedCompanyId != null
            ) {
              if (this.changeCompany == false) {
                this.userCompanyId = this.signInForm.controls.companyId.value;
              } else {
                if (
                  this.changeCompany == true &&
                  this.signInForm.controls.companyId.value != 0
                ) {
                  this.userCompanyId = this.signInForm.controls.companyId.value;
                } else {
                  this.userCompanyId = selectedCompanyId;
                }
              }
            } else if (
              selectedUserName ==
                this.signInForm.controls.companyUserName.value &&
              selectedCompanyId == this.signInForm.controls.companyId.value &&
              this.changeCompany == false
            ) {
              this.userCompanyId = this.signInForm.controls.companyId.value;
            } else {
              this.isMultiple = true;
              this.userCompanyId = this.signInForm.controls.companyId.value;
            }
            localStorage.setItem(Constants.COMPANYID, this.userCompanyId);
          }
          if (res['Data'].length == 1) {
            this.isMultiple = false;
            this.userCompanyId = this.companyList[0].companyId;
            if (this.changeCompany == false) {
              this.isMultiple = true;
            }
            localStorage.setItem(
              Constants.COMPANYID,
              this.companyList[0].companyId
            );
          }

          if (this.changeCompany == true) {
            const userData =
              'username=' +
              encodeURIComponent(
                this.signInForm.controls.companyUserName.value
              ) +
              '&password=' +
              encodeURIComponent(this.signInForm.controls.password.value) +
              '&grant_type=password' +
              '&companyId=' +
              this.userCompanyId +
              '&isMobile=' +
              true;
            this.loginApiCall(userData);
          }
          if (!!this.companyName) {
            const index = this.companyList.findIndex(
              (x) =>
                x.companyName.toLowerCase() === this.companyName.toLowerCase()
            );
            // if (index !== -1) {
            //   this.companyId = this.companyList[index].companyId;
            //   this.isShowCompany = !!this.companyId ? false : true;
            //   this.signInForm.controls.companyId.setValue(this.companyId);
            //   sessionStorage.setItem(Constants.COMPANY_NAME, this.companyName);
            //   this.companyList.map((e)=>{
            //     if(e.companyId==this.companyId){
            //       if(e.AppUrl!=null){
            //         localStorage.setItem(Constants.API_URL,e.AppUrl);
            //         }
            //         else{
            //           localStorage.setItem(Constants.API_URL,'0');
            //           return this.utilityService.showErrorToast("Backend server is not configured, please contact admin person")
            //         }
            //     }
            //   })
            // } else {
            //   this.isShowCompany = true;
            //   // this.utilityService.showErrorToast(Constants.COMPANY_NOT_EXIST_MSG);
            //   sessionStorage.clear();
            // }
            if (index !== -1) {
              this.companyId = this.companyList[index].companyId;
              this.AppCompanyId = this.companyList[index].AppCompanyId;
              this.isShowCompany = !!this.companyId ? false : true;
              this.signInForm.controls.companyId.setValue(this.companyId);
              sessionStorage.setItem(Constants.COMPANY_NAME, this.companyName);
              this.companyList.map((e) => {
                if (e.AppCompanyId == this.AppCompanyId) {
                  if (e.AppUrl != null) {
                    localStorage.setItem(Constants.API_URL, e.AppUrl);
                  } else {
                    localStorage.setItem(Constants.API_URL, '0');
                    return this.utilityService.showErrorToast(
                      'Backend server is not configured, please contact admin person'
                    );
                  }
                }
              });
            } else {
              this.isShowCompany = true;
              // this.utilityService.showErrorToast(Constants.COMPANY_NOT_EXIST_MSG);
              sessionStorage.clear();
            }
          } else {
            this.isShowCompany = true;
            sessionStorage.clear();
          }
        } else {
          if (this.companyApiCallCounter < 10) {
            setTimeout(() => {
              this.getCompanyList(userName);
            }, 5000);
            this.companyApiCallCounter++;
          }
          // this.utilityService.hideLoading();
          this.companyList = [];
          sessionStorage.clear();
        }
      },
      (err) => {
        if (this.companyApiCallCounter < 10) {
          setTimeout(() => {
            this.getCompanyList(userName);
          }, 5000);
          this.companyApiCallCounter++;
        }
        // this.utilityService.hideLoading();
        this.companyList = [];
        sessionStorage.clear();
      }
    );
  }

  formInit() {
    this.signInForm = this.fb.group({
      companyId: [''],
      companyUserName: new FormControl(!!this.userName ? this.userName : '', [
        Validators.required,
      ]),
      password:new FormControl(!!this.password ? this.password : '', [
        Validators.required,
      ]),
    });
    // this.signInForm.controls.password.setValue(
    //   encodeURIComponent(this.signInForm.controls.password.value)
    // );
    if (this.signInForm.controls.companyUserName.valid) {
      this.isBiometric = false;
    }
    this.initializeMessages();
  }

  redirectToSignIn() {
    this.router.navigate(['/signup']);
  }

  setUserClaims() {
    localStorage.setItem(Constants.IS_SWAP, this.userClaims.isSwap);
    localStorage.setItem(Constants.IS_TRAINING, this.userClaims.isTraining);
    localStorage.setItem(Constants.IS_TRANSFER, this.userClaims.isTransfer);
    localStorage.setItem(Constants.IS_VOT, this.userClaims.isVot);
    localStorage.setItem(
      Constants.IS_VTO,
      !!this.userClaims.isVto ? this.userClaims.isVto : false
    );
    localStorage.setItem(
      Constants.IS_CALL_OFF,
      !!this.userClaims.isCallOff ? this.userClaims.isCallOff : false
    );
    localStorage.setItem(
      Constants.IS_EARLY_OUT,
      !!this.userClaims.isEarlyOut ? this.userClaims.isEarlyOut : false
    );
    localStorage.setItem(
      Constants.IS_FLEX_WORK,
      !!this.userClaims.isFlexWork ? this.userClaims.isFlexWork : false
    );
    localStorage.setItem(
      Constants.IS_LATE_IN,
      !!this.userClaims.isLateIn ? this.userClaims.isLateIn : false
    );
    localStorage.setItem(
      Constants.IS_CLOCK_IN_OUT,
      !!this.userClaims.isCheckInOut ? this.userClaims.isCheckInOut : false
    );
  }

  initializeMessages() {
    this.messageList.companyId = {
      required: Constants.VALIDATION_MSG.SIGN_UP.COMPANY_REQUIRED,
    };
    this.messageList.companyUserName = {
      required: Constants.VALIDATION_MSG.SIGN_UP.COMPANY_NAME_REQUIRED,
    };
    if (this.isBiometric) {
      this.messageList.password = {
        required: Constants.VALIDATION_MSG.SIGN_UP.PASSWORD_REQUIRED,
      };
    }
  }

  redirectToForgot() {
    this.router.navigate(['/forgot-password']);
  }

  changeUserCompany(userName) {
    this.isMultiple = true;
    this.changeCompany = false;
    this.getCompanyList(userName);
  }

  signIn() {
    this.formService.markFormGroupTouched(this.signInForm);
    this.changeCompany = true;
    this.isSubmitted = true;
    this.getCompanyList(this.signInForm.controls.companyUserName.value);
    if (this.signInForm.invalid) {
      if (!this.isBiometric) {
        if (
          this.signInForm.controls.companyId.invalid ||
          this.signInForm.controls.companyUserName.invalid
        ) {
          return;
        }
      } else {
        return;
      }
    }
    if (localStorage.getItem(Constants.API_URL) == '0') {
      return this.utilityService.showErrorToast(
        'Backend server is not configured, please contact admin person'
      );
    }
    //localStorage.clear();
    localStorage.removeItem('configuredUserName');
    localStorage.removeItem('password');
    this.signInForm.controls.companyId.setValue(
      Number(localStorage.getItem(Constants.COMPANYID))
    );
    if (this.isAvailable) {
      this.signInForm.controls.password.setValue(
        decodeURIComponent(localStorage.getItem('password'))
      );
      if (
        this.signInForm.controls.companyUserName.value !=
        localStorage.getItem(Constants.USERNAME)
      ) {
        this.signInForm.controls.password.setValue('');
      }
      this.isAvailable = false;
    }

    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
  }
  loginApiCall(userData, isUserConfigured = false) {
    this.utilityService.showLoading();
    this.authService.login(userData).then(
      (res: any) => {
        if (res) {
          this.utilityService.hideLoading();
          localStorage.setItem(Constants.TOKEN, res.access_token);
          this.utilityService.showLoading();
          this.authService.getUserData().then(
            (res) => {
              if (res['Success']) {
                this.utilityService.hideLoading();
                this.companyList.forEach((item) => {
                  if (item.companyId == res['Data'].companyId) {
                    localStorage.setItem(
                      Constants.COMPANY_NAME,
                      item.companyName
                    );
                    localStorage.setItem(
                      Constants.RETURNING_COMPANYID,
                      item.companyId
                    );
                  }
                });
                localStorage.setItem(Constants.USERNAME, res['Data'].userName);

                // localStorage.setItem(Constants.COMPANYID, res['Data'].companyId);
                if (
                  res['Data'].companyId !=
                  localStorage.getItem(Constants.COMPANYID)
                ) {
                  let id: any = Number(
                    localStorage.getItem(Constants.COMPANYID)
                  );
                  localStorage.setItem(Constants.COMPANYID, id);
                } else {
                  localStorage.setItem(
                    Constants.COMPANYID,
                    res['Data'].companyId
                  );
                }
                // localStorage.setItem(Constants.ROLE, res['Data'].isLoginRoles);
                localStorage.setItem(
                  Constants.ROLE,
                  !!res['Data'].isLoginRoles &&
                    res['Data'].isLoginRoles.length > 0
                    ? res['Data'].isLoginRoles
                    : res['Data'].roleId
                );
                localStorage.setItem(Constants.USERID, res['Data'].userId);
                localStorage.setItem(Constants.SHIFTID, res['Data'].shiftId);
                localStorage.setItem(
                  Constants.DEPARTMENTID,
                  res['Data'].departmentId
                );
                localStorage.setItem(
                  Constants.LOCATIONID,
                  res['Data'].locationId
                );
                localStorage.setItem(
                  Constants.PRICINGID,
                  res['Data'].pricingId
                );
                localStorage.setItem(Constants.IS_SWAP, res['Data'].isSwap);
                localStorage.setItem(
                  Constants.IS_TRAINING,
                  res['Data'].isTraining
                );
                localStorage.setItem(
                  Constants.IS_TRANSFER,
                  res['Data'].isTransfer
                );
                localStorage.setItem(Constants.IS_VOT, res['Data'].isVot);
                localStorage.setItem(
                  Constants.IS_TERMS_UPDATE,
                  res['Data'].isTermsUpdated
                );
                localStorage.setItem(
                  Constants.IS_VTO,
                  !!res['Data'].isVto ? res['Data'].isVto : false
                );
                localStorage.setItem(
                  Constants.IS_CALL_OFF,
                  !!res['Data'].isCallOff ? res['Data'].isCallOff : false
                );
                localStorage.setItem(
                  Constants.IS_EARLY_OUT,
                  !!res['Data'].isEarlyOut ? res['Data'].isEarlyOut : false
                );
                localStorage.setItem(
                  Constants.IS_FLEX_WORK,
                  !!res['Data'].isFlexWork ? res['Data'].isFlexWork : false
                );
                localStorage.setItem(
                  Constants.IS_TIME_OFF,
                  !!res['Data'].isTimeKeeping
                    ? res['Data'].isTimeKeeping
                    : false
                );
                localStorage.setItem(
                  Constants.IS_LATE_IN,
                  !!res['Data'].isLateIn ? res['Data'].isLateIn : false
                );
                localStorage.setItem(
                  Constants.IS_CLOCK_IN_OUT,
                  !!res['Data'].isCheckInOut ? res['Data'].isCheckInOut : false
                );
                // this.userModalOrRedirect(
                //   res['Data'].isAllowAsAUser,
                //   res['Data'].roleId
                // );
                this.userRoleSubjectService.setUserRole(
                  parseInt(res['Data'].roleId)
                );
                this.events.publish('IS_LOGIN', true);
                this.registerUser();
                // this.router.navigate([defaultRoutes[res['Data'].roleId]]);
                this.companyList.map((e) => {
                  if (e.AppCompanyId == res['Data'].companyId) {
                    localStorage.setItem(Constants.COMPANY_NAME, e.companyName);
                  }
                });
                //device identifier
                let identifier = localStorage.getItem('identifierUser');
                if (
                  !!identifier &&
                  identifier != 'null' &&
                  identifier != 'undefined'
                ) {
                  if (identifier.toString() !== res['Data'].userId.toString()) {
                    localStorage.removeItem(Constants.IDENTIFIER);
                  }
                }
                let userRoleId = localStorage.getItem('identifierUser');
                if (
                  !!userRoleId &&
                  userRoleId != 'null' &&
                  userRoleId != 'undefined'
                ) {
                  if (userRoleId.toString() !== res['Data'].userId.toString()) {
                    localStorage.removeItem('roleId');
                  }
                }
                this.userModalOrRedirect(
                  res['Data'].isAllowAsAUser,
                  res['Data'].roleId,
                  userData
                );
                this.isMultiple = false;
              } else {
                this.utilityService.hideLoading();
                this.utilityService.showErrorToast(res['Message']);
                this.signInForm.controls.password.setValue('');
              }
            },
            (err) => {
              this.utilityService.hideLoading();
              this.signInForm.controls.password.setValue('');
              localStorage.removeItem('configuredUserName');
              localStorage.removeItem('password');
            }
          );
        } else {
          this.utilityService.hideLoading();
          this.utilityService.showErrorToast(res['Message']);
          this.signInForm.controls.password.setValue('');
          localStorage.removeItem('configuredUserName');
          localStorage.removeItem('password');
        }
      },
      (err) => {
        this.utilityService.hideLoading();
        if (this.isFingerPrint == false) {
          this.utilityService.showErrorToast(
            Constants.VALIDATION_MSG.CHECK_CREDENTIALS
          );
        } else if (!this.validationChecker) {
          this.utilityService.showErrorToast(
            Constants.VALIDATION_MSG.CHECK_CREDENTIALS
          );
        }
        if (!this.validationChecker) {
          this.utilityService.showErrorToast(
            Constants.VALIDATION_MSG.CHECK_CREDENTIALS
          );
        }
        // this.signInForm.controls.password.setValue('');
        this.signInForm.controls.companyId.setValue('');
        //this.userModalOrRedirect(roleId);
        localStorage.removeItem('configuredUserName');
      }
    );
  }
  async openTerms(data) {
    if (data === 1) {
      this.type = this.contentType.TNC;
      this.title = Constants.TERMS_CONDITION;
      this.openModalTerms();
    } else {
      this.type = this.contentType.PrivacyPolicy;
      this.title = Constants.PRIVACY;
      let fileName = 'Privacy';
      // this.downloadFile(fileName);
      this.openLocalPdf(fileName);
    }
  }

  downloadFile(fileName) {
    let file = fileName;
    let type;
    if (file.includes('pdf')) {
      type = 'application/pdf';
    } else if (file.includes('csv')) {
      type = 'text/csv';
    } else if (file.includes('xlt')) {
      type = 'application/vnd.ms-excel';
    } else if (file.includes('doc')) {
      type = 'application/msword';
    } else if (file.includes('docx')) {
      type =
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    }
  }

  openLocalPdf(fileName) {
    let filePath = this.file.applicationDirectory + 'www/assets/attachment';

    if (this.platform.is('android')) {
      let fakeName = Date.now();
      this.file
        .copyFile(
          filePath,
          'PrivacyPolicy.pdf',
          this.file.dataDirectory,
          `${fileName}.pdf`
        )
        .then((result) => {
          this.fileOpener
            .open(result.nativeURL, 'application/pdf')
            .then(() => console.log('File is opened'))
            .catch((e) => console.log('Error opening file'));
        });
    } else {
      // filePath = this.file.documentsDirectory + 'www/assets/attachment';
      // Use Document viewer for iOS for a better UI
      const options: DocumentViewerOptions = {
        title: 'My PDF',
      };
      this.document.viewDocument(
        `${filePath}/PrivacyPolicy.pdf`,
        'application/pdf',
        options
      );
    }
  }

  async openModalTerms() {
    const modal = await this.modal.create({
      component: TermsPage,
      cssClass: 'terms_class',
      componentProps: {
        title: Constants.TERMS_CONDITION,
        contentType: this.type,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        if (dataReturned.data != undefined) {
        }
      }
    });
    return await modal.present();
  }

  async openModalSelectRole(userData) {
    const modal = await this.modal.create({
      component: AllowRolePage,
      cssClass: 'terms_class',
      componentProps: {
        userData: userData,
      },
    });

    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        if (dataReturned.data != undefined) {
        }
      }
    });
    //  this.userData = this.loginForm.value

    return await modal.present();
  }

  getCompany(event: any) {
    localStorage.setItem(Constants.APPCOMPANYID, event.detail.value);
    this.companyList.map((e: any) => {
      if (e.companyId == event.detail.value) {
        localStorage.setItem(Constants.COMPANYID, e.AppCompanyId);
        if (e.AppUrl != null) {
          localStorage.setItem(Constants.API_URL, e.AppUrl);
        } else {
          localStorage.setItem(Constants.API_URL, '0');
          return this.utilityService.showErrorToast(
            'Backend server is not configured, please contact admin person'
          );
        }
      }
    });
  }

  registerUser() {
    let _deviceToken = localStorage.getItem(Constants.DEVICETOKEN);
    let _deviceType = localStorage.getItem(Constants.DEVICETYPE);
    let _usrId = localStorage.getItem(Constants.USERID);

    if (!!_deviceToken) {
      this.authService
        .addDeviceInfo({
          DeviceId: _deviceToken,
          DeviceType: _deviceType,
          UserId: _usrId,
        })
        .then(
          (res: any) => {
            console.log(res);
          },
          (err) => {}
        );
    }
  }

  userModalOrRedirect(isAllowAsUser, role, userData) {
    let userRoles = localStorage.getItem(Constants.ROLE);
    let roleCount = userRoles.split(',');
    if (isAllowAsUser && roleCount.length > 1) {
      this.openModalSelectRole(userData);
    }
    if(this.IsEnabledBiometric === "" || this.IsEnabledBiometric === "false"){
      this.BiometricSr.BiometricAuthentication().then(async (result)=>{
        localStorage.setItem("IsEnabledBiometric","true");
        if(this.IsEnabledBiometric === "" || this.IsEnabledBiometric === "false"){
          this.utilityService.presentToast("Biometric login is configured for future Login's");
        }
        this.router.navigate([defaultRoutes[roleCount[0]]]);
      }).catch((error:any)=>{
        console.log(error)
        if(error.error.code === -101 || error.error.code === -106){
          localStorage.setItem("IsEnabledBiometric","false");
          this.router.navigate([defaultRoutes[roleCount[0]]]);
        } else if(error.message == "Biometric not available"){
          localStorage.setItem("IsEnabledBiometric","false");
          this.router.navigate([defaultRoutes[roleCount[0]]]);
        }
      })
    }else{
      this.router.navigate([defaultRoutes[roleCount[0]]]);
    }
  }
  // loginFaceID(){

  //   const opt: FingerprintOptions = {
  //     title: 'Fingerprint - FaceID authentication',
  //     subtitle: "It's quick and easy",
  //     description: '',
  //     fallbackButtonTitle: 'Use Pin',
  //     cancelButtonTitle: 'Cancel',
  //     disableBackup: false
  //   }
  //   this.faio.show(opt)
  //     .then((result) => {
  //       console.log(result)
  //       // What should I do here ???
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     })

  // }

  async configureFingerPrint() {
    this.BiometricCheck = true;
    localStorage.setItem('BiometricCheck', this.BiometricCheck);
    this.formService.markFormGroupTouched(this.signInForm);
    if (this.signInForm.invalid) {
      if (
        this.signInForm.controls.companyId.invalid ||
        this.signInForm.controls.companyUserName.invalid
      ) {
        return;
      }
    }
    if (localStorage.getItem(Constants.API_URL) == '0') {
      return this.utilityService.showErrorToast(
        'Backend server is not configured, please contact admin person'
      );
    }
    localStorage.setItem(
      'configuredUserName',
      this.signInForm.controls.companyUserName.value
    );
    localStorage.setItem(
      'password',
      encodeURIComponent(this.signInForm.controls.password.value)
    );
    await this.companyService
      .getUserCompanyList(this.signInForm.controls.companyUserName.value)
      .then((res: any) => {
        this.isFingerPrint = true;
        if (
          this.signInForm.controls.companyId.value == '' ||
          this.signInForm.controls.companyId.value == null
        ) {
          if (res['Data'] == null) {
            this.validationChecker = res['Data'];
            if (this.isFingerPrint == true) {
              this.validationChecker = true;
              this.utilityService.showErrorToast(
                Constants.VALIDATION_MSG.SIGN_UP.USER_INVALID
              );
              return;
            }
            return;
          }
          if (res['Data'].length == 1) {
            this.fingerPrintCompanyId = res['Data'][0].companyId;
            localStorage.setItem(
              Constants.COMPANY_NAME,
              res['Data'][0].companyName
            );
            localStorage.setItem(
              Constants.RETURNING_COMPANYID,
              this.fingerPrintCompanyId
            );
          } else if (res['Data'].length > 1) {
            if (!!localStorage.getItem(Constants.RETURNING_COMPANYID)) {
              this.isMultiple = false;
              this.fingerPrintCompanyId = localStorage.getItem(
                Constants.RETURNING_COMPANYID
              );
            } else {
              this.isMultiple = true;
              this.companyList = res['Data'];
            }
          }
        }
        if (
          res['Data'].length > 1 &&
          !!this.signInForm.controls.companyId.value
        ) {
          this.fingerPrintCompanyId = this.signInForm.controls.companyId.value;
        }
      });
    localStorage.setItem(Constants.COMPANYID, this.fingerPrintCompanyId);
    const userData =
      'username=' +
      encodeURIComponent(this.signInForm.controls.companyUserName.value) +
      '&password=' +
      encodeURIComponent(this.signInForm.controls.password.value) +
      '&grant_type=password' +
      '&companyId=' +
      this.fingerPrintCompanyId +
      '&isMobile=' +
      true;
    this.loginApiCall(userData, true);
  }

  userNameChange() {
    this.isMultiple = false;
    this.signInForm.patchValue({
      companyId: '',
    });
  }

  public showFingeerprintAuthentication() {
    const password = localStorage.getItem('password');
    if (!!password) {
      this.faio
        .isAvailable()
        .then(() => {
          this.faio
            .show({
              cancelButtonTitle: 'Cancel',
              disableBackup: true,
              title: 'CoverMyWork',
              fallbackButtonTitle: 'FB Back Button',
            })
            .then(() => {
              const userName = encodeURIComponent(
                localStorage.getItem('configuredUserName')
              );
              const formPassword = this.signInForm.controls.password.value;
              const formUsername =
                this.signInForm.controls.companyUserName.value;
              if (
                formUsername !== userName &&
                userName == 'null' &&
                formPassword === ''
              ) {
                this.utilityService.showErrorToast(
                  'Provided username is not configured for auto login. Enter password for username to re-configure auto login.',
                  5000
                );
                return;
              }
              if (!!this.signInForm.controls.password.value) {
                this.configureFingerPrint();
              } else {
                localStorage.setItem(
                  Constants.COMPANYID,
                  localStorage.getItem(Constants.RETURNING_COMPANYID)
                );
                this.isBiometric = false;
                const userData =
                  'username=' +
                  formUsername +
                  '&password=' +
                  localStorage.getItem('password') +
                  '&grant_type=password' +
                  '&companyId=' +
                  localStorage.getItem(Constants.RETURNING_COMPANYID) +
                  '&isMobile=' +
                  true;
                this.loginApiCall(userData);
              }
            })
            .catch((error) => {
              console.log(error);
              if (!!error) {
                if (error.code !== -108) {
                  this.utilityService.showErrorToast(
                    'Please go to settings and allow CovermyWork to use "Face ID"',
                    5000
                  );
                }
              }
              this.isAvailable = false;
            });
        })
        .catch((error) => {
          console.log(error);
          this.isAvailable = false;
          if (
            !!error &&
            !!error.code &&
            (error.code == -100 || error.code == -104)
          ) {
            this.utilityService.showErrorToast(
              'Face Id is not supported in this device, please try normal login '
            );
            return;
          }
          if (!!error && !!error.code && error.code == -105) {
            this.utilityService.showErrorToast(
              'Please go to settings and allow CovermyWork to use "Face ID"',
              5000
            );
            return;
          }
          this.utilityService.showErrorToast(
            'Please go to settings and allow CovermyWork to use "Face ID"',
            5000
          );
        });
    } else {
      // faceId not configured
      this.faio.isAvailable().then(() => {
        this.configureFingerPrint();
      });
    }
  }
}
