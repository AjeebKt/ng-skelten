import { AddEditUserService } from '../../user-management/add-edit-user/add-edit-user.service';
import { Admin } from '../../model/admin';
import { of } from 'rxjs';
import { CustomValidators } from '../../../custom-validators/CustomValidators';
import { ProgressBarService } from '../../../core/services/progress-bar.service';
import { GlobalDataService } from '../../../core/services/global-data.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { SnackBarService } from 'src/app/core/services/snack-bar.service';
import { AddEditAdminService } from './add-edit-admin.service';
import { debounceTime, distinctUntilChanged, map, catchError } from 'rxjs/operators';
import { rangeLength } from 'src/app/shared/custom-validator/range-length';

@Component({
  selector: 'app-add-edit-admin',
  templateUrl: './add-edit-admin.component.html',
  styleUrls: ['./add-edit-admin.component.scss']
})
export class AddEditAdminComponent implements OnInit {
  addEditAdminForm: FormGroup;
  adminName: string;
  pageTitle: string;
  submitText: string;
  submitted: boolean;
  // adminIdtoFetch: any;
  adminDetails: Admin;
  adminEmailTemp: string;
  adminEditID: any;
  isEditAdmin: boolean;
  constructor(private addEditAdminService: AddEditAdminService,
    private globalDataService: GlobalDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private notify: SnackBarService,
  ) {
    this.addEditAdminForm = this.formBuilder.group({
      adminName: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(50),
          rangeLength(3, 50),
          CustomValidators.nameValidation(),
          CustomValidators.isFirstLetter()
        ])
      ],
      // adminUsername: [
      //   '',
      //   [
      //     Validators.compose([
      //       Validators.required,
      //       Validators.minLength(4),
      //       Validators.maxLength(15),
      //       rangeLength(4, 15),
      //       CustomValidators.usernameValidation(),
      //       CustomValidators.isFirstLetter()
      //     ])
      //   ],
      //   this.validateAdminUsername.bind(this)
      // ],
      adminEmail: [
        '',
       [ Validators.compose([
          Validators.required
        ])],
        this.validateAdminEmail.bind(this)
      ],
      contactNumber: [''],
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
      { validator: [this.passwordConfirming] }
    );
  }
  ngOnInit() {
    const action = this.activatedRoute.snapshot.params['action'];
    if (!action || (action !== 'add-admin' && action !== 'edit-admin')) {
      this.router.navigate(['/app/dashboard/admin-management']);
    }
    if (action === 'add-admin') {
      this.pageTitle = 'Add admin';
      this.submitText = 'Submit';
    } else if (action === 'edit-admin') {
      // this.adminIdtoFetch = this.globalDataService.adminIdToEdit;
      this.pageTitle = 'Edit admin';
      this.isEditAdmin = true;
      this.submitText = 'Update';
      this.getAdminDetails();
    }
  }
  get adminFormContorls() {
    return this.addEditAdminForm.controls;
  }
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.addEditAdminForm.invalid) {
      this.notify.openSnackBar('Please check fields !', '');
      return;
    }
    if (this.submitText === 'Submit') {
      this.addAdmin();
    } else if (this.submitText === 'Update') {
      this.updateAdminDetails();
    }
  }
  cancelAddAdmin() {
    this.router.navigate(['/app/dashboard/admin-management']);
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
  validateAdminEmail(control: AbstractControl) {
    if (this.adminEmailTemp && this.adminEmailTemp === control.value) {
      return of(null);
    }
    return this.addEditAdminService.isUsernameExist(control.value.trim()).pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      map(response => {
        return (response.projectStatusCode === 'S1001' && response.response === false)
          ? null
          : { isExist: { message: 'An account with this email exists.Please enter a different  email' } };
      }),
      catchError(error => {
        return of({ isExist: { message: 'An account with this email exists.Please enter a different  email' } });
      })
    );
  }
  addAdmin() {
    const adminDetailObject = {
      phone: this.addEditAdminForm.get('contactNumber').value,
      email: this.addEditAdminForm.get('adminEmail').value,
      subOperatorName: this.addEditAdminForm.get('adminName').value,
      password: this.addEditAdminForm.get('confirmPassword').value,
      // username: this.addEditAdminForm.get('adminUsername').value,
    };
    this.addEditAdminService.addAdmin(adminDetailObject).subscribe((response) => {
      if (response.projectStatusCode === 'S1041') {
        this.notify.openSnackBar('Admin added successfully', '');
        this.router.navigate(['/app/dashboard/admin-management']);
      }
    });
  }
  getAdminDetails() {
    this.addEditAdminService.getAdminDetails(this.globalDataService.adminIdToEdit.id)
      .subscribe(result => {
        this.adminEditID = result.response.id;
        this.adminDetails = result.response;
        // this.adminUsernameTemp = this.adminDetails.userName;
        this.addEditAdminForm.patchValue({
          adminName: this.adminDetails.subOperatorName,
          adminEmail: this.adminDetails.email,
          contactNumber: this.adminDetails.phone,
        });
        // this.addEditAdminForm.controls.adminUsername.disable();
        this.addEditAdminForm.controls.newPassword.disable();
        this.addEditAdminForm.controls.confirmPassword.disable();
      });
  }
  updateAdminDetails() {

    const adminDetailObject = {
      id: this.adminEditID,
      phone: this.addEditAdminForm.get('contactNumber').value,
      email: this.addEditAdminForm.get('adminEmail').value,
      subOperatorName: this.addEditAdminForm.get('adminName').value,
    };
    this.addEditAdminService.updateAdminDetails(adminDetailObject).subscribe((response) => {
      if (response.projectStatusCode === 'S1041') {
        this.notify.openSnackBar('Admin Updated successfully', '');
        this.router.navigate(['/app/dashboard/admin-management']);
      }
    });
  }


}
