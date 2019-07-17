import { SUB_ADMIN } from './../app.constants';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { MatDialog } from '@angular/material';
import { GlobalDataService } from '../core/services/global-data.service';
import { ProgressBarService } from '../core/services/progress-bar.service';
import { SnackBarService } from '../core/services/snack-bar.service';
import { LoginService } from './login.service';
import { CurrentUser } from '../model/current-user';
import { switchMap, map, catchError } from 'rxjs/operators';
import { Hospital } from '../model/hospital';
import { throwError } from 'rxjs';
import { ErrorResponse } from '../core/services/response.interceptor';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ErroMessage as ErrorMessage } from '../model/error-message.enum';
import { LoginResponse } from '../model/login-response';
import { SUPER_USER, UVT_ADMIN } from '../app.constants';
import * as _ from 'underscore';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loading = false;
  loginForm: FormGroup;
  submitted = false;
  constructor(private globalDataService: GlobalDataService,
    private progressbarService: ProgressBarService,
    private notify: SnackBarService,
    private dialog: MatDialog,
    private router: Router, private fb: FormBuilder,
    private loginService: LoginService) {
    this.loginForm = this.fb.group({ username: ['', Validators.required], password: ['', Validators.required] });
  }

  ngOnInit() {
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentHospital');
    const favIcon = document.head.querySelector('#favicon');
    (favIcon as any).href = 'assets/images/fav.png';

    this.globalDataService.reset();
    sessionStorage.clear();
  }
  login() {
    this.loginForm.controls.username.markAsDirty();
    this.loginForm.controls.username.markAsTouched();
    this.loginForm.controls.password.markAsDirty();
    this.loginForm.controls.password.markAsTouched();
    if (this.loginForm.invalid) {
      this.submitted = true;
      return;
    }
    // if (!this.progressbarService.getStatus()) { this.progressbarService.display(true); }
    // tslint:disable-next-line: max-line-length
    const response = { access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VCX09QRVJBVE9SIiwidXNlcl9pZCI6NDk4LCJ1c2VyX25hbWUiOiJmaXRiaXQ0Iiwic2NvcGUiOlsib3BlbmlkIl0sImV4cCI6MTU2NDIyNzI3NiwiYXV0aG9yaXRpZXMiOlsiU1VCX09QRVJBVE9SIl0sImp0aSI6Ijg4ZmE5ODA2LTNmMWEtNGNiOC05M2E0LWI5M2MyODI2Mzk2MSIsImNsaWVudF9pZCI6ImNpdHRhIn0.JBwVfoba8-W85RYCPUCVvIaZaokI3zVjEKesb61Y9DHG8n1NzSip_9PxQzwShCLrUCLn1N2kAMJsl-XTmYy3xXh-SEewHVvKmGdD8hUeYZa08nJx6u3dRIExN94h92N72QKHUGRGaGy3GiQ_D2IqMWOml5bSolik8l4PYTI4cMo9Y5emByx-zRyrnPcB0AWgjnKurSDFuhwXRaLjvLiCagUa5vk4E8v6w-miWgPcPo61nNBKNniTpzwiWhDHgkxJmRY0ghjNvo5pzLInKN0moh8MRenTnOPeASOs9TRrtoluXLcFY0PERCY1K7YOMZFBwaJ4j_vW8-ZTEvwV52Mk4g', token_type: 'bearer', refresh_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiU1VCX09QRVJBVE9SIiwidXNlcl9pZCI6NDk4LCJ1c2VyX25hbWUiOiJmaXRiaXQ0Iiwic2NvcGUiOlsib3BlbmlkIl0sImF0aSI6Ijg4ZmE5ODA2LTNmMWEtNGNiOC05M2E0LWI5M2MyODI2Mzk2MSIsImV4cCI6MTU2NTk1NTI3NiwiYXV0aG9yaXRpZXMiOlsiU1VCX09QRVJBVE9SIl0sImp0aSI6ImMxY2Q1NTQ2LWJjZGQtNGQxMS04OGIwLWQ3NTc1MWM4Mzg1ZSIsImNsaWVudF9pZCI6ImNpdHRhIn0.Zrft29knZPEqKFzgNjRsNZWu9LjqujIZ9QzLxvIwh1TMkuCHecAe79DOc7xotoReLdTS0Vdic6SAdTQaP9ZCh7PAEqym3kQc4XvejclLcYb_foCiElDiHzPDY7BmWiNm4VT9SS_qsSPqi5Q_fhNE1Bs9ywvrMntKKYE7MbDdxaxKzw-D6QMN4zS7txPc8FS0WZ14O2aK1ciSgFYF1n64rCP5cD3jEjjnvuxQhDzu5lZOTeBoZoc43tt2B-heRF4gJP-x6ovUNCx-8IkcRF2Rl6Gc-ALPgR6lUaYbJj2VZYZ2Iv8ik3c7XWbnoFi4ahZfQqo7u-XZ4Vklg5HPqtcMBg', expires_in: 863999, scope: 'openid', role: 'SUB_OPERATOR', user_id: 498, jti: '88fa9806-3f1a-4cb8-93a4-b93c28263961' };

    console.log(response);
    if (response) {
      const roles = [...SUPER_USER, ...UVT_ADMIN, ...SUB_ADMIN];
      if (_.contains(roles, response.role)) {
        const loginResponse = new LoginResponse();
        const tokenResponse = response;
        loginResponse.role = tokenResponse.role;
        loginResponse.token = tokenResponse.access_token;
        const currentUser = this.globalDataService.currentUser = new CurrentUser(loginResponse);
        this.globalDataService.currentUser.refreshToken = tokenResponse.refresh_token;
        const loginTime: any = new Date();
        currentUser.logintTime = loginTime * 1;
        currentUser.expiresIn = currentUser.logintTime + (tokenResponse.expires_in * 1000);
        localStorage.setItem('userData', JSON.stringify(this.globalDataService.currentUser.userData));
        this.globalDataService.currentUser.userData = {
          subId: tokenResponse.user_id,
          roleStatus: tokenResponse.role
        };
        if (currentUser.role.includes('SUB_ADMIN')) {
          this.router.navigate(['/app/dashboard/user-management']);
        } else if (currentUser.role.includes('SUB_OPERATOR')) {
          this.router.navigate(['/app/dashboard/user-management']);
        } else if (currentUser.role.includes('UVT_ADMIN')) {
          this.router.navigate(['/app/configuration']);
        } else {
          this.router.navigate(['/app']);
        }
      }
    }




    // this.loginService.login(this.loginForm.value)
    //   .subscribe(response => {
    //     // console.log(response);
    //     if (response) {
    //       const roles = [...SUPER_USER, ...UVT_ADMIN, ...SUB_ADMIN];
    //       if (_.contains(roles, response.role)) {
    //         const loginResponse = new LoginResponse();
    //         const tokenResponse = response;
    //         loginResponse.role = tokenResponse.role;
    //         loginResponse.token = tokenResponse.access_token;
    //         const currentUser = this.globalDataService.currentUser = new CurrentUser(loginResponse);
    //         this.globalDataService.currentUser.refreshToken = tokenResponse.refresh_token;
    //         const loginTime: any = new Date();
    //         currentUser.logintTime = loginTime * 1;
    //         currentUser.expiresIn = currentUser.logintTime + (tokenResponse.expires_in * 1000);
    //         localStorage.setItem('userData', JSON.stringify(this.globalDataService.currentUser.userData));
    //         this.globalDataService.currentUser.userData = {
    //           subId: tokenResponse.user_id,
    //           roleStatus: tokenResponse.role
    //         };
    //         if (currentUser.role.includes('SUB_ADMIN')) {
    //           this.router.navigate(['/app/dashboard/user-management']);
    //         } else if (currentUser.role.includes('SUB_OPERATOR')) {
    //           this.router.navigate(['/app/dashboard/user-management']);
    //         } else if (currentUser.role.includes('UVT_ADMIN')) {
    //           this.router.navigate(['/app/configuration']);
    //         } else {
    //           this.router.navigate(['/app']);
    //         }
    //       }
    //     }
    //   }, (error: HttpErrorResponse | ErrorResponse) => {
    //     console.log(error);
    //     if (error instanceof ErrorResponse) {
    //       // this.error = error.message;
    //       console.log(error);
    //       if (error.message === 'INVALID USER') {
    //         this.router.navigate(['/401']);
    //       } else {
    //         this.submitted = true;
    //         let formError = null;
    //         switch (error.message) {
    //           case ErrorMessage.INVALIDUSER_CREDS:
    //             formError = { invalidCreds: { message: error.message } };
    //             break;
    //           case ErrorMessage.BAD_CREDENTIALS:
    //             formError = { invalidCreds: { message: ErrorMessage.INVALIDUSER_CREDS } };
    //             break;
    //           case ErrorMessage.DELETED_USER:
    //             formError = { deletedUser: { message: error.message } };
    //             break;
    //           case ErrorMessage.UNKNOWN_USERNAME:
    //             this.loginForm.controls.username.setErrors({ inactiveUser: { message: ErrorMessage.UNKNOWN_USERNAME } });
    //             break;
    //           case ErrorMessage.INACTIVE_USER:
    //             this.loginForm.controls.username.setErrors({ inactiveUser: { message: ErrorMessage.INACTIVE_USER } });
    //             break;
    //           case ErrorMessage.BLOCKED_USER:
    //             formError = { invalidCreds: { message: 'User blocked.please contact your administrator' } };

    //             // this.loginForm.controls.username.setErrors({ inactiveUser: { message: ErroMessage.INACTIVE_USER } });
    //             break;

    //         }
    //         this.loginForm.setErrors(formError);
    //       }
    //     }
    //     // return throwError(error);
    //   });




  }
}



