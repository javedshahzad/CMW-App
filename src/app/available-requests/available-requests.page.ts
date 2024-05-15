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
import { NotificationService } from '../services/notification.service';

@Component({
  selector: 'app-available-requests',
  templateUrl: './available-requests.page.html',
  styleUrls: ['./available-requests.page.scss'],
})
export class AvailableRequestsPage implements OnInit {
  public selectedtab: any;
  private subscription: Subscription;
  userId;
  public isShowCallOff = false;
  isSwapRequests = false;
  isVOTRequests = false;
  isTransferRequests = false;
  isTrainingRequests = false;
  isFlexWorkRequests = false;
  isShowSwap = false;
  isShowVot = false;
  isShowTransfer = false;
  isShowTraning = false;
  isShowEarlyOut = false;
  isShowFlexWork = false;
  isShowVto = false;
  isVtoRequests = false;
  isCallInRequests = false;
  isEarlyGoRequest = false;
  isLateInRequest = false;
  isShowClockInOutRequest = false;
  role: number;
  roleEnum = Role;
  notificationCount: [];
  swapRequestIcon = '../../assets/svg/swap-icon.svg';
  VTOicon = '../../assets/svg/vto-icon.svg';
  VOTicon = '../../assets/svg/vot-icon.svg';
  callOffIcon = '../../assets/svg/calloff.svg';
  earlyOutIcon = '../../assets/svg/early-out-requests.svg';
  flexWorkIcon = '../../assets/svg/flex-work-icon.svg';
  transferRequestIcon = '../../assets/svg/transfer-requests.svg';

  constructor(
    public ref: ChangeDetectorRef,
    public activeRoute: ActivatedRoute,
    private notificationService: NotificationService,
    private router: Router,
    private events: EventsService
  ) {
    this.events.subscribe('tabs_changed', (tab: any) => {
      this.ionViewWillEnter();
    });
  }

  ngOnInit() {}

