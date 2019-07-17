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

    this.loginService.login(this.loginForm.value)
      .subscribe(response => {
        // console.log(response);
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
      }, (error: HttpErrorResponse | ErrorResponse) => {
        console.log(error);
        if (error instanceof ErrorResponse) {
          // this.error = error.message;
          console.log(error);
          if (error.message === 'INVALID USER') {
            this.router.navigate(['/401']);
          } else {
            this.submitted = true;
            let formError = null;
            switch (error.message) {
              case ErrorMessage.INVALIDUSER_CREDS:
                formError = { invalidCreds: { message: error.message } };
                break;
              case ErrorMessage.BAD_CREDENTIALS:
                formError = { invalidCreds: { message: ErrorMessage.INVALIDUSER_CREDS } };
                break;
              case ErrorMessage.DELETED_USER:
                formError = { deletedUser: { message: error.message } };
                break;
              case ErrorMessage.UNKNOWN_USERNAME:
                this.loginForm.controls.username.setErrors({ inactiveUser: { message: ErrorMessage.UNKNOWN_USERNAME } });
                break;
              case ErrorMessage.INACTIVE_USER:
                this.loginForm.controls.username.setErrors({ inactiveUser: { message: ErrorMessage.INACTIVE_USER } });
                break;
              case ErrorMessage.BLOCKED_USER:
                formError = { invalidCreds: { message: 'User blocked.please contact your administrator' } };

                // this.loginForm.controls.username.setErrors({ inactiveUser: { message: ErroMessage.INACTIVE_USER } });
                break;

            }
            this.loginForm.setErrors(formError);
          }
        }
        // return throwError(error);
      });
  }
}



