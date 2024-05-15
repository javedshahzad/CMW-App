import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';

import { ClockInOutPageRoutingModule } from './clock-in-out-routing.module';
//import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Geolocation } from '@awesome-cordova-plugins/geolocation/ngx';
import { ClockInOutPage } from './clock-in-out.page';
import { LocationAccuracy } from '@ionic-native/location-accuracy/ngx';
import { AndroidPermissions } from '@ionic-native/android-permissions/ngx';
import { Device } from '@awesome-cordova-plugins/device/ngx';

// import { Sim } from '@ionic-native/sim/ngx';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ClockInOutPageRoutingModule,
    // Sim
  ],
  providers: [
    AndroidPermissions,
    Geolocation,
    LocationAccuracy,,
    DatePipe,
    Device
  ],
  declarations: [ClockInOutPage]
})
export class ClockInOutPageModule {}
