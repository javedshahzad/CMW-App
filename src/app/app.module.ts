import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClientModule,HttpClient,HTTP_INTERCEPTORS  } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { File } from "@ionic-native/file/ngx";
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { Deeplinks } from '@ionic-native/deeplinks/ngx';
import { Network } from '@ionic-native/network/ngx';
import { CommonModule } from '@angular/common';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { TransferApproveRequestComponent } from './shared/transfer-approve-request/transfer-approve-request.component';
import { TransferDenialReasonComponent } from './shared/transfer-denial-reason/transfer-denial-reason.component';
import { ValidationMessageComponent } from './component/validation-message/validation-message.component';
import { FingerprintAIO} from '@ionic-native/fingerprint-aio/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';

@NgModule({
  declarations: [AppComponent,],
  entryComponents: [],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,HttpClientModule,ReactiveFormsModule,
    FormsModule,BrowserAnimationsModule,CKEditorModule,BsDatepickerModule.forRoot(),],
  providers: [
    AppVersion,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    Keyboard,
    StatusBar,
    SplashScreen,
    FileOpener,
    File,
    DocumentViewer,
    DatePipe,
    Deeplinks,
    FingerprintAIO,
    Network,
    {
      provide: RouteReuseStrategy,
      useClass: IonicRouteStrategy
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
