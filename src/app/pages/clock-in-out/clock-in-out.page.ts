import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { ClockInOutService } from 'src/app/services/clock-in-out.service';
import {
  Constants,
  OfferTypesEnum,
  SourceEnum,
} from 'src/app/constant/constants';
//import { Geolocation } from '@ionic-native/geolocation/ngx';
import { DatePipe } from '@angular/common';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { Device } from '@awesome-cordova-plugins/device/ngx';
// import { Sim } from '@ionic-native/sim/ngx';

@Component({
  selector: 'app-clock-in-out',
  templateUrl: './clock-in-out.page.html',
  styleUrls: ['./clock-in-out.page.scss'],
})
export class ClockInOutPage implements OnInit {
  clockInOutRequestIcon = '../../assets/svg/punch.svg';
  geoLocationStr = '';
  calculateDistantsList: any;
  clockInOutpunch: any;
  username = '';
  phoneNum: any;
  SourceType = SourceEnum;
  user: any = {};
  deviceIdentifierValue: any;
  serverIdentifier: any;
  settingType: any = [];
  enableVal = false;
  currentPage = Constants.CURRENT_PAGE;
  isShowMsg = false;
  punchTime: any;
  userId: number;
  locationCoords: any;
  timetest: any;
  weekHours: any = null;
  isInconsistent: false;
  deviceVersion: any;
  dollarIcon = '../../../assets/icon/icon-dollar.svg';
  constructor(
    public router: Router,
    public alertController: AlertController,
    private utilityService: UtilityService,
    private datepipe: DatePipe,
    public clockInOutServic: ClockInOutService,
    private androidPermissions: AndroidPermissions,
    private geolocation: Geolocation,
    private locationAccuracy: LocationAccuracy,
    private device: Device
  ) {
    this.deviceIdentifierValue = null;

    this.locationCoords = {
      latitude: '',
      longitude: '',
    };
    this.timetest = Date.now();
  }

  ngOnInit() {
  }
  async ionViewWillEnter() {
    this.deviceVersion = this.device.version; 
    this.utilityService.showLoadingwithoutDuration();
    const deviceType = localStorage.getItem(Constants.DEVICETYPE);
    this.username= localStorage.getItem(Constants.USERNAME);
    this.userId = Number(localStorage.getItem(Constants.USERID));
    if (!!deviceType && deviceType === '2') {
      // IOS
      await this.getLocationCoordinates();
    } else {
      // Android
      await this.checkGPSPermission();
    }

    await this.getUserWeekHours();
    await this.getPhoneNumber();
    await this.msgShow();
    this.utilityService.hideLoading();
  }

  //Check if application having GPS access permission
  async checkGPSPermission() {
    let permissionCall = async (result) => {
      if (result.hasPermission) {
        //If having permission show 'Turn On GPS' dialogue
        await this.askToTurnOnGPS();
      } else {
        //If not having permission ask for permission
        await this.requestGPSPermission();
      }
    }
    (err) => {
      //In case of API call failure due to device compatability issue
      this.utilityService.hideLoading();
      this.utilityService.showErrorToast(Constants.DEVICE_NOT_SUPPORTED_COARSE);
    };

    await this.androidPermissions
      .checkPermission(
        this.deviceVersion < 12 ? this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION : this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
      )
      .then(permissionCall);
  }

  async requestGPSPermission() {
    let permissionCall = async (res) => {
      if (res.hasPermission) {
        // call method to turn on GPS
        await this.askToTurnOnGPS();
      } else {
        //Show alert if user click on 'No Thanks'
        this.utilityService.showErrorToast(
          Constants.CLOCK_IN_OUT_REQUEST_Permissions
        );
      }
    }
    (error) => {
      //Show alert if user click on 'No Thanks'
      this.utilityService.showErrorToast(
        Constants.CLOCK_IN_OUT_REQUEST_Permissions
      );
    };

    await this.locationAccuracy
      .canRequest()
      .then(async (canRequest: boolean) => {
        if (canRequest) {
        } else {
          await this.androidPermissions
            .requestPermission(
              this.deviceVersion < 12 ? this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION : this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
            )
            .then(permissionCall);
        }
      });
  }

