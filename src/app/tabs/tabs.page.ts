import { Component, NgZone,ViewChild } from '@angular/core';
import { Constants } from '../constant/constants';
import { Role } from '../models/role-model';
import { Router, ActivatedRoute,NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { IonTabs } from '@ionic/angular'
import { EventsService } from '../services/events/events.service';


@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage  {
  public footerSelectedIconClr:any='#265CB2';
  public footerUnselectedIconClr:any='#1E1E1E'
  public selectedtab:any;
  private subscription: Subscription;
  private activeTab:any;
  @ViewChild('tabs', { static: false }) tabs: IonTabs;



  role: number;
  roleEnum = Role;
  usersIcon = '../../assets/svg/users.svg';
  calendarIcon = '../../assets/svg/calendar-icon.svg';
  constructor(private router: Router,private zone:NgZone,private events:EventsService, private routes:ActivatedRoute) {}

  ngOnInit() {
    
  }



 

  tabChange(tabsRef) {
  

    let url = this.router.url.split('/tabs/');
    
    if(url[1].indexOf('?') == -1) {
      this.selectedtab = url[1];
      if(url[1] = "my_requests") {
        this.selectedtab = "my_request";
      }
      else {
        this.selectedtab = url[1];
      }
    }

  
    // if(tabsRef){
    //   this.activeTab = tabsRef.outlet.activatedView.element;
    // }

    //this.activeTab = tabsRef.outlet.activatedView.element;
   
   
    if(!this.router.url.includes('swap-requests') && !this.router.url.includes('swap-request-detail') && this.router.url.includes('add-request-swap')
    && !this.router.url.includes('vto-requests')  && !this.router.url.includes('vto-request-detail') && !this.router.url.includes('add-vto-request')
    && !this.router.url.includes('vot-requests') && !this.router.url.includes('vot-request-detail') && !this.router.url.includes('add-vot-request')
    && !this.router.url.includes('call-in-request') && !this.router.url.includes('callin-request-detail') && !this.router.url.includes('add-edit-call-in-request')
    && !this.router.url.includes('early-go-requests') &&  !this.router.url.includes('earlygo-request-detail') && !this.router.url.includes('add-edit-early-go-request')
    && !this.router.url.includes('flex-work-requests') &&  !this.router.url.includes('flexwork-request-detail')
    && !this.router.url.includes('clock-in-out') &&  !this.router.url.includes('clock-in-out-request')
    && !this.router.url.includes('time-off-requests') &&  !this.router.url.includes('timeoff-request-detail') && !this.router.url.includes('add-timeoff-request')
    && !this.router.url.includes('late-in-request') &&  !this.router.url.includes('latein-request-detail') && !this.router.url.includes('add-edit-late-in-request')
    && !this.router.url.includes('announcement'))
    
    {
      this.selectedtab ="";
    } 
     
  }

  ionViewWillLeave() {
    //this.propagateToActiveTab('ionViewWillLeave');
  }
  
  ionViewDidLeave() {
    //this.propagateToActiveTab('ionViewDidLeave');
  }
  
  ionViewWillEnter() {
    this.events.publish("is_redirect_home", "true");
    this.role = Number(localStorage.getItem(Constants.ROLE));
    this.events.publish('tabs_changed', true);
    //this.propagateToActiveTab('ionViewWillEnter');
  }
  
  ionViewDidEnter() {
    //this.propagateToActiveTab('ionViewDidEnter');
    this.zone.run(()=>{
      this.events.subscribe('selected_tab', (tab: any) => {
        this.zone.run(()=>{
          this.selectedtab  = tab;
          localStorage.setItem('selected_tab',this.selectedtab)
        })
      }); 
    })
  }
  
  private propagateToActiveTab(eventName: string) {    
    if (this.activeTab) {
      this.activeTab.dispatchEvent(new CustomEvent(eventName));
    }
  }


  
  

}
