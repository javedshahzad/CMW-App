import { Component, Input, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { Constants } from 'src/app/constant/constants';
import { Offer } from 'src/app/models/offer.model';
import { OfferService } from 'src/app/services/offer/offer.service';
import { UtilityService } from 'src/app/services/utility/utility.service';
import { OfferStatus } from "src/app/models/role-model";
@Component({
  selector: 'app-clock-in-out-detail',
  templateUrl: './clock-in-out-detail.page.html',
  styleUrls: ['./clock-in-out-detail.page.scss'],
})
export class ClockInOutDetailPage implements OnInit {
  public clockInOutData: any;
  public myOffer: any;
  offerStatus = OfferStatus;
  @Input() Offer: Offer;
  isConfirmed = false;
  deleteId: string;

  constructor(private router: Router,
    private offerService: OfferService,
    private utilityService: UtilityService
    ) { }

  ngOnInit() {
  }

  ionViewWillEnter(){
    this.clockInOutData = JSON.parse(localStorage.getItem(Constants.TIME_PUNCH_DATA));
    console.log(this.clockInOutData);
  }

  goBack(){
    this.router.navigate(['/tabs/clock-in-out-request']);
  }

  async openModal(data: any) {
    if (data) {
      this.myOffer = data;
    } else {
      this.myOffer = null;
    }
    localStorage.setItem(
      Constants.TIME_PUNCH_DATA,
      JSON.stringify(this.myOffer)
    );
    const navigationExtras: NavigationExtras = {
      queryParams: {
        Offer: this.myOffer,
        action: 'edit'
      },
      replaceUrl: true,
    };
    this.router.navigate(['tabs/add-time-punch'], navigationExtras);
  }

  onClickDelete(data){
    this.isConfirmed = false;
    this.offerService.removeTimePunchRequest(data.TimePunchesId).then(
      (res) => {
        if (res["Success"]) {
          this.utilityService.showSuccessToast(Constants.OFFER_DELETE_SUCCESS_MSG);
          this.router.navigate([`tabs/clock-in-out-request`]);
        } else {
          this.utilityService.showErrorToast(res["Message"]);
        }
      },
      (err) => {}
    );
  } 
}