  async askToTurnOnGPS() {
    await this.locationAccuracy
      .request(this.locationAccuracy.REQUEST_PRIORITY_LOW_POWER)
      .then(
        async (res) => {
          // When GPS Turned ON call method to get Accurate location coordinates
          await this.getLocationCoordinates();
        },
        (error) => {
          this.utilityService.showErrorToast(
            Constants.CLOCK_IN_OUT_REQUEST_Permissions
          );
        }
      );
  }

  // Methos to get device accurate coordinates using device GPS
  async getLocationCoordinates() {
    this.locationCoords = {
      latitude: '',
      longitude: '',
    };
    this.geoLocationStr = '';
    let options = {enableHighAccuracy: true, timeout: 30000}
    await this.geolocation
      .getCurrentPosition(options)
      .then(async (resp) => {
        if (!!resp.coords.latitude && !!resp.coords.longitude) {
          this.locationCoords.latitude = resp.coords.latitude;
          this.locationCoords.longitude = resp.coords.longitude;
          this.geoLocationStr =
            this.locationCoords.latitude + '|' + this.locationCoords.longitude;
          await this.calculateDistants(this.geoLocationStr);
        }
      })
      .catch((error) => {
        this.utilityService.showErrorToast(
          Constants.CLOCK_IN_OUT_REQUEST_GEOLOCATIONErr
        );
      });
  }

  goToClockInOutHistory() {
    this.router.navigate(['tabs/clock-in-out-request']);
  }
  goToWorkHours() {
    this.router.navigate(['tabs/user-work-hours']);
  }

  resetIdentity() {
    this.clockInOutServic.resetIdentity().then((res: any) => {
      if (res.Success) {
        this.utilityService.showSuccessToast(res.Data);
      } else {
        this.utilityService.showErrorToast(res.Data);
      }
    });
  }

  async punchTimeClick() {
    await this.GetUserConfiguration(this.userId);
    if (this.isShowMsg) {
      if (
        !!this.serverIdentifier &&
        this.serverIdentifier != 'null' &&
        this.serverIdentifier != 'undefined'
      ) {
        // this.serverIdentifier = '';
        this.deviceIdentifierValue = localStorage.getItem(Constants.IDENTIFIER);
        if (
          !!this.deviceIdentifierValue &&
          this.deviceIdentifierValue != 'null' &&
          this.deviceIdentifierValue != 'undefined'
        ) {
          // this.deviceIdentifierValue = '';
          if (this.serverIdentifier == this.deviceIdentifierValue) {
            await this.punchSubmit();
          } else {
            this.resetIdentity();
            // this.utilityService.showErrorToast(
            //   Constants.CLOCK_IN_OUT_REQUEST_RESGISTER_DEVICE_MSG1
            // );
          }
        } else {
          this.resetIdentity();
        }
      } else {
        this.unRegisterDevice();
      }
    } else if (!this.isShowMsg) {
      this.utilityService.showErrorToast(
        Constants.CLOCK_IN_OUT_REQUEST_ENABLE_MSG
      );
    }
  }

  async punchSubmit() {
    if (this.phoneNum == null) {
      this.phonNumberAlert();
    } else if (!!this.geoLocationStr) {
      const identifier = this.deviceIdentifierValue;

      if (!!identifier) {
        await this.getClockInOutPunch(
          this.username,
          this.SourceType[0].id.toString(),
          this.geoLocationStr,
          this.phoneNum,
          identifier,
          this.punchTime
        );
      } else {
        this.utilityService.showErrorToast(
          Constants.CLOCK_IN_OUT_REQUEST_RESGISTER_DEVICE_MSG
        );
      }
    } else {
      this.utilityService.showErrorToast(
        Constants.CLOCK_IN_OUT_REQUEST_GEOLOCATIONErr
      );
    }
  }

