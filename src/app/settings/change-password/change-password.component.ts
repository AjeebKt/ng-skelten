import { SnackBarService } from 'src/app/core/services/snack-bar.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { CustomValidators } from 'src/app/custom-validators/CustomValidators';
import { FormControl } from '@angular/forms';
import { ChangePasswordService } from './change-password.service';
import { Router } from '@angular/router';
import { rangeLength } from 'src/app/shared/custom-validator/range-length';
import { of } from 'rxjs/internal/observable/of';
@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  changePasswordForm: FormGroup;
  submitted: boolean;
  incorrectPassword: boolean;
  constructor(
    private formBuilder: FormBuilder,
    private notify: SnackBarService,
    private router: Router,
    private changePasswordService: ChangePasswordService,
  ) {
    this.changePasswordForm = this.formBuilder.group({
      currentPassword: [
        '',
        Validators.compose([
          Validators.required,
          // rangeLength(8, 15),
          // Validators.minLength(8),
          // SValidators.maxLength(15),
        ])
      ],
      newPassword: [
        '',
        Validators.compose([
          Validators.required,
          CustomValidators.passwordValidation(),
          Validators.minLength(8),
          Validators.maxLength(15),
        ])
      ],
      confirmPassword: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(8),
          Validators.maxLength(15),
        ])
      ]
    }
      ,
      { validator: [this.passwordConfirming, this.matchOldPass] },
    );
  }

  ngOnInit() {
  }
  get changePasswordFormContorls() {
    return this.changePasswordForm.controls;
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.changePasswordForm.invalid) {
      return;
    } else {
      this.changePassword();
    }
  }
  passwordConfirming(c: FormGroup): { notSame: boolean } {
    if ((c.get('newPassword').value) && (c.get('confirmPassword').value)) {
      if (c.get('newPassword').value !== c.get('confirmPassword').value) {
        c.get('confirmPassword').setErrors({ notSame: true });
        return { notSame: true };
      } else {
        c.get('confirmPassword').setErrors(null);
      }
    }
  }
  matchOldPass(c: FormGroup): { matchPassword: boolean } {
    if ((c.get('newPassword').value) && (c.get('currentPassword').value)) {
      const isEqual = c.get('newPassword').value === c.get('currentPassword').value;
      if (isEqual) {
        c.get('newPassword').setErrors({ matchPassword: true });
        return { matchPassword: true };
      } else if (!isEqual && !c.controls.newPassword.hasError('isValid')
        && !c.controls.newPassword.hasError('notSame')
        && !c.controls.newPassword.hasError('required')
        && !c.controls.newPassword.hasError('rangeLength')
        && !c.controls.newPassword.hasError('minLength')
        && !c.controls.newPassword.hasError('maxLength')) {
        c.get('newPassword').setErrors(null);
      }
    }
  }
  changePassword() {
    const currentPass = this.changePasswordForm.get('currentPassword').value;
    const newPass = this.changePasswordForm.get('newPassword').value;
    this.changePasswordService.changePassword(currentPass, newPass
    ).subscribe(
      response => {
        if (response.response === 'Password Updated Successfully') {
          this.notify.openSnackBar('Password updated successfully', '');
          setTimeout(() => {
            this.router.navigate(['/']);
          }, 2000);
        } else if (response.response === 'Incorrect password') {
          this.changePasswordForm.get('currentPassword').setErrors({ incorrectPass: true });
          return { incorrectPass: true };
          // this.notify.openSnackBar('Incorrect current password', '');
        } else {
          this.notify.openSnackBar('Password updation failed', '');
        }
      });
  }
  incoorectpass(c: FormGroup) {

  }
}
