import { FloatNumberDirective } from '../../../shared/directives/float-number.directive';
import { of } from 'rxjs';
import { UserDetail } from '../../../model/user-detail';
import { CustomValidators } from '../../../custom-validators/CustomValidators';
import { Component, OnInit, ViewChild } from '@angular/core';
import { GlobalDataService } from '../../../core/services/global-data.service';
import { SnackBarService } from '../../../core/services/snack-bar.service';
import { Router, ActivatedRoute } from '@angular/router';
import { CountryList } from '../../model/country-list';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { ProgressBarService } from '../../../core/services/progress-bar.service';
import { AddEditUserService } from './add-edit-user.service';
import { IMyDpOptions } from 'mydatepicker';
import { Patient } from '../../model/patient';
import { debounceTime, distinctUntilChanged, map, catchError } from 'rxjs/operators';
import * as _ from 'underscore';
import { UserListService } from '../user-list/user-list.service';
import { SelectItem } from 'ng2-select';
import { rangeLength } from 'src/app/shared/custom-validator/range-length';
import { TimeOffset } from 'src/app/model/time-offset';
@Component({
  selector: 'app-add-edit-user',
  templateUrl: './add-edit-user.component.html',
  styleUrls: ['./add-edit-user.component.scss'],
  providers: [AddEditUserService]
})
export class AddEditUserComponent implements OnInit {