  // async punchAlert() {
  //   const alert = await this.alertController.create({
  //     cssClass: 'delete-popo-up-class',
  //     message: ' <b>Are you sure you want to Clock-in/out request?</b>',
  //     buttons: [
  //       {
  //         text: 'Yes',
  //         role: 'submit',
  //         cssClass: 'secondary',
  //         handler: () => {
  //           this.deviceIdentifierValue = localStorage.getItem(
  //             Constants.IDENTIFIER
  //           );

  //           if (
  //             this.deviceIdentifierValue == null ||
  //             this.deviceIdentifierValue === 'undefined' ||
  //             this.deviceIdentifierValue === 'null'
  //           ) {
  //             this.deviceIdentifierValue = '';
  //             this.unRegisterDevice();
  //           } else if (this.deviceIdentifierValue) {
  //             this.punchSubmit();
  //           }
  //           console.log('submit');
  //         },
  //       },
  //       {
  //         text: 'No',
  //         role: 'cancel',
  //         handler: () => {
  //           console.log('cancel');
  //         },
  //       },
  //     ],
  //   });
  //   await alert.present();
  // }

  async getClockInOutPunch(
    UserName,
    SourceType,
    geoLoaction,
    phone,
    identifier,
    punchTime,
  ) {
    punchTime = this.datepipe.transform(new Date(), 'yyyy-MM-dd HH:mm:ss');
    this.utilityService.showLoadingwithoutDuration();
    const getMethod = this.clockInOutServic.getClockInOutPunch(
      UserName,
      SourceType,
      geoLoaction,
      phone,
      identifier,
      punchTime,
    );
    await getMethod.then(
      (res: any) => {
        if (res['Success']) {
          this.clockInOutpunch = res.Data;
          this.utilityService.hideLoading();
          this.utilityService.showSuccessToast(
            Constants.CLOCK_IN_OUT_REQUEST_ADD_SUCCESS_MSG
          );
        } else {
          this.utilityService.hideLoading();
          this.utilityService.showErrorToast(res['Message']);
        }
      },
      (err) => {
        this.utilityService.hideLoading();
      }
    );
  }

  async phonNumberAlert() {
    const alert = await this.alertController.create({
      cssClass: 'delete-popo-up-class',
      message: ' <b>Confirm Phone Number?</b>',
      buttons: [
        {
          text: 'ok',
          role: 'submit',
          cssClass: 'secondary',
          handler: () => {
            console.log('submit');
          },
        },
      ],
    });
    await alert.present();
  }

