import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ActivatedRoute, NavigationExtras, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ModalController, Platform, AlertController,IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { OfferService } from '../../services/offer/offer.service';
import { UtilityService } from '../../services/utility/utility.service';
import { Constants } from 'src/app/constant/constants';
import * as moment from 'moment';
import { DataService } from 'src/app/services/data/data.service';
import { EventsService } from 'src/app/services/events/events.service';
import { OfferStatus } from 'src/app/models/role-model';
import { utils } from 'src/app/constant/utils';

@Component({
  selector: 'app-swap-requests',
  templateUrl: './swap-requests.page.html',
  styleUrls: ['./swap-requests.page.scss'],
})
export class SwapRequestsPage implements OnInit {
  @Input() offerId: number;
  offerStatus = OfferStatus;
  loadmore = false;
  rowsOnPage = Constants.ROWS_ON_PAGE;
  currentPage = Constants.CURRENT_PAGE;
  page: any;
  public isData: boolean;
  userId: number;
  public myrequests: any = [];
  public startTimeToShow: any;
  public endTimeToShow: any;
  totalItems: any;
  offerList: any = [];
  columns = [];
  searchSort: any;
  id: any;
  acceptOfferId: number;
  public loadmoredata = false;
  @ViewChild('filterTextValue', { static: false }) filterTextValue;

  // @ViewChild('item.slideItem', { static: false }) slideItem;
  @ViewChild(IonItemSliding) slidingItem: IonItemSliding;
  public searchfield: any;
  public detailsobj: any = {};
  isShowLink = false;
  subscription: Subscription;
  calendarIcon = '../../../assets/svg/calendar-icon.svg';
  public action: any;
  element: any;
  public selectedtab: any;
  constructor(
    public modal: ModalController,
    private router: Router,
    public route: ActivatedRoute,
    public location: Location,
    public platfrom: Platform,
    private offerService: OfferService,
    private utilityService: UtilityService,
    private events: EventsService,
    private dataService: DataService,
    public alertController: AlertController
  ) {
    this.route.queryParams.subscribe((params) => {
      this.action = params.action;
    });
  }

  ngOnInit() {}

  async ionViewWillEnter() {
    this.offerList = [];
    this.columns = [
      'dateToWorkDateStr',
      'dateToSkipDateStr',
      'shiftToSkipTitle',
      'offerStatusStr',
    ];
    this.page = {
      pageNumber: 1,
      size: this.rowsOnPage,
    };
    this.searchSort = {
      Page: this.page.pageNumber,
      PageSize: Constants.ROWS_ON_PAGE,
      Search: {
        Value: '',
        ColumnNameList: [],
        Regex: 'string',
      },
      Order: [
        {
          Column: 0,
          ColumnName: '',
          Dir: 'asc',
        },
      ],
    };
    this.userId = Number(localStorage.getItem(Constants.USERID));
    this.searchfield = '';
    if (this.action === 'isAvailableOffer') {
      await this.getAvailableOfferList(this.page.pageNumber);
    } else {
      this.getMyRequestOffer(this.page.pageNumber);
    }
  }
  goBack() {
    const selectedTab = localStorage.getItem('selected_tab');
    if (selectedTab === 'my_request') {
      this.router.navigate(['/tabs/my-requests']);
    } else {
      this.router.navigate(['/tabs/available-requests']);
    }
  }
  redirectToSwapRequestDetail(detailObj: any) {
    detailObj.action = this.action;
    this.dataService.setData(detailObj);
    localStorage.setItem('detail_obj', JSON.stringify(detailObj));
    this.router.navigate(['/tabs/swap-request-detail']);
  }

