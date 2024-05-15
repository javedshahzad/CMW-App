import { Component, NgZone } from '@angular/core';
import { MenuController, AlertController, Platform } from '@ionic/angular';
import { NavigationExtras, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Constants, DeviceTypeEnum } from './constant/constants';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { UtilityService } from './services/utility/utility.service';
import { EventsService } from './services/events/events.service';
import { AuthService } from './services/auth/auth.service';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Network } from '@ionic-native/network/ngx';
import { UserService } from './services/user/user.service';
import { userRoleSubject } from './services/userRoleSubject.service';
import { FingerprintAIO ,FingerprintOptions} from '@ionic-native/fingerprint-aio/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  ionAppName: string;
  ionPackageName: string;
  ionVersionNumber: string;
  ionVersionCode: string|number;
  public offline: number = 0;
  alertConfirm: any;
  public appName: any;
  public subscribe: any;
  deviceType = DeviceTypeEnum;
  deviceTypeId: any;
  public pages = [
    {
      title: 'Home',
      url: '/tabs',
      subs: [],
      isEnabled: false,
      icon: 'home',
    },
    {
      title: 'Profile',
      url: '/edit-profile',
      subs: [],
      isEnabled: false,
      icon: 'person-circle',
    },

    {
      icon: 'key',
      title: 'Change Password',
      url: '/change-password',
      subs: [],
      isEnabled: false,
    },
    // {
    //   icon:"log-out",
    //   title: 'Logout',
    //   subs: [],
    //   isEnabled: false,
    // },
  ];

  constructor(
    private platform: Platform,
    private router: Router,
    private location: Location,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private utility: UtilityService,
    private events: EventsService,
    private authService: AuthService,
    private deepLinks: Deeplinks,
    public alertController: AlertController,
    public network: Network,
    public ngZone: NgZone,
    private userService: UserService,
    private userSubjectService: userRoleSubject,
    private faio: FingerprintAIO,
    private utilityService: UtilityService,
    private appVersion: AppVersion
  ) {
    localStorage.setItem('canCheckFingerPrint',"true");
    this.userSubjectService.getUserRole().subscribe((userId) => {
      if (userId === null) {
        userId = parseInt(localStorage.getItem(Constants.ROLE));
      }
      this.pages = [
        {
          title: 'Home',
          url: userId === 3 ? '/tabs/pending-requests' : '/tabs/my-requests',
          subs: [],
          isEnabled: false,
          icon: 'home',
        },
        {
          title: 'Profile',
          url: '/edit-profile',
          subs: [],
          isEnabled: false,
          icon: 'person-circle',
        },

        {
          icon: 'key',
          title: 'Change Password',
          url: '/change-password',
          subs: [],
          isEnabled: false,
        },
        // {
        //   icon:"log-out",
        //   title: 'Logout',
        //   subs: [],
        //   isEnabled: false,
        // },
      ];
    });
    this.initializeApp();
    this.callConfiguration();
    this.events.subscribe('is_redirect_home', (value: any) => {
      if (value) {
        this.pages.forEach((element) => {
          if (element.title == 'Home') {
            element.isEnabled = true;
          } else {
            element.isEnabled = false;
          }
        });
      }
    });

    this.events.subscribe('is_redirect_home', (value: any) => {
      if (value) {
        this.pages.forEach((element) => {
          if (element.title == 'Home') {
            element.isEnabled = true;
          } else {
            element.isEnabled = false;
          }
        });
      }
    });

    this.events.subscribe('change_password_menu', (value: any) => {
      if (value) {
        this.pages.forEach((element) => {
          if (element.title == 'Change Password') {
            element.isEnabled = true;
          } else {
            element.isEnabled = false;
          }
        });
      }
    });

    this.events.subscribe('profile_menu', (value: any) => {
      if (value) {
        this.pages.forEach((element) => {
          if (element.title == 'Profile') {
            element.isEnabled = true;
          } else {
            element.isEnabled = false;
          }
        });
      }
    });

    platform.ready().then(() => {
      this.appVersion.getAppName().then(res => {
        this.ionAppName = res;
      }).catch(error => {
        console.log(error);
      });
      this.appVersion.getPackageName().then(res => {
        this.ionPackageName = res;
      }).catch(error => {
        console.log(error);
      });
      this.appVersion.getVersionNumber().then(res => {
        this.ionVersionNumber = res;
      }).catch(error => {
        console.log(error);
      });
      this.appVersion.getVersionCode().then(res => {
        this.ionVersionCode = res;
      }).catch(error => {
        console.log(error);
      });
  });
  
}

  initializeApp() {
    this.platform.ready().then(() => {
      localStorage.setItem("IsLogoutFromDasboard","false");
      // let userData = localStorage.getItem("AAT_User");
      // if (userData != null || userData != undefined) {
      //  this.showFingeerprintAuthentication();

      // }
      // else {
      //   this.router.navigate(["/tabs/login"])
      // }

      this.deepLinks.route({}).subscribe(
        (match) => {
          console.log('===', match.$link);
          if (match.$link.url.includes('/recovery-password')) {
            this.router.navigate([
              '/recovery-password',
              { token: match.$link.url },
            ]);
          }
          this.utility.presentToast('DONE');
        },
        (noMatch) => {
          if (noMatch.$link) {
            console.log('===', noMatch.$link);
            if (noMatch.$link.url.includes('/recovery-password')) {
              this.router.navigate([
                '/recovery-password',
                { token: noMatch.$link.url },
              ]);
              this.callApp();
            }
          }
        }
      );
      this.statusBar.styleDefault();

      // check for plateform (ios or android)
      // if (this.platform.is('ios')) {
      //   this.deviceTypeId = 2;

      //   if(!!this.fcm){
      //     this.fcm.requestPushPermission().then((context) => {
      //       this.fcm.getToken().then((token) => {
      //         localStorage.setItem(Constants.DEVICETOKEN, token);
      //         console.log(token, 'token.');
      //         console.log(this.deviceTypeId, 'devicetype');
      //       });
      //     });
      //   }
      //   // data['IsIosDevice'] = true
      // } else {
      //   // data['IsIosDevice'] = false
      //   this.deviceTypeId = 1;

      //   if(!!this.fcm){
      //     this.fcm.getToken().then((token) => {
      //       localStorage.setItem(Constants.DEVICETOKEN, token);
      //       console.log(token, 'token.');
      //       console.log(this.deviceTypeId, 'devicetype');
      //     });
      //   }
      // }
      // console.log(this.deviceTypeId, 'devicetype');
      // localStorage.setItem(Constants.DEVICETYPE, this.deviceTypeId);

      // this.fcm.onNotification().subscribe((data) => {
      //   console.log(data);
      //   if (data.wasTapped) {
      //     console.log('Received in background');
      //   } else {
      //     this.utility.showSuccessToast(data.body);
      //     console.log('Received in foreground');
      //   }
      // });

      // this.fcm.hasPermission().then((hasPermission) => {
      //   if (hasPermission) {
      //     console.log('Has permission!');
      //   }
      // });

      // this.fcm.clearAllNotifications();
      this.platform.backButton.subscribeWithPriority(1, () => {
        console.log('currentUrl ', this.router.url);
        if (
          this.router.url.includes('login') ||
          this.router.url.includes('/tabs/my-requests') ||
          this.router.url.includes('/tabs/available-requests') ||
          this.router.url.includes('/tabs/pending-requests')
        ) {
          this.exitapp();
        } else if (this.router.url.includes('signup')) {
          this.router.navigate(['/login']);
        } else if (this.router.url.includes('closed-requests')) {
          this.router.navigate(['/tabs/pending-requests']);
        } else if (this.router.url.includes('forgot-password')) {
          this.router.navigate(['/login']);
        } 
        else if (this.router.url.includes('hr-calendar-view')) {
          var selected_tab = localStorage.getItem('selected_tab');
          if (selected_tab == 'pending_request') {
            this.router.navigate(['tabs/pending-requests'])
          }
          else {
            this.router.navigate(['tabs/closed-requests'])
          }
        }
        else if (this.router.url.includes('swap-requests')) {
          var selected_tab = localStorage.getItem('selected_tab');
          if (selected_tab == 'my_request') {
            this.router.navigate(['/tabs/my-requests']);
          } else {
            this.router.navigate(['/tabs/available-requests']);
          }
        } else if (this.router.url.includes('swap-request-detail')) {
          var selected_tab = localStorage.getItem('selected_tab');
          let action;
          if (selected_tab == 'my_request') {
            action = 'isRequestedOffer';
          } else {
            action = 'isAvailableOffer';
          }

          let navigationExtras: NavigationExtras = {
            queryParams: {
              action: action,
            },
          };
          localStorage.setItem('selected_tab', selected_tab);
          this.events.publish('selected_tab', selected_tab);
          this.router.navigate(['/tabs/swap-requests'], navigationExtras);
        } else {
          var selected_tab = localStorage.getItem('selected_tab');
          if (selected_tab == 'my_request') {
            const userRole = localStorage.getItem(Constants.ROLE);
            if (userRole == '3') {
              this.router.navigate(['/tabs/pending-requests']);
            } else {
              this.router.navigate(['/tabs/my-requests']);
            }
          } else {
            this.router.navigate(['/tabs/available-requests']);
          }
        }
      });

      this.network.onChange().subscribe((data) => {
        if (data == 'connected') {
          this.offline = 1;
        } else {
          this.offline = 0;
        }
      });
    });

    let disconnectSubscription = this.network
      .onDisconnect()
      .subscribe(async (data) => {
        setTimeout(async () => {
          if (data) {
            if (this.offline == 0) {
              this.alertConfirm = await this.alertController.create({
                header: 'Network was disconnected',
                message: 'Please check your internet connection',
                buttons: [
                  {
                    text: 'OK',
                    handler: () => {},
                  },
                ],
              });

              await this.alertConfirm.present();
            }
          }
        }, 2000);
      });

    let connectSubscription = this.network.onConnect().subscribe(() => {
      this.offline = 1;
      console.log('offline', this.offline);
      if (this.network.type == 'cell') {
        this.alertController.dismiss();
        this.alertConfirm.dismiss();
      } else if (this.network.type == 'wifi') {
        this.alertController.dismiss();
        this.alertConfirm.dismiss();
      }
    });
  }
  callApp() {
    this.platform.ready().then(() => {
      this.deepLinks.route({}).subscribe(
        (match) => {
          console.log('===', match.$link);
          if (match.$link.url.includes('/recovery-password')) {
            this.router.navigate([
              '/recovery-password',
              { token: match.$link.url },
            ]);
          }
          this.utility.presentToast('DONE');
        },
        (noMatch) => {
          if (noMatch.$link) {
            console.log('===', noMatch.$link);
            if (noMatch.$link.url.includes('/recovery-password')) {
              this.router.navigate([
                '/recovery-password',
                { token: noMatch.$link.url },
              ]);
            }
          }
        }
      );
    });
  }
  public exitapp() {
    navigator['app'].exitApp();
  }

  openMenu() {
    this.events.subscribe('IS_LOGIN', (value: any) => {
      if (value) {
        this.pages.forEach((element) => {
          if (element.title == 'Home') {
            element.isEnabled = true;
          } else {
            element.isEnabled = false;
          }
        });
      }
    });
  }

  selected(data, index) {
    this.pages.forEach((element) => {
      element.isEnabled = false;
    });
    if (this.pages[index].title != 'Logout') {
      this.pages[index].isEnabled = true;
    }
  }

  // logout() {
  //   this.utility.showLoading();
  //   setTimeout(() => {
  //     localStorage.removeItem(Constants.CMW_ROLE);
  //     localStorage.removeItem(Constants.CMW_USER);
  //     localStorage.clear();
  //     this.utility.hideLoading();
  //     this.router.navigate(['/login'])
  //   }, 1000);
  // }

  async logout() {
    this.userService.logout(localStorage.getItem(Constants.USERID));
    let company = localStorage.getItem(Constants.COMPANY_NAME);
    let userRoleId = localStorage.getItem("roleId");
    let companyId = localStorage.getItem("companyId");
    let returningCompanyId = localStorage.getItem(Constants.RETURNING_COMPANYID);
    let roleId = localStorage.getItem(Constants.ROLE);
    let identifier = localStorage.getItem(Constants.IDENTIFIER);
    let _deviceToken = localStorage.getItem(Constants.DEVICETOKEN);
    let identifierUser = localStorage.getItem("identifierUser");
    let configuredUserName = localStorage.getItem("configuredUserName");
    let _deviceType = localStorage.getItem(Constants.DEVICETYPE);
    let userName = localStorage.getItem(Constants.USERNAME);
    let password = localStorage.getItem("password");
    let BiometricCheck = localStorage.getItem("BiometricCheck");
    var isBiometric = localStorage.getItem('IsEnabledBiometric') ? localStorage.getItem('IsEnabledBiometric') : "";
    localStorage.clear();
    localStorage.setItem("IsEnabledBiometric",isBiometric)
    localStorage.setItem("UserPassword",password);
    localStorage.setItem("IsLogoutFromDasboard","true");
    localStorage.setItem(Constants.COMPANY_NAME, company);
    localStorage.setItem("roleId",userRoleId);
    localStorage.setItem(Constants.ROLE, roleId);
    localStorage.setItem(Constants.RETURNING_COMPANYID, returningCompanyId);
    localStorage.setItem(Constants.IDENTIFIER, identifier);
    localStorage.setItem("identifierUser",identifierUser);
    localStorage.setItem(Constants.DEVICETOKEN, _deviceToken);
    localStorage.setItem(Constants.DEVICETYPE, _deviceType);
    localStorage.setItem(Constants.USERNAME, userName);
    localStorage.setItem('canCheckFingerPrint',"false");
    localStorage.setItem('BiometricCheck', BiometricCheck);
    localStorage.setItem('companyId',companyId);
    if(!!configuredUserName || configuredUserName !== 'null'){
      localStorage.setItem('configuredUserName',configuredUserName);
    }
    if(!!password || password !== 'null'){
      localStorage.setItem('password', password);
    }
    if (
      window.location.hostname.split('.').length > 2 &&
      window.location.hostname.split('.')[0] !== 'www'
    ) {
      sessionStorage.clear();
    }
    this.utilityService.showLoadingwithoutDuration();
    await this.getConfiguration().then(() => {
      this.utilityService.hideLoading();
    });
  }

  async getConfiguration() {
    await this.authService.getConfiguration().then(
      (response) => {
        if (response['Success'] && !!response['Data']) {
          localStorage.setItem(
            Constants.LOGO_PATH,
            !!response['Data'].LogoURL
              ? `../assets/images/${response['Data'].LogoURL}`
              : ''
          );
          localStorage.setItem(
            Constants.LOGIN_URL,
            !!response['Data'].LoginURL
              ? `../assets/images/${response['Data'].LoginURL}`
              : ''
          );
          localStorage.setItem(Constants.WEB_URL, response['Data'].WebURL);
          localStorage.setItem(Constants.APP_NAME, response['Data'].AppName);
          this.appName = localStorage.getItem(Constants.APP_NAME);
          this.router.navigate(['/login']);
        }
      },
      (err) => {}
    );
  }
  async callConfiguration() {
    await this.authService.getConfiguration().then(
      (response) => {
        if (response['Success'] && !!response['Data']) {
          localStorage.setItem(
            Constants.LOGO_PATH,
            !!response['Data'].LogoURL
              ? `../assets/images/${response['Data'].LogoURL}`
              : ''
          );
          localStorage.setItem(
            Constants.LOGIN_URL,
            !!response['Data'].LoginURL
              ? `../assets/images/${response['Data'].LoginURL}`
              : ''
          );
          localStorage.setItem(Constants.WEB_URL, response['Data'].WebURL);
          localStorage.setItem(Constants.APP_NAME, response['Data'].AppName);
          this.appName = localStorage.getItem(Constants.APP_NAME);
          // this.router.navigate(['/login'])
        }
      },
      (err) => {}
    );
  }

  // public showFingeerprintAuthentication() {
  //   this.faio.isAvailable().then((result: any) => {
  //     console.log(result);
  
  //     this.faio.show({
  //       cancelButtonTitle: 'Cancel',
  //       // description: "Some biometric description",
  //       disableBackup: true,
  //       title: 'Accurate Analytical Testing',
  //       fallbackButtonTitle: 'FB Back Button',
  //       // subtitle: 'This SubTitle'
  //     })
  //       .then((result: any) => {
  //         console.log(result);
  //         this.router.navigate(["login"]);
  //         // alert("Successfully Authenticated!")
  //       })
  //       .catch((error: any) => {
  //         console.log(error);
  //         this.exitapp();
  //         // alert("Match not found!")
  
  //       });
  
  //   })
  //     .catch((error: any) => {
  //       console.log(error);
  //       this.router.navigate(["login"]);
  //     });
  // }
}