  async unRegisterDevice() {
    const alert = await this.alertController.create({
      cssClass: 'delete-popo-up-class',
      message: ' <b>Do you want to register this device for clock-in/out?</b>',
      buttons: [
        {
          text: 'Yes',
          role: 'submit',
          cssClass: 'secondary',
          handler: async () => {
            this.deviceIdentifierValue = '';
            await this.IsNewDeviceIdentifierExists();
            console.log('submit');
          },
        },
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            this.utilityService.showErrorToast(
              Constants.CLOCK_IN_OUT_REQUEST_RESGISTER_DEVICE_MSG2
            );
            console.log('cancel');
          },
        },
      ],
    });
    await alert.present();
  }

  async GetUserConfiguration(userId) {
    this.utilityService.showLoadingwithoutDuration();
    await this.clockInOutServic.GetUserConfiguration(userId).then(
      (res) => {
        this.utilityService.hideLoading();
        if (res['Success']) {
          console.log(JSON.stringify(res['Data']));
          localStorage.setItem(
            Constants.SERVERIDENTIFIER,
            res['Data'].serverIdentifier
          );
          this.serverIdentifier = res['Data'].serverIdentifier;
        } else if (res['Data'].RegisteredDeviceIdentifier == null) {
          localStorage.setItem(Constants.SERVERIDENTIFIER, null);
          this.serverIdentifier = null;
        } else {
          this.serverIdentifier = null;
          this.utilityService.showErrorToast(res['Message']);
        }
      },
      (err) => {
        this.serverIdentifier = null;
        this.utilityService.hideLoading();
      }
    );
  }
  async IsNewDeviceIdentifierExists() {
    this.utilityService.showLoadingwithoutDuration();
    await this.clockInOutServic
      .IsDeviceIdentifierExists(
        !!this.deviceIdentifierValue ? this.deviceIdentifierValue : ''
      )
      .then(
        async (res) => {
          this.utilityService.hideLoading();
          if (res['Success']) {
            console.log(JSON.stringify(res['Data']));
            if (!!res['Message']) {
              localStorage.setItem(
                'identifierUser',
                localStorage.getItem(Constants.USERID)
              );
              localStorage.setItem(Constants.IDENTIFIER, res['Message']);
              // localStorage.setItem(
              //   Constants.SERVERIDENTIFIER,
              //   JSON.stringify(identifierArr)
              // );
              this.deviceIdentifierValue = localStorage.getItem(
                Constants.IDENTIFIER
              );
              this.serverIdentifier = this.deviceIdentifierValue;
              // this.serverIdentifier = localStorage.getItem(Constants.SERVERIDENTIFIER);
            } else if (res['Data'].RegisteredDeviceIdentifier == null) {
              localStorage.setItem(Constants.IDENTIFIER, null);
              // localStorage.setItem(Constants.SERVERIDENTIFIER, null);
            }
            await this.punchSubmit();
          } else {
            this.utilityService.showErrorToast(res['Message']);
          }
        },
        (err) => {
          this.utilityService.hideLoading();
        }
      );
  }

  async getPhoneNumber() {
    await this.clockInOutServic.getUserDetail().then((res) => {
      if (res['Success']) {
        localStorage.setItem(Constants.PHONENUM, res['Data'].phone);
        this.phoneNum = localStorage.getItem(Constants.PHONENUM);
        console.log(this.phoneNum);
      }
    }, (error) => {
      this.utilityService.hideLoading();
    });
  }

  async msgShow() {
    await this.clockInOutServic.getSettingType().then((res) => {
      this.settingType = res;
      console.log(this.settingType, 'res');
        if (!!this.settingType && this.settingType.Data.length > 0) {
          this.enableVal = this.settingType.Data.find(
            (x) =>
              x.SettingType == 'Mobile check-in/out permitted' &&
              x.OfferType == OfferTypesEnum.ClockInOutModule
          );
        }
        if (!!this.enableVal) {
          if (this.enableVal['Enable'] == true) {
            this.isShowMsg = true;
          } else if (this.enableVal['Enable'] == false) {
            this.isShowMsg = false;
          } else {
            this.isShowMsg = false;
          }
        }
      
    }, (error) => {
      this.utilityService.hideLoading();
    });
  }

  // 11

  async calculateDistants(geoLocation) {
    await this.clockInOutServic
      .calculateDistants(geoLocation)
      .then((res: any) => {
        if (res['Success']) {
          this.calculateDistantsList = res;
          console.log(this.calculateDistantsList, 'list');
          if (res.Data.Feet > 1000) {
            this.calculateDistantsList = res.Data.MileStr;
          } else {
            this.calculateDistantsList = res.Data.FeetStr;
          }
        }
      });
  }

  goBack() {
    this.router.navigate(['/tabs/my-requests']);
  }

  async getUserWeekHours() {
    const getMethod = this.clockInOutServic.getUserWeekHours(this.userId);
    await getMethod.then((res: any) => {
      if (res['Success']) {
        this.weekHours =
          Number(res.Data.ClockedOutWorkHours) +
          Number(res.Data.RunningWorkHours);
      }
    }, (error) => {
      this.utilityService.hideLoading();
    });
  }

}