  public myDatePickerOptions: IMyDpOptions = {
    // other options...
    dateFormat: 'dd-mm-yyyy',
    alignSelectorRight: true,
    maxYear: new Date().getFullYear() - 18,
    disableDateRanges: [
      {
        begin: {
          year: new Date().getFullYear() - 18,
          month: new Date().getMonth() + 1,
          day: new Date().getDate()
        },
        end: { year: 3118, month: 12, day: 31 }
      }
    ]
  };
  addEditUserForm: FormGroup;
  genderList = [
    'Male',
    'Female'
  ];
  timeZoneList = TimeOffset.map(e => ({ text: e.name, id: e.offset }));
  submitted = false;
  items = [];
  allowClear = true;
  pageTitle: string;
  isEditUser: boolean;
  groupList: any = [];
  buttonStatusedit: boolean;
  userID: string;
  useremailTemp: string;
  submitText: string;
  idOfUser: number;
  dropdownList = [];
  selectedItems = [];
  userDoctorList: any[];
  userCaregiverList: any[];
  selectedCareItems = [];
  doctorsForThisPatient = [];
  dropdownCareList = [];
  userIDD: any;
  caregiversForThisPatient = [];
  disableSelection: boolean;
  selectedGroups: any[] = [];
  selectedGroupsList: any[];
  constructor(
    private userListService: UserListService,
    private formBuilder: FormBuilder,
    private progressbarService: ProgressBarService,
    private globalDataService: GlobalDataService,
    private notify: SnackBarService,
    private router: Router,
    private addEditUserService: AddEditUserService,
    private activatedRoute: ActivatedRoute
  ) {
    this.addEditUserForm = this.formBuilder.group({
      name: [
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
      // userName: [
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
      //   this.validateUsername.bind(this)
      // ],
      dateOfBirth: [
        '',
        Validators.required
      ],
      userContactNumber: [''],
      userGender: [
        '',
        Validators.required
      ],
      utcOffset: [
        [], Validators.required
      ],
      diabetic: [''],
      userHeight: [, [
        Validators.compose([
          // Validators.pattern(/[0-9]+(\.{1}[0-9]+)?/g),
          Validators.min(100),
          Validators.max(272)]),
        CustomValidators.numberValidation(),
      ]
      ],
      userWeight: [,
        [
          Validators.compose([
            // Validators.pattern(/[0-9]+(\.[0-9]+)?/g),
            Validators.min(30),
            Validators.max(635),
            CustomValidators.numberValidation(),
          ])
        ]
      ],
      userCountry: [''],
      userAddress:
        [
          '',
          [
            Validators.maxLength(255),
            Validators.minLength(5),
            rangeLength(5, 255)

          ]
        ],
      userEmail: [
        '',
        [Validators.compose([
          Validators.required,
          Validators.email,
          // CustomValidators.emailValidation(),
        ])], this.validateUserEmail.bind(this)
      ],
      guardianEmail: [
        '',
        Validators.compose([
          // Validators.required,
          // Validators.email
          // CustomValidators.emailValidation(),
        ])
      ],
      stateAndZipCode:
        ['',
          [
            Validators.maxLength(30),
            Validators.minLength(6),
            rangeLength(6, 30)
          ]
        ],
      userStartDate: [''],
      selectedGroup: [''],
      isUserBlocked: [''],
      groupList: [[], ''],
      groupIdListToAdd: [[], ''],
      groupIdListToRemove: [[], ''],
    });
  }
  ngOnInit() {
    this.userFormContorls.dateOfBirth.valueChanges.subscribe((date) => {
    });
    this.items = CountryList;
    const action = this.activatedRoute.snapshot.params['action'];

    const isEditUser = action === 'edit-user';
    if (!action || (action !== 'add-user' && action !== 'edit-user')) {
      this.router.navigate(['/app/dashboard/user-management']);
    }
    this.isEditUser = isEditUser;
    if (this.isEditUser) {
      this.buttonStatusedit = true;
      this.getAssignedGroupList();
      this.getUserDetails();
    } else {
      this.getGroupList();
    }
    this.pageTitle = isEditUser ? 'Edit user' : 'Add user';
    this.submitText = isEditUser ? 'Update' : 'Submit';
  }
  private _to2digit(n: number) {
    return ('00' + n).slice(-2);
  }
  setFormDataToEdit(response) {
    const patient = response.response;
    this.useremailTemp = patient.email;
    const gender = patient.gender !== null ? patient.gender.charAt(0).toUpperCase() + patient.gender.toLowerCase().slice(1) : '';
    const date = new Date(patient.birthDate);
    const startDateTemp = new Date(patient.createdDate);
    const y = startDateTemp.getFullYear();
    const m = startDateTemp.getMonth() + 1;
    const d = startDateTemp.getDate();
    const startDate = this._to2digit(d) + '-' + this._to2digit(m) + '-' + y;
    this.idOfUser = patient.id;
    this.addEditUserForm.patchValue({
      // userName: patient.patientName,
      name: patient.patientName,
      // userId: patient.userId,
      userEmail: patient.email,
      // guardianEmail: patient.guardianEmail,
      guardianEmail: patient.guardianEmail !== null ? patient.guardianEmail : '',
      userContactNumber: patient.phone,
      userGender: [{
        text: gender,
        id: gender
      }
      ],
      userHeight: !!patient.height ? patient.height : '',
      userWeight: !!patient.weight ? patient.weight : '',
      userCountry: [!!patient.country ? patient.country : ''],
      utcOffset: [!!patient.utcOffset ? patient.utcOffset : ''],
      userAddress: patient.address1,
      stateAndZipCode: patient.address2,
      diabetic: patient.diabetic,
      dateOfBirth: {
        date: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        }
      },
      userStartDate: startDate,
      isUserBlocked: patient.enabled,
    });
    // this.userFormContorls.userEmail.disable();
    // this.userFormContorls.guardianEmail.disable();
    // this.userFormContorls.userName.disable();
    this.userFormContorls.userStartDate.disable();
    this.userDoctorList = response['listOfDoctors'];
    this.userCaregiverList = response['listOfNurses'];
    this.userIDD = patient.id;
    this.disableSelection = patient.enabled;
    const currentUserDocList = [];
    const currentUserCareList = [];
    // for loop for assigned doctor list
    if (response['listOfDoctors']) {
      // tslint:disable-next-line:no-shadowed-variable
      response['listOfDoctors'].forEach(d => {
        const currentUserDocs = { 'id': d['id'], 'text': d['name'] };
        currentUserDocList.push(currentUserDocs);

      });

      //    assign doc list to selecteditem
      this.selectedItems = currentUserDocList;
    }
    if (response['listOfNurses']) {
      response['listOfNurses'].forEach(c => {
        const currentUserCares = { 'id': c['id'], 'text': c['name'] };
        currentUserCareList.push(currentUserCares);

      });

      //    assign doc list to selecteditem
      this.selectedCareItems = currentUserCareList;
    }
  }
  get userFormContorls() { return this.addEditUserForm.controls; }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    this.userFormContorls.userCountry.setErrors(null);
    this.userFormContorls.groupList.setErrors(null);
    this.userFormContorls.selectedGroup.setErrors(null);
    if (this.addEditUserForm.invalid) {
      this.notify.openSnackBar('Please check fields !', '');
      return;
    } else {
      if (this.submitText === 'Update') {
        this.updateUserDetails();
      } else {
        this.addUser();
      }
    }
  }
  cancelAddUser() {
    this.router.navigate(['/app/dashboard/user-management']);
  }
  addUser() {
    const temp = this.addEditUserForm.get('dateOfBirth').value;
    const tem = temp['date'].year + '-' + temp['date'].month + '-' + temp['date'].day;
    const location = this.addEditUserForm.get('userCountry').value;
    const groupId = this.addEditUserForm.get('selectedGroup').value;
    const utcOffset = this.addEditUserForm.get('utcOffset').value;
    let userGroups = this.addEditUserForm.get('groupList').value;
    userGroups = userGroups.map(e => (e.id));
    // console.log(userGroups);


    const addUserObject = {
      // username: this.addEditUserForm.get('userName').value,
      patientName: this.addEditUserForm.get('name').value,
      email: this.addEditUserForm.get('userEmail').value,
      guardianEmail: this.addEditUserForm.get('guardianEmail').value,
      phone: this.addEditUserForm.get('userContactNumber').value,
      gender: this.addEditUserForm.get('userGender').value[0].text.toUpperCase(),
      height: this.addEditUserForm.get('userHeight').value,
      weight: this.addEditUserForm.get('userWeight').value,
      country: !!location && !!location.length ? location[0].text : '',
      address1: this.addEditUserForm.get('userAddress').value,
      address2: this.addEditUserForm.get('stateAndZipCode').value,
      birthDate: new Date(tem),
      diabetic: this.addEditUserForm.get('diabetic').value,
      groupId: !!groupId && !!groupId.length ? groupId[0].id : '',
      utcOffset: !!utcOffset && !!utcOffset.length ? utcOffset[0].id : '',
      groupIdList: userGroups
    };

    const filterObj = _.omit(addUserObject, function (value, key, object) {
      return !_.identity(value);
    });
    const formData = new FormData();
    const userImageBASE64 = '';
    const operatorId = this.globalDataService.currentHospital.hospitalID;
    const udata = this.globalDataService.currentUser.userData;
    const subOperatorId = udata.subId;
    formData.append('patient', JSON.stringify(filterObj));
    formData.append('base64', userImageBASE64);
    formData.append('role', 'ROLE_PATIENT');
    formData.append('hospitalId', operatorId);
    formData.append('subOperatorId', subOperatorId);
    // formData.append('username', this.addEditUserForm.get('userName').value);
    this.addEditUserService.addUser(filterObj).subscribe(
      response => {
        if (response.message === 'patient created') {
          this.notify.openSnackBar('User added successfully ', '');
          this.router.navigate(['/app/dashboard/user-management']);
        } else {
          this.notify.openSnackBar('Failed !', '');
        }
      });
  }
  getUserDetails() {
    this.addEditUserService.getUserDetailsById(this.globalDataService.userIdToEdit.id)
      .subscribe((response) => {
        this.setFormDataToEdit(response);
      });
  }

  public removed(value: any): void {
    // console.log('Removed value is: ', value);
  }

  getGroupList() {
    const groupList = [];
    this.addEditUserService.getGroupList()
      .subscribe((response) => {
        const groupData = response.response;
        Object.keys(groupData).forEach((key) => {
          const data = {
            text: groupData[key].groupName,
            id: groupData[key].id
          };
          groupList.push(data);
        });
        this.groupList = groupList;
      });
  }

  getAssignedGroupList() {
    this.addEditUserService.getAssignedGroupList(this.globalDataService.userIdToEdit.id)
      .subscribe((response) => {
        const groupData = response.response;
        const groups = _.groupBy(groupData, m => m.member);
        const selectedGroups = groups.true;
        const unSelectedGroups = groups.false;
        this.groupList = _.map(groupData, e => ({ id: e.id, text: e.groupName }));
        this.selectedGroups = _.map(selectedGroups, e => ({ id: e.id, text: e.groupName }));
        this.addEditUserForm.get('groupList').setValue(this.selectedGroups);
      });
  }
  updateUserDetails() {

    const temp = this.addEditUserForm.get('dateOfBirth').value;
    const tem = temp['date'].year + '-' + temp['date'].month + '-' + temp['date'].day;
    const location = this.addEditUserForm.get('userCountry').value;
    const utcOffset = this.addEditUserForm.get('utcOffset').value;
    const utcOffsetTemp = utcOffset[0].id ? utcOffset[0].id : this.addEditUserForm.get('utcOffset').value[0];
    const groupId = this.addEditUserForm.get('selectedGroup').value;
    let userGroups = this.addEditUserForm.get('groupList').value;

    userGroups = userGroups.map(e => (e.id));
    const removeGroups = this.selectedGroups.map(e => (e.id));

    const addUserObject = {
      patientId: this.idOfUser,
      patientName: this.addEditUserForm.get('name').value,
      guardianEmail: this.addEditUserForm.get('guardianEmail').value,
      phone: this.addEditUserForm.get('userContactNumber').value,
      gender: this.addEditUserForm.get('userGender').value[0].text.toUpperCase(),
      height: this.addEditUserForm.get('userHeight').value,
      weight: this.addEditUserForm.get('userWeight').value,
      country: (!!location && !!location[0]) ? location[0].text : '',
      address1: this.addEditUserForm.get('userAddress').value,
      address2: this.addEditUserForm.get('stateAndZipCode').value,
      birthDate: new Date(tem),
      diabetic: this.addEditUserForm.get('diabetic').value,
      groupId: !!groupId && !!groupId.length ? groupId[0].id : '',
      utcOffset: utcOffsetTemp,
      // groupIdList: userGroups,
      groupIdListToAdd: userGroups,
      groupIdListToRemove: removeGroups
    };
    let filterObj = addUserObject;
    if (!!!addUserObject.height) {
      filterObj = _.omit(filterObj, 'height');
    }
    if (!!!addUserObject.weight) {
      filterObj = _.omit(filterObj, 'weight');
    }
    const guardian = {};
    const formData = new FormData();
    const userImageBASE64 = '';
    const operatorId = this.globalDataService.currentHospital.hospitalID;
    const udata = this.globalDataService.currentUser.userData;
    const subOperatorId = udata.subId;
    formData.append('patient', JSON.stringify(filterObj));
    formData.append('base64', userImageBASE64);
    formData.append('guardian', JSON.stringify(guardian));
    this.addEditUserService.updateUserDetails(addUserObject).subscribe(
      response => {
        if (response.projectStatusCode === 'S1032') {
          this.notify.openSnackBar('User updated successfully ', '');
          this.router.navigate(['/app/dashboard/user-management']);
        } else {
          this.notify.openSnackBar('Failed !', '');
        }
      });
  }
  validateUserEmail(control: AbstractControl) {
    if (this.useremailTemp && this.useremailTemp === control.value) {
      return of(null);
    }
    return this.addEditUserService.isUsernameExist(control.value.trim()).pipe(
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
  getListOfDoctors() {
    this.addEditUserService.getListOfDoctors()
      .subscribe(doctors => {
        this.dropdownList = [];
        doctors.forEach(d => {
          // SelectItem
          const currentDoc = { 'id': d.id, 'text': d.name };
          this.dropdownList.push(currentDoc);
        });
      });
  }
  getListOfCaregivers() {
    this.addEditUserService.getListOfCaregivers()
      .subscribe(caregivers => {
        this.dropdownCareList = [];
        caregivers.forEach(c => {
          const currentcar = { 'id': c['id'], 'text': c['name'] };
          this.dropdownCareList.push(currentcar);
        });
      });
  }
  onItemSelect(item: any, patientID) {
    this.doctorsForThisPatient = [];
    this.selectedItems.forEach(d => {
      const currentItem = { 'id': d['id'] };
      this.doctorsForThisPatient.push(currentItem);
    });
    this.updateDoctorForPatient(patientID, this.doctorsForThisPatient);
  }
  OnItemDeSelect(item: any, patientID) {
    this.doctorsForThisPatient = [];
    this.selectedItems = this.selectedItems.filter(it => it.id !== item.id);
    this.selectedItems.forEach(d => {
      const currentItem = { 'id': d['id'] };
      this.doctorsForThisPatient.push(currentItem);
    });
    this.updateDoctorForPatient(patientID, this.doctorsForThisPatient);
  }
  updateDoctorForPatient(patientID, doctorsForThisPatient) {
    this.userListService.updateDoctorForPatient(this.userIDD, doctorsForThisPatient)
      .subscribe(response => {

        if (response.response) {
          this.getUserDetails();
        }
      });
  }
  onCareItemSelect(item: any, patientID) {
    this.caregiversForThisPatient = [];
    this.selectedCareItems.forEach(c => {
      const currentCareItem = { 'id': c['id'] };
      this.caregiversForThisPatient.push(currentCareItem);
    });
    this.updateCaregiverForPatient(patientID, this.caregiversForThisPatient);

  }
  OnCareItemDeSelect(item: any, patientID) {
    this.caregiversForThisPatient = [];
    this.selectedCareItems = this.selectedCareItems.filter(it => it.id !== item.id);
    this.selectedCareItems.forEach(c => {
      const currentCareItem = { 'id': c['id'] };
      this.caregiversForThisPatient.push(currentCareItem);
    });
    this.updateCaregiverForPatient(patientID, this.caregiversForThisPatient);
  }
  updateCaregiverForPatient(patientID, caregiversForThisPatient) {
    this.userListService.updateCaregiverForPatient(this.userIDD, caregiversForThisPatient)
      .subscribe(response => {
        if (response.response) {
          this.getUserDetails();
        }
      });
  }
}
