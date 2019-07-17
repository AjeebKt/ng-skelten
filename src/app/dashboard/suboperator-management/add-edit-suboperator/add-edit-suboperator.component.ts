import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, AbstractControl } from '@angular/forms';
import { CountryList } from '../../model/country-list';
import { GlobalDataService } from '../../../core/services/global-data.service';
import { AddEditSuboperatorService } from './add-edit-suboperator.service';
import { SnackBarService } from '../../../core/services/snack-bar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, catchError } from 'rxjs/operators';
import { ProgressBarService } from '../../../core/services/progress-bar.service';
import { CustomValidators } from '../../../custom-validators/CustomValidators';
import { rangeLength } from 'src/app/shared/custom-validator/range-length';
import { CropperComponent } from 'angular-cropperjs';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-add-edit-suboperator',
  templateUrl: './add-edit-suboperator.component.html',
  styleUrls: ['./add-edit-suboperator.component.scss']
})
export class AddEditSuboperatorComponent implements OnInit {
  @ViewChild('logo') public logoCropper: CropperComponent;
  @ViewChild('favIcon') public favIconCropper: CropperComponent;

  newSubOperatorForm: FormGroup;
  submitted: any = false;
  items: Array<any> = [];
  subOperator: any;
  username: string;
  success: any;
  pageTitle: string;
  isEditUser: boolean;
  location: any;
  selectedLocation: any;
  suboperatorDetailsObj = new FormData();
  disableButtons: boolean;
  fileName: string;
  favFileName: string;
  imageAdded: any;
  logoImageUrl;
  favImageUrl;
  config: { rotatable: boolean; viewMode: number; zoomable: boolean; minCropBoxWidth: number; minCropBoxHeight: number; };
  logoImage: string;
  favImage: string;
  constructor(private formBuilder: FormBuilder,
    private gd: GlobalDataService,
    private activatedRoute: ActivatedRoute,
    private addEditService: AddEditSuboperatorService,
    private notify: SnackBarService,
    private router: Router) {
    this.newSubOperatorForm = this.formBuilder.group({
      name: [null, [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50),
        rangeLength(3, 50),
        CustomValidators.isFirstLetter(),
        CustomValidators.nameValidation(),
      ]],
      username: [
        '',
        [
          Validators.compose([
            Validators.required,
            Validators.minLength(4),
            Validators.maxLength(15),
            rangeLength(4, 15),
            CustomValidators.usernameValidation(),
            CustomValidators.isFirstLetter()
          ])
        ],
        this.validateUsername.bind(this)
      ],
      locationSelect: [null, [Validators.required]],
      contactPerson: [null, [Validators.required,
      Validators.maxLength(15), Validators.minLength(4),
      rangeLength(4, 15)
      ]],
      email: [null, Validators.required],
      contactNumber: [null, [Validators.minLength(8)]],
      tearmsAndConditons: [null, [Validators.minLength(15)]]
    });
  }
  ngOnInit() {
    // console.log(document.head.querySelectorAll('link').item(0).href = environment.image);


    this.items = CountryList;
    const action = this.activatedRoute.snapshot.params['action'];
    const isEditUser = action === 'edit-suboperator';
    if (!action || (action !== 'add-suboperator' && action !== 'edit-suboperator')) {
      this.router.navigate(['/app/dashboard/suboperator-management']);
    }
    this.isEditUser = isEditUser;
    if (this.isEditUser) {
      this.onChanges();
      this.getSubOperatorDetails();
    }
    this.pageTitle = isEditUser ? 'Edit sub operator' : 'Add sub operator';
  }
  getSubOperatorDetails() {
    this.addEditService.fetchSuboperatorDetialsEdit(this.gd.subOperatorIdToEdit.id).subscribe(response => {
      this.setFormDataToEdit(response);
    });
  }
  setFormDataToEdit(details) {
    this.logoImage = details.subOperatorLogo;
    this.favImage = details.favIcon;
    const subOperatordetails = details;
    this.username = subOperatordetails.userName;
    this.newSubOperatorForm.setValue({
      name: subOperatordetails.subOperatorName,
      username: subOperatordetails.userName,
      contactPerson: subOperatordetails.contactPerson,
      email: subOperatordetails.email,
      contactNumber: subOperatordetails.contactNumber,
      tearmsAndConditons: subOperatordetails.tearmsAndConditons,
      locationSelect: [{
        id: subOperatordetails.location,
        text: subOperatordetails.location
      }]
    });
    this.subOperatorFormContorls.username.disable();
  }
  get subOperatorFormContorls() { return this.newSubOperatorForm.controls; }
  onChanges(): void {
    this.newSubOperatorForm.get('username').valueChanges.subscribe(val => {
      this.username = val;
    });
  }
  validateUsername(control: AbstractControl) {
    if (this.username && this.username === control.value) {
      return of(null);
    }
    return this.addEditService.checkUserName(control.value.trim()).pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      map(response => {
        return response.response === 'success'
          ? null
          : { isExist: { message: 'An account with this username exists.Please enter a different  username' } };
      }),
      catchError(error => {
        return of({ isExist: { message: 'An account with this username exists.Please enter a different  username' } });
      })
    );
  }
  onChange($event) {
  }
  onPhAdded($event) {
  }
  onSubmit() {
    this.isEditUser ? this.updateSuboperator() : this.savenewSuboperator();
  }
  savenewSuboperator() {
    this.submitted = true;
    if (this.newSubOperatorForm.invalid) {
      return;
    }
    this.subOperator = {
      operatorId: this.gd.currentHospital.hospitalID,
      subOperatorName: this.newSubOperatorForm.controls.name.value,
      location: this.newSubOperatorForm.controls.locationSelect.value[0].text,
      contactPerson: this.newSubOperatorForm.controls.contactPerson.value,
      contactNumber: this.newSubOperatorForm.controls.contactNumber.value,
      email: this.newSubOperatorForm.controls.email.value,
      blocked: false,
      freeTrail: 'true',
      prePaid: false,
      subOperatorLogo: this.logoImage,
      favIcon: this.favImage,
      postPaid: false,
      tearmsAndConditons: this.newSubOperatorForm.controls.tearmsAndConditons.value
    };
    const savenewSuboperatorData = new FormData();
    savenewSuboperatorData.append('subOperator', JSON.stringify(this.subOperator));
    savenewSuboperatorData.append('userName', this.subOperatorFormContorls.username.value.trim());
    savenewSuboperatorData.append('operatorId', this.gd.currentHospital.hospitalID);
    this.addEditService.addSubOperator(savenewSuboperatorData).subscribe((response) => {
      this.notify.openSnackBar('Sub operator added successfully!', '');
      this.router.navigate(['/app/dashboard/suboperator-management']);
    },
    );
  }
  updateSuboperator() {
    this.submitted = true;
    if (this.submitted && this.newSubOperatorForm.invalid) {
      return;
    }
    this.suboperatorDetailsObj = new FormData();
    const subOperator = {
      operatorId: this.gd.currentHospital.hospitalID,
      subOperatorName: this.newSubOperatorForm.controls.name.value,
      email: this.newSubOperatorForm.controls.email.value,
      tearmsAndConditons: this.newSubOperatorForm.controls.tearmsAndConditons.value,
      location: this.newSubOperatorForm.controls.locationSelect.value[0].text,
      contactPerson: this.newSubOperatorForm.controls.contactPerson.value,
      contactNumber: this.newSubOperatorForm.controls.contactNumber.value,
      subOperatorId: this.gd.subOperatorIdToEdit.id,
      subOperatorLogo: this.logoImage,
      favIcon: this.favImage
    };

    this.suboperatorDetailsObj.append('subOperator', JSON.stringify(subOperator));
    this.addEditService.updateSuboperatorDetialsEdit(this.suboperatorDetailsObj).subscribe((response) => {
      this.newSubOperatorForm.reset();
      if (response.response === 'Saved Successfully') {
        this.notify.openSnackBar('Sub operator updated successfully!', '');
        this.router.navigate(['/app/dashboard/suboperator-management']);
      }
    });
  }
  cancelAdd() {
    this.router.navigate(['/app/dashboard/suboperator-management']);
  }
  changeListener($event, type = 'logo'): void {
    this.readThis($event.target, type);
    this.disableButtons = true;
  }
  readThis(inputValue: any, type): void {
    // let fileName1, fileExtension;
    // fileName1 = inputValue.files[0].name;
    // fileExtension = fileName1.replace(/^.*\./, '');
    // console.log(fileExtension);

    const file: File = inputValue.files[0];
    if (type === 'logo') {
      this.fileName = file.name;

    } else {
      this.favFileName = file.name;
    }
    const fileExtension = type === 'logo' ? this.fileName.replace(/^.*\./, '') : this.favFileName.replace(/^.*\./, '');
    // this.fileExtension = fileName.replace(/^.*\./, '');
    const fileName = fileExtension;
    if (
      fileName === 'jpg' ||
      fileName === 'JPG' ||
      fileName === 'jpeg' ||
      fileName === 'png' ||
      fileName === 'JPEG' ||
      fileName === 'PNG'
    ) {
      const Readimage: FileReader = new FileReader();
      Readimage.onloadend = e => {

        if (type === 'logo') {
          this.logoImageUrl = Readimage.result;
          if (this.logoCropper.cropper) {
            this.logoCropper.cropper.replace(this.logoImageUrl);
          }
        } else {
          this.favImageUrl = Readimage.result;
          if (this.favIconCropper.cropper) {
            this.favIconCropper.cropper.replace(this.favImageUrl);
          }
        }
      };
      Readimage.readAsDataURL(file);

      this.config = {
        rotatable: false,
        viewMode: 1,
        zoomable: true,
        minCropBoxWidth: 0,
        minCropBoxHeight: 0
      };
    } else {
      this.disableButtons = false;

    }
  }
  cancelCrop(type = 'logo') {
    if (type === 'logo') {
      this.logoImageUrl = '';
    } else {
      this.favImageUrl = '';

    }
    this.imageAdded = false;
    this.disableButtons = false;

  }
  ready(e) {

  }
  cropfun(type = 'logo') {
    this.disableButtons = false;
    this.imageAdded = false;
    if (type === 'logo') {
      this.logoImageUrl = '';
      this.logoImage = this.logoCropper.cropper
        .getCroppedCanvas({
          width: 160,
          height: 56
        })
        .toDataURL();
    } else {
      this.favImageUrl = '';
      this.favImage = this.favIconCropper.cropper
        .getCroppedCanvas({
          width: 160,
          height: 56
        })
        .toDataURL();
    }
  }
  removeFavIcon() {
    if (this.isEditUser) {
      this.suboperatorDetailsObj = new FormData();
      const subOperator = {
        operatorId: this.gd.currentHospital.hospitalID,
        subOperatorName: this.newSubOperatorForm.controls.name.value,
        email: this.newSubOperatorForm.controls.email.value,
        tearmsAndConditons: this.newSubOperatorForm.controls.tearmsAndConditons.value,
        location: this.newSubOperatorForm.controls.locationSelect.value[0].text,
        contactPerson: this.newSubOperatorForm.controls.contactPerson.value,
        contactNumber: this.newSubOperatorForm.controls.contactNumber.value,
        subOperatorId: this.gd.subOperatorIdToEdit.id,
        subOperatorLogo: this.logoImage,
        favIcon: null
      };

      this.suboperatorDetailsObj.append('subOperator', JSON.stringify(subOperator));
      this.addEditService.updateSuboperatorDetialsEdit(this.suboperatorDetailsObj).subscribe((response) => {
        this.newSubOperatorForm.reset();
        if (response.response === 'Saved Successfully') {
          this.favFileName = '';
          this.getSubOperatorDetails();
          this.notify.openSnackBar('Fav icon removed successfully!', '');
        }
      });
    } else {
      this.favImage = '';
      this.favFileName = '';
      this.favImageUrl = '';
      this.notify.openSnackBar('Fav icon removed successfully!', '');

    }

  }
  removeLogo() {
    if (this.isEditUser) {

      this.suboperatorDetailsObj = new FormData();
      const subOperator = {
        operatorId: this.gd.currentHospital.hospitalID,
        subOperatorName: this.newSubOperatorForm.controls.name.value,
        email: this.newSubOperatorForm.controls.email.value,
        tearmsAndConditons: this.newSubOperatorForm.controls.tearmsAndConditons.value,
        location: this.newSubOperatorForm.controls.locationSelect.value[0].text,
        contactPerson: this.newSubOperatorForm.controls.contactPerson.value,
        contactNumber: this.newSubOperatorForm.controls.contactNumber.value,
        subOperatorId: this.gd.subOperatorIdToEdit.id,
        subOperatorLogo: null,
        favIcon: this.favImage
      };

      this.suboperatorDetailsObj.append('subOperator', JSON.stringify(subOperator));
      this.addEditService.updateSuboperatorDetialsEdit(this.suboperatorDetailsObj).subscribe((response) => {
        this.newSubOperatorForm.reset();
        if (response.response === 'Saved Successfully') {
          this.fileName = '';
          this.getSubOperatorDetails();
          this.notify.openSnackBar('Logo removed successfully!', '');
        }
      });
    } else {
      this.logoImageUrl = '';
      this.logoImage = '';
      this.fileName = '';
      this.notify.openSnackBar('Logo removed successfully!', '');

    }
  }
}
