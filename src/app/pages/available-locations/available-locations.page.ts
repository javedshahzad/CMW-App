import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import * as L from "leaflet";

@Component({
  selector: 'app-available-locations',
  templateUrl: './available-locations.page.html',
  styleUrls: ['./available-locations.page.scss'],
})
export class AvailableLocationsPage implements OnInit {
  locationDetail: any;
  locationDetails: any;
  private map;
  constructor(private modal: ModalController,  private route: ActivatedRoute) {}

  ngOnInit() {
    if (!!this.locationDetail) {
      const splitLocation = this.locationDetail.split("|");
        if (splitLocation.length > 1) {
          this.locationDetails = {
            latitude: splitLocation[0],
            longitude: splitLocation[1],
          };
        }
    }
  }


  ionViewDidEnter(): void {
    if(!!this.locationDetails.latitude && !!this.locationDetails.longitude) {
      this.initMap();
    } 
  }

  private initMap(): void {
    this.map = L.map("map", {
      center: [this.locationDetails.latitude, this.locationDetails.longitude],
      zoom: 8,
    });
    const tiles = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 18,
        minZoom: 5,
        id: "mapbox/streets-v11",
        tileSize: 512,
        zoomOffset: -1,
      }
    );

    tiles.addTo(this.map);
    this.map.flyTo(
      [this.locationDetails.latitude, this.locationDetails.longitude],
      14
    );

    const icon = L.icon({
      iconUrl: "https://cdn-icons-png.flaticon.com/512/1077/1077114.png",
      popupAnchor: [13, 0],
      iconSize: [35, 35],
    });

    const myIcon = L.icon({
      iconUrl:
        "https://res.cloudinary.com/rodrigokamada/image/upload/v1637581626/Blog/angular-leaflet/marker-icon.png",
      iconSize: [25, 41],
    });
    const marketLocation = L.marker(
      [this.locationDetails.latitude, this.locationDetails.longitude],
      {
        icon: myIcon,
      }
    );
    if (!!this.locationDetails.locationName) {
      marketLocation.bindPopup(this.locationDetails.locationName);
    }
    marketLocation.addTo(this.map);
  }

  closeModal() {
    this.modal.dismiss();
  }
}
