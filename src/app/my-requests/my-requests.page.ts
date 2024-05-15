import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Role } from 'src/app/models/role-model';
import { Constants } from 'src/app/constant/constants';
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  NavigationExtras,
} from '@angular/router';
import { Subscription } from 'rxjs';
import { EventsService } from '../services/events/events.service';
import { ModalController, Platform } from '@ionic/angular';
import { AddVtoRequestPage } from '../pages/add-vto-request/add-vto-request.page';
import { AddVotRequestPage } from '../pages/add-vot-request/add-vot-request.page';
import { CallInRequestPage } from '../pages/call-in-request/call-in-request.page';
import { VtoRequestsPage } from '../pages/vto-requests/vto-requests.page';
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-my-requests',
  templateUrl: './my-requests.page.html',
  styleUrls: ['./my-requests.page.scss'],
})
export class MyRequestsPage implements OnInit {
  public selectedtab: any;
  userId;
  isSwapRequests = false;
  isVOTRequests = false;
  isTransferRequests = false;
  isTrainingRequests = false;
  isFlexWorkRequests = false;
  isTimeOffRequests = false;
  isLateInRequest = false;
  isShowSwap = false;
  isShowVot = false;
  isShowTransfer = false;
  isShowTraning = false;
  isVTORequests = false;
  isShowVTO = false;
  isCallInRequest = false;
  isEarlyGoRequest = false;
  isShowCallIn = false;
  isShowEarlyOut = false;
  isShowFlexWork = false;
  isShowTimeOff = false;
  isShowClockInOut = false;
  isShowClockInOutRequests = false;
  isShowLateIn = false;
  role: number;
  roleEnum = Role;
  swapRequestIcon = '../../assets/svg/swap-icon.svg';
  clockInOutIcon = '../../assets/svg/clock-in-out.svg';
  VTOicon = '../../assets/svg/vto-icon.svg';
  VOTicon = '../../assets/svg/vot-icon.svg';
  callOffIcon = '../../assets/svg/calloff.svg';
  earlyOutIcon = '../../assets/svg/early-out-requests.svg';
  flexWorkIcon = '../../assets/svg/flex-work-icon.svg';
  transferRequestIcon = '../../assets/svg/transfer-requests.svg';
  timeOffIcon = '../../assets/svg/off-timer02.svg';
  lateInIcon = '../../assets/svg/late-in.svg';
  notificationCount: [];
  constructor(
    public ref: ChangeDetectorRef,
    private notificationService: NotificationService,
    public modal: ModalController,
    public activeRoute: ActivatedRoute,
    private router: Router,
    private events: EventsService
  ) {}

  ngOnInit() {}

  ionViewWillEnter() {
    //this.shared.showLoader();
    localStorage.setItem('selected_tab', 'my_request');
    this.role = Number(localStorage.getItem(Constants.ROLE));
    if (this.role === Role.user) {
      this.getNotificationCount();
    }

    this.isSwapRequests = JSON.parse(
      localStorage.getItem(Constants.IS_SWAP_REQUEST)
    );
    this.isVOTRequests = JSON.parse(
      localStorage.getItem(Constants.IS_VOT_REQUEST)
    );
    this.isTransferRequests = JSON.parse(
      localStorage.getItem(Constants.IS_TRANSFER_REQUEST)
    );
    this.isTrainingRequests = JSON.parse(
      localStorage.getItem(Constants.IS_TRAINING_REQUEST)
    );
    this.isVTORequests = JSON.parse(
      localStorage.getItem(Constants.IS_VTO_REQUEST)
    );
    this.isFlexWorkRequests = JSON.parse(
      localStorage.getItem(Constants.IS_FLEX_WORK_REQUEST)
    );
    this.isShowSwap = JSON.parse(localStorage.getItem(Constants.IS_SWAP));
    this.isShowVot = JSON.parse(localStorage.getItem(Constants.IS_VOT));
    this.isShowTransfer = JSON.parse(
      localStorage.getItem(Constants.IS_TRANSFER)
    );
    this.isShowTraning = JSON.parse(
      localStorage.getItem(Constants.IS_TRAINING)
    );
    this.isShowVTO = JSON.parse(localStorage.getItem(Constants.IS_VTO));
    this.isCallInRequest = JSON.parse(
      localStorage.getItem(Constants.IS_CALL_IN_REQUEST)
    );
    this.isEarlyGoRequest = JSON.parse(
      localStorage.getItem(Constants.IS_EARLY_GO_REQUEST)
    );
    this.isShowCallIn = JSON.parse(localStorage.getItem(Constants.IS_CALL_OFF));
    this.isShowEarlyOut = JSON.parse(
      localStorage.getItem(Constants.IS_EARLY_OUT)
    );
    this.isShowFlexWork = JSON.parse(
      localStorage.getItem(Constants.IS_FLEX_WORK)
    );
    this.isShowTimeOff = JSON.parse(
      localStorage.getItem(Constants.IS_TIME_OFF)
    );
    this.isTimeOffRequests = JSON.parse(
      localStorage.getItem(Constants.IS_TIME_OFF_REQUEST)
    );
    this.isShowClockInOut = JSON.parse(
      localStorage.getItem(Constants.IS_CLOCK_IN_OUT)
    );
    this.isShowClockInOutRequests = JSON.parse(
      localStorage.getItem(Constants.IS_CLOCK_IN_OUT_REQUEST)
    );

    //this.shared.hideLoader()
    this.isLateInRequest = JSON.parse(
      localStorage.getItem(Constants.IS_LATE_IN_REQUEST)
    );
    this.isShowLateIn = JSON.parse(localStorage.getItem(Constants.IS_LATE_IN));
  }

