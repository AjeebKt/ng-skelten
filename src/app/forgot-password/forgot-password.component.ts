import { HttpErrorResponse } from '@angular/common/http';
import { ErroMessage, ErrormesgforForgot } from './../model/error-message.enum';
import { GlobalDataService } from './../core/services/global-data.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { switchMap, map, catchError } from 'rxjs/operators';
import { ErrorResponse } from '../core/services/response.interceptor';
import { throwError } from 'rxjs';
import { ForgotService } from './forgotservice.service';
import { SnackBarService } from '../core/services/snack-bar.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {
  submitted = false;
  forgotform: FormGroup;
  userName: any;
  userNamedetails: { userName: any; };
  constructor(private notify: SnackBarService, private router: Router,
    private globalDataService: GlobalDataService, private fb: FormBuilder, private forgotPasswordService: ForgotService,
  ) {
    this.forgotform = this.fb.group({ username: ['', Validators.required] });

  }

  ngOnInit() {

  }
  forgotpassword() {
    this.forgotform.controls.username.markAsDirty();
    this.forgotform.controls.username.markAsTouched();

    if (this.forgotform.invalid) {
      this.submitted = true;
      return;
    }
    this.userNamedetails = {
      userName: this.forgotform.controls.username.value
    };
    const userName = new FormData();
    userName.append(
      'userName',
      JSON.stringify(this.userNamedetails)
    );
    this.forgotPasswordService.forgotpassword(this.forgotform.controls.username.value).subscribe(
      response => {
        // console.log(response.response);
        if (response.projectStatusCode === 'S1050') {
          this.notify.openSnackBar(response.message, '');
          this.router.navigate(['login']);
          // console.log(response.response);
        }
      }, (err: HttpErrorResponse) => {
        if (err.status === 404) {
          this.notify.openSnackBar('User not found !', '');
        }
        // if (err instanceof HttpErrorResponse) {
        // }
      });
  }
}