  ionViewWillEnter() {
    this.role = Number(localStorage.getItem(Constants.ROLE));

    if (this.role === Role.user) {
      this.getNotificationCount();
    }

    this.ref.detectChanges();
    localStorage.setItem('selected_tab', 'available_request');
    if (JSON.parse(localStorage.getItem(Constants.IS_SWAP_REQUEST)) === null) {
      this.isSwapRequests = true;
      localStorage.setItem(
        Constants.IS_SWAP_REQUEST,
        String(this.isSwapRequests)
      );
      localStorage.setItem(
        Constants.IS_VOT_REQUEST,
        String(this.isVOTRequests)
      );
      localStorage.setItem(
        Constants.IS_TRANSFER_REQUEST,
        String(this.isTransferRequests)
      );
      localStorage.setItem(
        Constants.IS_TRAINING_REQUEST,
        String(this.isTrainingRequests)
      );
      localStorage.setItem(
        Constants.IS_VTO_REQUEST,
        String(this.isVtoRequests)
      );
      localStorage.setItem(
        Constants.IS_CALL_IN_REQUEST,
        String(this.isCallInRequests)
      );
      localStorage.setItem(
        Constants.IS_EARLY_GO_REQUEST,
        String(this.isEarlyGoRequest)
      );
      localStorage.setItem(
        Constants.IS_FLEX_WORK_REQUEST,
        String(this.isFlexWorkRequests)
      );
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
    this.isVtoRequests = JSON.parse(
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
    this.isShowEarlyOut = JSON.parse(
      localStorage.getItem(Constants.IS_EARLY_OUT)
    );
    this.isShowVto = JSON.parse(localStorage.getItem(Constants.IS_VTO));
    this.isShowFlexWork = JSON.parse(
      localStorage.getItem(Constants.IS_FLEX_WORK)
    );
    this.isCallInRequests = JSON.parse(
      localStorage.getItem(Constants.IS_CALL_IN_REQUEST)
    );
    this.isEarlyGoRequest = JSON.parse(
      localStorage.getItem(Constants.IS_EARLY_GO_REQUEST)
    );
    this.isShowCallOff = JSON.parse(
      localStorage.getItem(Constants.IS_CALL_OFF)
    );

    if (this.role === this.roleEnum.user) {
      if (
        this.isVOTRequests ||
        this.isTransferRequests ||
        this.isTrainingRequests ||
        this.isCallInRequests ||
        this.isEarlyGoRequest
      ) {
        this.isSwapRequests = true;
        this.isShowSwap = true;
        this.isShowVot = this.role === this.roleEnum.user ? false : true;
        this.isVOTRequests = false;
        this.isTransferRequests = false;
        this.isTrainingRequests = false;
        this.isShowTraning = false;
        this.isShowTransfer = false;
        this.isEarlyGoRequest = false;
        this.isFlexWorkRequests = false;
      }
    }

    if (this.role === this.roleEnum.manager) {
      if (
        this.isTransferRequests ||
        this.isTrainingRequests ||
        this.isCallInRequests
      ) {
        this.isSwapRequests = false;
        this.isShowSwap = true;
        this.isShowVot = true;
        this.isVOTRequests = false;
        this.isTransferRequests = true;
        this.isTrainingRequests = false;
        this.isShowTraning = false;
        this.isShowTransfer = true;
        this.isEarlyGoRequest = false;
        this.isFlexWorkRequests = false;
      }
    }
  }

  getOffer(data) {
    this.isSwapRequests = false;
    this.isVOTRequests = false;
    this.isTransferRequests = false;
    this.isTrainingRequests = false;
    this.isVtoRequests = false;
    this.isCallInRequests = false;
    this.isEarlyGoRequest = false;
    this.isFlexWorkRequests = false;
    this.isLateInRequest = false;
    this.isShowClockInOutRequest = false;
    if (data === 1) {
      this.isSwapRequests = true;
      this.SwapRequests();
    } else if (data === 2) {
      this.isVOTRequests = true;
    } else if (data === 3) {
      this.isTransferRequests = true;
    } else if (data === 4) {
      this.isTrainingRequests = true;
    } else if (data === 5) {
      this.isVtoRequests = true;
      this.VTORequests();
    } else if (data === 6) {
      this.isEarlyGoRequest = true;
    } else if (data === 8) {
      this.isFlexWorkRequests = true;
      this.flexRequests();
      this.isFlexWorkRequests = true;
    } else if (data === 10) {
      this.isLateInRequest = true;
    } else if (data === 11) {
      this.isShowClockInOutRequest = true;
    }
    localStorage.setItem(
      Constants.IS_SWAP_REQUEST,
      String(this.isSwapRequests)
    );
    localStorage.setItem(Constants.IS_VOT_REQUEST, String(this.isVOTRequests));
    localStorage.setItem(
      Constants.IS_TRANSFER_REQUEST,
      String(this.isTransferRequests)
    );
    localStorage.setItem(
      Constants.IS_TRAINING_REQUEST,
      String(this.isTrainingRequests)
    );
    localStorage.setItem(Constants.IS_VTO_REQUEST, String(this.isVtoRequests));
    localStorage.setItem(
      Constants.IS_CALL_IN_REQUEST,
      String(this.isCallInRequests)
    );
    localStorage.setItem(
      Constants.IS_EARLY_GO_REQUEST,
      String(this.isEarlyGoRequest)
    );
    localStorage.setItem(
      Constants.IS_FLEX_WORK_REQUEST,
      String(this.isFlexWorkRequests)
    );
    localStorage.setItem(
      Constants.IS_LATE_IN_REQUEST,
      String(this.isLateInRequest)
    );
    localStorage.setItem(
      Constants.IS_LATE_IN_REQUEST,
      String(this.isShowClockInOutRequest)
    );
  }
  openAnnouncement() {
    this.router.navigate(['/tabs/announcement'], {
      state: { data: 'AvailableRequest' },
    });
  }

  goToFeedback(){
    this.router.navigate(['/tabs/feedback-request']);
  }
  
  SwapRequests() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        action: 'isAvailableOffer',
      },
    };
    this.selectedtab = 'available_request';
    localStorage.setItem('selected_tab', this.selectedtab);
    this.events.publish('selected_tab', this.selectedtab);
    this.router.navigate(['/tabs/swap-requests'], navigationExtras);
  }
  flexRequests() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        action: 'isAvailableOffer',
      },
    };
    this.selectedtab = 'available_request';
    localStorage.setItem('selected_tab', this.selectedtab);
    this.events.publish('selected_tab', this.selectedtab);
    this.router.navigate(['/tabs/flex-work-requests'], navigationExtras);
  }
  VTORequests() {
    let navigationExtras: NavigationExtras = {
      queryParams: {
        action: 'isAvailableOffer',
      },
    };
    this.selectedtab = 'available_request';
    localStorage.setItem('selected_tab', this.selectedtab);
    this.events.publish('selected_tab', this.selectedtab);
    this.router.navigate(['/tabs/vto-requests'], navigationExtras);
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
      localStorage.setItem('selected_tab', 'available_request');
      this.role = Number(localStorage.getItem(Constants.ROLE));
      if (this.role === Role.user) {
        this.getNotificationCount();
      }
      event.target.complete();
    }, 2000);
  }
}
