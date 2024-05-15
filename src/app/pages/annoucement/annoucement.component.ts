import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants } from 'src/app/constant/constants';
import { NotificationService } from 'src/app/services/notification.service';
import { UtilityService } from 'src/app/services/utility/utility.service';

@Component({
  selector: 'app-annoucement',
  templateUrl: './annoucement.component.html',
  styleUrls: ['./annoucement.component.scss'],
})
export class AnnoucementComponent implements OnInit {
  userId;
  perviousPage;
  loadmore = false;
  notificationList = [];
  currentPage = Constants.CURRENT_PAGE;
  rowsOnPage = Constants.ROWS_ON_PAGE;
  oldData = [];
  page: any;
  totalItems: any;
  constructor(
    public router: Router,
    private notificationService: NotificationService,
    private utilityService: UtilityService
  ) {this.page = {
    pageNumber: 0,
    size: this.rowsOnPage,
  };}
  ngOnInit(): void {
    this.perviousPage = this.router.getCurrentNavigation().extras?.state?.data;
  }

  ionViewWillEnter() {
    this.userId = localStorage.getItem(Constants.USERID);
    this.getNotificationList(this.userId,this.currentPage);
  }
  goBack() {
    // if (this.perviousPage === 'MyRequest') {
    //   this.router.navigate(['tabs/my-requests']);
    // } else if (this.perviousPage !== 'MyRequest') {
    //   this.router.navigate(['tabs/available-requests']);
    // }
    var selected_tab = localStorage.getItem('selected_tab');
    if (selected_tab == 'my_request') {
      this.router.navigate(['/tabs/my-requests']);
    } else {
      this.router.navigate(['/tabs/available-requests']);
    }
  }
  getNotificationList(userId,currentPage) {
    this.utilityService.showLoading();
    this.notificationService.getNotifications(this.userId,this.currentPage).then((res) => {
      this.utilityService.hideLoading();
      if (res['Success']) {
        this.notificationList = res['Data'].results;
        for (var i = 0; i <= this.notificationList.length - 1; i++) {
          this.oldData.push(this.notificationList[i]);
        }
        if (this.notificationList.length < Constants.ROWS_ON_PAGE) {
          this.loadmore = true;
          this.notificationList = this.oldData;
        } else {
          this.loadmore = false;
        }
        this.totalItems = !!res['Data'].totalNumberOfRecords
              ? res['Data'].totalNumberOfRecords
              : 0;
      }
    });
  }
  loadData(event) {
    setTimeout(() => {
      if (this.notificationList.length > 0) {
        // if (!this.loadmore) {
        //   event.target.disabled = true;
        // }
        this.page.pageNumber += 1;
        console.log('page no', this.page.pageNumber);

        this.getNotificationList( this.userId, this.page.pageNumber);

        event.target.complete();
      }
    }, 100);
  }
}
