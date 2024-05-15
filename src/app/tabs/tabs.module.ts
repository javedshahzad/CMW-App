import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { AnnoucementComponent } from '../pages/annoucement/annoucement.component';
import { NotificationService } from '../services/notification.service';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule,
  ],
  declarations: [TabsPage,
    AnnoucementComponent
  ],
  providers:[NotificationService]
})
export class TabsPageModule {}