  cancel() {
    const selectedTab = localStorage.getItem('selected_tab');

    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: this.detailsobj.action,
      },
    };

    localStorage.setItem('selected_tab', selectedTab);
    this.events.publish('selected_tab', selectedTab);
    this.router.navigate(['/tabs/swap-requests'], navigationExtras);
  }
  //  async openModalTerms(type: any, data: any) {
  //   this.acceptOfferId = data.offerId;
  //   const modal = await this.modal.create({
  //     component: TermsConditionPage,
  //     cssClass: 'terms_class',
  //     componentProps: {
  //       'offerId': this.acceptOfferId
  //     }
  //   });
  //   modal.onDidDismiss().then((dataReturned) => {

  //     if (dataReturned !== null) {
  //       if (dataReturned.data != undefined) {
  //         this.accept(dataReturned.data)
  //       }
  //     }
  //   });
  //   return await modal.present();
  // }

  async onClickAccept(data: any) {
    console.log(data);
    const alert = await this.alertController.create({
      cssClass: 'delete-popo-up-class',
      message: ' <b>Are you sure you want to Accept ?</b>',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            // slidingItem.close();
            this.slidingItem.closeOpened();
            console.log('cancel');
          },
        },
        {
          text: 'Yes',
          role: 'accept',
          handler: () => {
            this.accept(data.offerId);
          },
        },
      ],
    });
    await alert.present();
  }
  accept(id) {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoadingwithoutDuration();
    this.offerService.acceptOffer(id).then(
      async (res) => {
        if (res['Success']) {
          this.utilityService.hideLoading();
          this.utilityService.showSuccessToast(Constants.OFFER_ACCEPT_MSG);
          await this.getAvailableOfferList(this.page.pageNumber);
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

  async openSwap(value) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        action: 'add',
      },
      replaceUrl: true,
    };
    this.router.navigate(['tabs/add-swap-request'], navigationExtras);
    // const modal = await this.modal.create({
    //   component: AddRequestSwapPage,
    //   cssClass: 'add-request-swap_class',
    //   componentProps: {
    //     'model_type': value
    //   }
    // });
    // modal.onDidDismiss().then((dataReturned) => {
    //   if (dataReturned !== null) {
    //     if (dataReturned.data != undefined) {
    //       console.log(dataReturned.data);
    //       this.offerList = [];
    //       this.getMyRequestOffer(this.page.pageNumber);
    //     }
    //   }
    // });
    // return await modal.present();
  }

  async searchAvailable(event) {
    this.filterTextValue = event.detail.value;
    await this.getAvailableOfferList(this.page.pageNumber);
  }
  searchMyrequests(event) {
    this.filterTextValue = event.detail.value;
    this.getMyRequestOffer(this.page.pageNumber);
  }

  async getAvailableOfferList(currentPage) {
    if (this.filterTextValue) {
      this.isShowLink = true;
      this.searchSort.Search.Value = this.filterTextValue;
      this.searchSort.Search.ColumnNameList = this.columns;
      this.searchSort.Page = currentPage;
      this.filterData();
    } else {
      if (!navigator.onLine) {
        return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      }
      this.utilityService.showLoadingwithoutDuration();
      await this.offerService.getAvailableOfferList(currentPage).then(
        (res: any) => {
          // if (JSON.parse(localStorage.getItem(Constants.IS_TERMS_UPDATE))) {
          //   this.utilityService.showLoading();
          // }
          if (res['Success']) {
            const availableList = res.Data.results;
            if (res.Data.results) {
              this.isData = true;
            }

            const groups = availableList.reduce((groups, offer) => {
              const date = offer.dateToWork.split('T')[0];
              if (!groups[date]) {
                groups[date] = [];
              }
              groups[date].push(offer);
              return groups;
            }, {});

            // Edit: to add it in the array format instead
            const groupArrays = Object.keys(groups).map((date) => {
              return {
                date,
                requestsList: groups[date]
              };
            });

            this.offerList = [...this.offerList, ...groupArrays];
            this.offerList = groupArrays;
            if (this.offerList.length > Constants.ROWS_ON_PAGE) {
              this.loadmoredata = true;
            } else {
              this.loadmoredata = false;
            }
            if (this.offerList.length > 0) {
              this.offerList.forEach((element) => {
                element.requestsList.forEach((element1) => {
                  if (element1) {
                    element.dateToWork = element1.dateToWork;
                    element.dateToSkip = element1.dateToSkip;
                    element.acceptedBy = element1.acceptedBy;
                    element1.dayToSkip =
                      utils.getConvertedToDateOnly(element1.dateToSkip).getDay() + 1;
                    const timings = this.getStartEndTime(
                      element1.dayToSkip,
                      element1.shiftToSkipNavigation
                    );
                    if (timings) {
                      // element1.startTimeToShow = moment(timings.startTime,"HH:mm:ss A").format('LT');
                      // element1.endTimeToShow = moment(timings.endTime,"HH:mm:ss A").format('LT');

                      element1.startTimeToShow = moment(
                        timings.startTime,
                        'HH:mm:ss A'
                      ).format('hh:mm A');
                      element1.endTimeToShow = moment(
                        timings.endTime,
                        'HH:mm:ss A'
                      ).format('hh:mm A');
                      if (element1.status == this.offerStatus.pendingMatch) {
                        element1.statusClass = 'danger';
                      }
                      if (element1.status == this.offerStatus.scheduleUpdated) {
                        element1.statusClass = 'success';
                      }
                      if (element1.status == this.offerStatus.hrApproval) {
                        element1.statusClass = 'primary';
                      }
                      element1.itemClose = false;
                    }
                  }
                });
              });
            }
            this.totalItems =
              res.Data.totalNumberOfRecords === 0
                ? undefined
                : res.Data.totalNumberOfRecords;
            this.utilityService.hideLoading();
          } else {
            this.utilityService.hideLoading();
            this.isData = false;
            this.offerList = [];
            this.totalItems = undefined;
          }
        },
        (err) => {
          this.utilityService.hideLoading();
          this.offerList = [];
        }
      );
    }
  }

  filterData() {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoadingwithoutDuration();
    this.offerService.availableOfferDataFilter(this.searchSort).then(
      (res) => {
        if (res['data'] && res['data'].length > 0) {
          this.utilityService.hideLoading();
          const availableList = res['data'];
          if (res['data']) {
            this.isData = true;
          }

          const groups = availableList.reduce((groups, offer) => {
            const date = offer.dateToWork.split('T')[0];
            if (!groups[date]) {
              groups[date] = [];
            }
            groups[date].push(offer);
            return groups;
          }, {});

          // Edit: to add it in the array format instead
          const groupArrays = Object.keys(groups).map((date) => {
            return {
              date,
              requestsList: groups[date],
            };
          });
          this.offerList = groupArrays;
          if (this.offerList.length > 0) {
            this.offerList.forEach((element) => {
              element.requestsList.forEach((element1) => {
                if (element1) {
                  element.dateToWork = element1.dateToWork;
                  element.dateToSkip = element1.dateToSkip;
                  element1.dayToSkip =
                    utils.getConvertedToDateOnly(element1.dateToSkip).getDay() + 1;
                  element.acceptedBy = element1.acceptedBy;
                  const timings = this.getStartEndTime(
                    element1.dayToSkip,
                    element1.shiftToSkipNavigation
                  );
                  if (timings) {
                    // element1.startTimeToShow = moment(timings.startTime,"HH:mm:ss A").format('LT');
                    // element1.endTimeToShow = moment(timings.endTime,"HH:mm:ss A").format('LT');

                    element1.startTimeToShow = moment(
                      timings.startTime,
                      'HH:mm:ss A'
                    ).format('hh:mm A');
                    element1.endTimeToShow = moment(
                      timings.endTime,
                      'HH:mm:ss A'
                    ).format('hh:mm A');
                    if (element1.status === this.offerStatus.pendingMatch) {
                      element1.statusClass = 'danger';
                    }
                    if (element1.status === this.offerStatus.scheduleUpdated) {
                      element1.statusClass = 'success';
                    }
                    if (element1.status === this.offerStatus.hrApproval) {
                      element1.statusClass = 'primary';
                    }
                    element1.itemClose = false;
                  }
                }
              });
            });
          }
          this.totalItems =
            res['recordsFiltered'] === 0 ? undefined : res['recordsFiltered'];
        } else {
          this.offerList = [];
          this.totalItems = undefined;
          this.isData = false;
        }

        this.utilityService.hideLoading();
      },
      (err) => {
        this.utilityService.hideLoading();
        this.offerList = [];
        this.totalItems = undefined;
      }
    );
  }

  async getMyRequestOffer(currentPage) {
    if (!!this.filterTextValue) {
      this.isShowLink = true;
      this.searchSort.Search.Value = this.filterTextValue;
      this.searchSort.Search.ColumnNameList = this.columns;
      this.searchSort.Page = currentPage;
      await this.filterMyReq();
    } else {
      if (!navigator.onLine) {
        return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
      }
      this.utilityService.showLoading();
      await this.offerService.getMyOfferList(currentPage).then(
        (res: any) => {
          // if (JSON.parse(localStorage.getItem(Constants.IS_TERMS_UPDATE))) {
          //   this.utilityService.showLoading();
          // }
          if (res['Success']) {
            const myRequestList = res.Data.results;
            if (res.Data.results) {
              this.isData = true;
            }
            const groups = myRequestList.reduce((groups, offer) => {
              const date = offer.dateToSkip.split('T')[0];
              if (!groups[date]) {
                groups[date] = [];
              }
              groups[date].push(offer);
              return groups;
            }, {});

            const groupArrays = Object.keys(groups).map((date) => {
              return {
                date,
                requestsList: groups[date],
              };
            });
            this.offerList = [...this.offerList, ...groupArrays];
            this.offerList = groupArrays;
            // let tempList =[];
            // let found;
            // this.offerList.map((e)=>{
            //    found = tempList.some((el:any) => el.offerId === e.offerId);
            //    if(!found){
            //     tempList.push(e);
            //   }
            //   this.offerList = tempList;
            // });

            if (this.offerList.length > Constants.ROWS_ON_PAGE) {
              this.loadmoredata = true;
            } else {
              this.loadmoredata = false;
            }
            if (this.offerList.length > 0) {
              this.offerList.forEach((element) => {
                element.requestsList.forEach((element1) => {
                  element.dateToWork = element1.dateToWork;
                  element.dateToSkip = element1.dateToSkip;
                  if (element1) {
                    element1.dayToWork =
                      utils.getConvertedToDateOnly(element1.dateToWork).getDay() + 1;
                    element.dateToWork = element1.dateToWork;
                    element.dateToSkip = element1.dateToSkip;
                    element.acceptedBy = element1.acceptedBy;
                    var timings = this.getStartEndTime(
                      element1.dayToWork,
                      element1.shiftToWorkNavigation
                    );
                    if (timings) {
                      element1.startTimeToShow = moment(
                        timings.startTime,
                        'HH:mm:ss A'
                      ).format('hh:mm A');
                      element1.endTimeToShow = moment(
                        timings.endTime,
                        'HH:mm:ss A'
                      ).format('hh:mm A');
                    }
                    if (element1.status == this.offerStatus.pendingMatch) {
                      element1.statusClass = 'danger';
                    }
                    if (element1.status == this.offerStatus.scheduleUpdated) {
                      element1.statusClass = 'success';
                    }
                    if (element1.status == this.offerStatus.hrApproval) {
                      element1.statusClass = 'primary';
                    }
                    element1.itemClose = false;
                  }
                });
              });
            }

            this.totalItems =
              res.Data.totalNumberOfRecords === 0
                ? undefined
                : res.Data.totalNumberOfRecords;
            this.utilityService.hideLoading();
          } else {
            this.utilityService.hideLoading();
            this.offerList = [];
            this.totalItems = undefined;
            this.isData = false;
          }
        },
        (err) => {
          this.utilityService.hideLoading();
          this.offerList = [];
        }
      );
    }
  }

  getStartEndTime(dayToSkip, shiftToSkipNavigation) {
    let returnedHim;
    shiftToSkipNavigation.shiftWeekDay.forEach((element) => {
      if (element.weekday === dayToSkip) {
        returnedHim = element;
      }
    });
    return returnedHim;
  }

  loadData(event) {
    setTimeout(async () => {
      if (this.offerList.length > 0) {
        if (!this.loadmore) {
          event.target.disabled = true;
        }
        this.page.pageNumber += 1;
        console.log('page no', this.page.pageNumber);
        if (this.action == 'isAvailableOffer') {
          await this.getAvailableOfferList(this.page.pageNumber);
        } else {
          await this.getMyRequestOffer(this.page.pageNumber);
        }
        event.target.complete();
      }
    }, 100);
  }

  async filterMyReq() {
    if (!navigator.onLine) {
      return this.utilityService.showErrorToast(Constants.OFFLINE_MSG);
    }
    this.utilityService.showLoading();
    await this.offerService.myRequestOfferDataFilter(this.searchSort).then(
      (res) => {
        if (res['data'] && res['data'].length > 0) {
          const availableList = res['data'];
          if (res['data']) {
            this.isData = true;
          }

          const groups = availableList.reduce((groups, offer) => {
            const date = offer.dateToWork.split('T')[0];
            if (!groups[date]) {
              groups[date] = [];
            }
            groups[date].push(offer);
            return groups;
          }, {});

          const groupArrays = Object.keys(groups).map((date) => {
            return {
              date,
              requestsList: groups[date],
            };
          });
          this.offerList = groupArrays;

          if (this.offerList.length > 0) {
            this.offerList.forEach((element) => {
              element.requestsList.forEach((element1) => {
                element.dateToWork = element1.dateToWork;
                element.dateToSkip = element1.dateToSkip;
                if (element1) {
                  element1.dayToWork =
                    utils.getConvertedToDateOnly(element1.dateToWork).getDay() + 1;
                  element.dateToWork = element1.dateToWork;
                  element.dateToSkip = element1.dateToSkip;
                  element.acceptedBy = element1.acceptedBy;

                  const timings = this.getStartEndTime(
                    element1.dayToWork,
                    element1.shiftToWorkNavigation
                  );
                  if (timings) {
                    // element1.startTimeToShow = moment(timings.startTime,"HH:mm:ss A").format('LT');
                    // element1.endTimeToShow = moment(timings.endTime,"HH:mm:ss A").format('LT');

                    element1.startTimeToShow = moment(
                      timings.startTime,
                      'HH:mm:ss A'
                    ).format('hh:mm A');
                    element1.endTimeToShow = moment(
                      timings.endTime,
                      'HH:mm:ss A'
                    ).format('hh:mm A');
                  }
                  if (element1.status === this.offerStatus.pendingMatch) {
                    element1.statusClass = 'danger';
                  }
                  if (element1.status === this.offerStatus.scheduleUpdated) {
                    element1.statusClass = 'success';
                  }
                  if (element1.status === this.offerStatus.hrApproval) {
                    element1.statusClass = 'primary';
                  }
                  element1.itemClose = false;
                }
              });
            });
            console.log(this.offerList);
          }
          this.totalItems =
            res['recordsFiltered'] === 0 ? undefined : res['recordsFiltered'];
          this.utilityService.hideLoading();
        } else {
          this.utilityService.hideLoading();
          this.offerList = [];
          this.totalItems = undefined;
          this.isData = false;
        }
      },
      (err) => {
        this.utilityService.hideLoading();
        this.offerList = [];
        this.totalItems = undefined;
      }
    );
  }
}