  SwapRequests() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: 'isRequestedOffer',
      },
      replaceUrl: true
    };
    this.selectedtab = 'my_request';
    localStorage.setItem('selected_tab', this.selectedtab);
    this.events.publish('selected_tab', this.selectedtab);
    this.router.navigate(['/tabs/swap-requests'], navigationExtras);
  }
  VOTRequests(data) {
    // console.log("called")
    // if(data === 2){
    //   this.isShowVot = true;
    //   this.isVOTRequests = true;
    //   localStorage.setItem(Constants.IS_VOT_REQUEST, String(this.isVOTRequests));

    // }
    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: 'isRequestedOffer',
      },
      replaceUrl: true
    };
    this.selectedtab = 'my_request';
    localStorage.setItem('selected_tab', this.selectedtab);
    this.events.publish('selected_tab', this.selectedtab);
    this.router.navigate(['/tabs/vot-requests'], navigationExtras);
  }
  openAnnouncement() {
    this.router.navigate(['/tabs/announcement'], {
      state: { data: 'MyRequest' },
    });
  }
  VtoRequests() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: 'isRequestedOffer',
      },
      replaceUrl: true
    };
    this.selectedtab = 'my_request';
    localStorage.setItem('selected_tab', this.selectedtab);
    this.events.publish('selected_tab', this.selectedtab);
    this.router.navigate(['/tabs/vto-requests'], navigationExtras);
  }

  goToFeedback(){
    this.router.navigate(['/tabs/feedback-request']);
  }

  async openVotRequests(value) {
    const modal = await this.modal.create({
      component: AddVotRequestPage,
      cssClass: 'add-request-swap_class',
      componentProps: {
        model_type: value,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        if (dataReturned.data !== undefined) {
          console.log(dataReturned.data);
        }
      }
    });
    return await modal.present();
  }

  async openVtoRequests(value) {
    const modal = await this.modal.create({
      component: VtoRequestsPage,
      cssClass: 'add-request-swap_class',
      componentProps: {
        model_type: value,
      },
    });
    modal.onDidDismiss().then((dataReturned) => {
      if (dataReturned !== null) {
        if (dataReturned.data != undefined) {
          console.log(dataReturned.data);
          // this.offerList = [];
          // this.getMyRequestOffer(this.page.pageNumber);
        }
      }
    });
    return await modal.present();
  }

  openCallinRequests() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: 'isRequestedOffer',
      },
      replaceUrl: true
    };
    this.selectedtab = 'my_request';
    localStorage.setItem('selected_tab', this.selectedtab);
    this.events.publish('selected_tab', this.selectedtab);
    this.router.navigate(['/tabs/call-in-requests'], navigationExtras);
  }
  EarlyRequests() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: 'isRequestedOffer',
      },
      replaceUrl: true
    };
    this.selectedtab = 'my_request';
    localStorage.setItem('selected_tab', this.selectedtab);
    this.events.publish('selected_tab', this.selectedtab);
    this.router.navigate(['/tabs/early-go-requests'], navigationExtras);
  }
  FlexRequests() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: 'isRequestedOffer',
      },
      replaceUrl: true
    };
    this.selectedtab = 'my_request';
    localStorage.setItem('selected_tab', this.selectedtab);
    this.events.publish('selected_tab', this.selectedtab);
    this.router.navigate(['/tabs/flex-work-requests'], navigationExtras);
  }
  TimeOffRequests() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: 'isRequestedOffer',
      },
      replaceUrl: true
    };
    this.selectedtab = 'my_request';
    localStorage.setItem('selected_tab', this.selectedtab);
    this.events.publish('selected_tab', this.selectedtab);
    this.router.navigate(['/tabs/time-off-requests'], navigationExtras);
  }
  ClockInOut() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: 'isRequestedOffer',
      },
      replaceUrl: true
    };
    this.selectedtab = 'my_request';
    localStorage.setItem('selected_tab', this.selectedtab);
    this.events.publish('selected_tab', this.selectedtab);
    this.router.navigate(['/tabs/clock-in-out'], navigationExtras);
  }
  LateInRequests() {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: 'isRequestedOffer',
      },
      replaceUrl: true
    };
    this.selectedtab = 'my_request';
    localStorage.setItem('selected_tab', this.selectedtab);
    this.events.publish('selected_tab', this.selectedtab);
    this.router.navigate(['/tabs/late-in-request'], navigationExtras);
  }

  getNotificationCount() {
    this.userId = localStorage.getItem(Constants.USERID);
    this.notificationService.getNotificationCount(this.userId).then((res) => {
      if (res['Success']) {
        this.notificationCount = res['Data'];
      }
    });
  }

  doRefresh(event) {
    setTimeout(() => {
      localStorage.setItem('selected_tab', 'my_request');
      this.role = Number(localStorage.getItem(Constants.ROLE));
      if (this.role === Role.user) {
        this.getNotificationCount();
      }
      event.target.complete();
    }, 2000);
  }
}
