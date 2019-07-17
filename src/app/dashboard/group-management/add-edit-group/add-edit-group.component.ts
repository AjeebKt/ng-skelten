import { GlobalDataService } from '../../../core/services/global-data.service';
import { ProgressBarService } from '../../../core/services/progress-bar.service';
import { AddEditGroupService } from './add-edit-group.service';
import { SnackBarService } from '../../../core/services/snack-bar.service';
import { Component, OnInit, HostListener } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import {
  FormGroup,
  FormBuilder,
  Validators,
  AbstractControl
} from '@angular/forms';
import { UserListService } from '../../user-management/user-list/user-list.service';
import { CustomValidators } from 'src/app/custom-validators/CustomValidators';
import {
  map,
  catchError,
  debounceTime,
  distinctUntilChanged,
  finalize
} from 'rxjs/operators';
import { of } from 'rxjs';
import * as _ from 'underscore';
import { UserListResolverService } from '../../resolvers/user-list-resolver';
import { GroupListResolverService } from '../../resolvers/group-list.resolver';
import { rangeLength } from 'src/app/shared/custom-validator/range-length';
@Component({
  selector: 'app-add-edit-group',
  templateUrl: './add-edit-group.component.html',
  styleUrls: ['./add-edit-group.component.scss']
})
export class AddEditGroupComponent implements OnInit {
  addEditGroupForm: FormGroup;
  submitted = false;
  pageTitle: string;
  patientList: any[];
  patients: any[];
  patientIdsResponse: any = [];
  checkAllButtonStatus = false;
  checkButtonStatus: any = [];
  selectedPatientIds: any = [];
  itemsPerPage = 10;
  tableTitle: string;
  groupName: string;
  noUser: boolean;
  listOfGroupDetails: any[];
  groupList: any[];
  submitText: string;
  selectedUsers: any[];
  page = 1;
  listLength: number;
  numberOfElements = 10;
  constructor(
    private gd: GlobalDataService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private notify: SnackBarService,
    private addEditGroupService: AddEditGroupService
  ) {
    this.addEditGroupForm = this.formBuilder.group({
      groupName: [
        '',
        [
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(50),
            rangeLength(3, 50),
            CustomValidators.groupNameValidation(),
            CustomValidators.isFirstLetter()
          ])
        ],
        this.validateGroupName.bind(this)
      ]
    });
  }

  ngOnInit() {

    const action = this.activatedRoute.snapshot.params['action'];

    if (!action || (action !== 'add-group' && action !== 'edit-group')) {
      this.router.navigate(['/app/dashboard/group-management']);
    }
    if (action === 'add-group') {
      this.pageTitle = 'Add group';
      this.submitText = 'Submit';
      this.getAllPatients();
    } else if (action === 'edit-group') {
      this.pageTitle = 'Edit group';
      this.getAllPatients();
      this.getGroupDetails();
      this.submitText = 'Update';
    }
    this.tableTitle = 'Users';
  }
  validateGroupName(control: AbstractControl) {
    if (this.groupName && this.groupName === control.value) {
      return of(null);
    }
    return this.addEditGroupService.isGroupnameExist(control.value.trim()).pipe(
      debounceTime(1000),
      distinctUntilChanged(),
      map(response => {
        return (response.projectStatusCode === 'S1001' && response.response === false)
          ? null
          : { isExist: { message: 'Group name already exists' } };
      }),
      catchError(error => {
        return of({ isExist: { message: 'Group name already exists' } });
      })
    );
  }
  get userFormContorls() {
    return this.addEditGroupForm.controls;
  }
  cancelAddGroup() {
    this.router.navigate(['/app/dashboard/group-management']);
  }
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.addEditGroupForm.invalid && this.submitted) {
      // this.notify.openSnackBar('Please check mandatory field !', '');
      return;
    }
    if (this.submitText === 'Submit') {
      this.addGroup();
    } else if (this.submitText === 'Update') {
      this.updateGroup();
    }
  }
  addGroup() {
    const selectedUserIds = _.map(_.filter(this.patientList, (patient: any) => patient.selected), (patient: any) => patient.id);

    if (this.addEditGroupForm.invalid) {
      // this.notify.openSnackBar('Please check mandatory field !', '');
    } else {
      this.addEditGroupService
        .addGroup(this.addEditGroupForm.get('groupName').value, selectedUserIds)
        .subscribe(response => {
          if (response.projectStatusCode === 'S1014') {
            this.notify.openSnackBar('Group added successfully', '');
            this.router.navigate(['/app/dashboard/group-management']);
          } else {
            this.notify.openSnackBar('Group addition failed !', '');
          }
        });
    }
  }

  getAllPatients() {
    this.checkButtonStatus = [];
    this.patientIdsResponse = [];
    this.patients = [];
    this.checkAllButtonStatus = false;
    this.addEditGroupService.getAllPatientsWithoutPagination().subscribe(data => {
      const response = data.response;
      this.listLength = response.length ? response.length : 0;
      for (let i = 0; i < response.length; i++) {
        response[i].selected = false;
        this.patientIdsResponse.push(response[i].id);
        this.checkButtonStatus.push(false);
      }
      this.patientList = response;
      this.patients = response;
      if (response.length === 0) {
        this.notify.openSnackBar('No users available !', '');
      }
      if (this.pageTitle === 'Edit group') {
        this.getGroupDetails();
      }
    });
  }
  checkBoxSingleSeletionOfUser() {
    this.checkAllButtonStatus = !!!_.filter(this.patientList, (patient: any) => !patient.selected).length;
  }
  checkBoxAllSelectionOfUsers(selectValue, event) {
    this.checkAllButtonStatus = event.target.checked;

    this.patientList.forEach((patient) => {
      patient.selected = event.target.checked;
    });
  }
  getGroupDetails() {
    this.addEditGroupService.getGroup(this.gd.groupIdToEdit.id).subscribe(response => {
      const data = response.response;
      this.groupName = data.groupName;
      this.addEditGroupForm.setValue({
        groupName: this.groupName
      });
      const selectedUsers = data.patients;
      for (let j = 0; j < selectedUsers.length; j++) {
        this.selectedPatientIds.push(selectedUsers[j].id);
        const selectedUser = _.find(this.patientList, (patient) => patient.id === selectedUsers[j].id);
        if (selectedUser) {
          selectedUser.selected = true;
        }
        this.checkButtonStatus[j] = true;
      }
      if (this.patients.length === this.selectedPatientIds.length) {
        this.checkAllButtonStatus = true;
      }
      this.patientList.sort((a, b) => {
        if (a.selected) {
          return -1;
        }
        if (b.selected) {
          return 1;
        }
        return 0;
      });
      this.checkBoxSingleSeletionOfUser();
    });
  }
  updateGroup() {
    const selectedUserIds = _.map(_.filter(this.patientList, (patient) => patient.selected), (patient) => patient.id);
    if (this.addEditGroupForm.invalid) {
      // this.notify.openSnackBar('Please check mandatory field !', '');
    } else {
      this.addEditGroupService
        .updateGroup(this.userFormContorls.groupName.value, selectedUserIds, this.gd.groupIdToEdit.id)
        .subscribe(response => {
          if (response.projectStatusCode === 'S1015') {
            this.notify.openSnackBar('Group updated successfully', '');
            this.router.navigate(['/app/dashboard/group-management']);
          } else {
            this.notify.openSnackBar('Group updation failed !', '');
          }
        });
    }
  }
  pagechange(page: number) {
    this.page = page;
    const totel = this.listLength;
    if (totel) {
      const quotient = Math.floor(totel / 10);
      const remainder = totel % 10;
      if (page > quotient) {
        this.numberOfElements = remainder;
      } else {
        this.numberOfElements = 10;
      }
    }

  }
}
