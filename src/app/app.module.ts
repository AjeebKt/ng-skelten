import { MailVerificationComponent } from './forgot-password/mail-verification/mail-verification.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoginComponent } from './login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from './shared/shared.module';
import { CoreModule } from './core/core.module';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './core/services/auth.interceptor';
import { ResponseInterceptor } from './core/services/response.interceptor';
import { GlobalDataService } from './core/services/global-data.service';
import { AuthenticComponent } from './authentic/authentic.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { environment } from 'src/environments/environment';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { ToastrModule } from 'ngx-toastr';
import { ConfigurationComponent } from './configuration/configuration.component';

@NgModule({
   declarations: [
      AppComponent,
      LoginComponent,
      AuthenticComponent,
      PageNotFoundComponent,
      UnauthorizedComponent,
      ForgotPasswordComponent,
      MailVerificationComponent,
      ConfigurationComponent
   ],
   imports: [
      BrowserModule,
      AppRoutingModule,
      FormsModule,
      CoreModule,
      ReactiveFormsModule,
      BrowserAnimationsModule,
      SharedModule,
      NgxMyDatePickerModule.forRoot(),
      ToastrModule.forRoot(),
   ],
   providers: [
      GlobalDataService,
      {
         provide: HTTP_INTERCEPTORS,
         useClass: AuthInterceptor,
         multi: true,
      },
      {
         provide: HTTP_INTERCEPTORS,
         useClass: ResponseInterceptor,
         multi: true,
      },
   ],
   bootstrap: [
      AppComponent
   ]
})
export class AppModule {
   constructor() {
      if (environment.production) {
         console.log = () => { };
         console.error = () => { };
         console.warn = () => { };
         console.exception = () => { };
         // console. = () => { };
      }
   }
}
