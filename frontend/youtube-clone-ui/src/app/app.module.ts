import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { NgxFileDropModule } from 'ngx-file-drop';
import { AuthModule, LogLevel } from 'angular-auth-oidc-client';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from 'angular-auth-oidc-client';
import { UploadComponent } from './components/upload/upload.component';
import { EditVideoMetadataComponent } from './components/edit-video-metadata/edit-video-metadata.component';
import { StudioComponent } from './components/studio/studio.component';
import { StepsComponent } from './components/steps/steps.component';
import { StepsModule } from 'primeng/steps';
import { ToastModule } from 'primeng/toast';
import { FileUploadModule } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { VgCoreModule } from '@videogular/ngx-videogular/core';
import { VgControlsModule } from '@videogular/ngx-videogular/controls';
import { VgOverlayPlayModule } from '@videogular/ngx-videogular/overlay-play';
import { VgBufferingModule } from '@videogular/ngx-videogular/buffering';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    UploadComponent,
    EditVideoMetadataComponent,
    StudioComponent,
    StepsComponent,
    VideoPlayerComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    NgxFileDropModule,
    StepsModule,
    ToastModule,
    FileUploadModule,
    BrowserAnimationsModule,
    MatMenuModule,
    InputTextModule,
    InputTextareaModule,
    VgBufferingModule,
    VgControlsModule,
    VgCoreModule,
    VgOverlayPlayModule,
    AuthModule.forRoot({
      config: {
        authority: 'https://karthick-v.us.auth0.com',
        redirectUrl: window.location.origin,
        postLogoutRedirectUri: window.location.origin,
        clientId: 'w4oDolUdBgotpHMD1VLgTwNW46KDNr5E',
        scope: 'openid profile email offline_access',
        responseType: 'code',
        silentRenew: true,
        useRefreshToken: true,
        logLevel: LogLevel.Debug,
        secureRoutes: ['http://localhost:8080/'],
        customParamsAuthRequest: {
          audience: 'http://localhost:8080',
        },
      },
    }),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    MessageService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
