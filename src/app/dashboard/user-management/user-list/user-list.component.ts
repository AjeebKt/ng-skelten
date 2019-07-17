import { Caregiver } from '../../model/caregiver';
import { UserListResolverService } from '../../resolvers/user-list-resolver';
// import { Patient } from './../../model/patient';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserListService } from './user-list.service';
import { GlobalDataService } from '../../../core/services/global-data.service';
import { SnackBarService } from '../../../core/services/snack-bar.service';
import { ProgressBarService } from '../../../core/services/progress-bar.service';
import { FilterPipe } from 'src/app/shared/pipes/filter.pipe';
import { ConfirmModalService } from 'src/app/core/confirm-modal/confirm-modal.service';
import * as _ from 'underscore';
import { Doctor } from '../../model/doctor';
import { MatDialog } from '@angular/material';
import { InviteUsersComponent } from '../invite-users/invite-users.component';
import { finalize } from 'rxjs/operators';
@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  noUser: boolean;
  users: any[];
  doctors: Doctor[];
  caregivers: Caregiver[];
  filteredusers: any[];
  selectedItems = new Map<string, Array<any>>();
  selectedCareItems = new Map<string, Array<any>>();
  dropdownSettings = {};
  dropdownCareSettings = {};
  disableSettingsCar = {};
  disableSettingsDoc = {};
  filterPipeInstance = new FilterPipe();
  caregiversForThisPatient = [];
  listFilter: string;
  dropdownDoctor = [];
  dropdownCaregiver = [];
  doctorsForThisPatient = [];
  itemsPerPage = 10;
  blockMessage: string;
  pageTitle = 'Users';
  page = 1;
  pkgColor = 'accent';
  pkgChecked: boolean;
  packageStatus: boolean;
  dropdownListOfDoctor = [];
  dropdownListOfCaregiver = [];
  listLength: number;
  numberOfElements: any;
  refreshFlag = false;
  constructor(private userListService: UserListService,
    private gd: GlobalDataService,
    private dialogsService: ConfirmModalService,
    private notify: SnackBarService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private resolve: UserListResolverService,
    public dialog: MatDialog,
  ) { }

  ngOnInit() {
    // this.getDoctorsList();
    // this.getCaregiverList();
    this.page = this.gd.userIdToEdit ? this.gd.userIdToEdit.page : this.page;
    // this.getListOfPatients(this.page - 1);
  }
  getListOfPatients(page) {
    this.userListService.getAllPatients(page).pipe(finalize(() => {
      sessionStorage.removeItem('userIdtoEdit');
      this.gd.userIdToEdit = null;

    })).subscribe(response => {
      this.setListOfPatients(response.response.content);
      this.listLength = response.response.totalElements;
      this.numberOfElements = response.response.numberOfElements;

    });
  }
  setListOfPatients(patients) {
    const userList = patients;
    this.noUser = !userList || (userList && !userList.length);
    this.users = patients ? patients : userList;

    this.filteredusers = patients;
    // this.filteredusers = this.filteredusers.response.content;
    if (this.users && this.users.length) {
      this.users.forEach(u => {
        const currentUserDocList = [];
        // for loop for assigned doctor list
        if (u['listOfDoctors']) {
          u['listOfDoctors'].forEach(d => {
            const currentUserDocs = { 'id': d['id'], 'itemName': d['name'] };
            currentUserDocList.push(currentUserDocs);
          });
          //    assign doc list to selecteditem
          this.selectedItems[u['id'].toString()] = currentUserDocList;
        }
        const currentUserCareList = [];
        if (u['listOfNurses']) {
          u['listOfNurses'].forEach(c => {
            const currentUserCares = { 'id': c['id'], 'itemName': c['name'] };
            currentUserCareList.push(currentUserCares);
          });
          this.selectedCareItems[u['id'].toString()] = currentUserCareList;
        }
      });
    }
  }
  userIdChange(id) {
    this.gd.userIdToEdit = { id: +id, page: this.page || 1 };
    this.router.navigate(['app/dashboard/user-management/user/edit-user']);
  }
  onDeSelectAll($event) { }
  onItemSelectDoctors(userId) {
    this.doctorsForThisPatient = [];
    this.selectedItems[userId].forEach(d => {
      const currentItem = { 'id': d['id'] };
      this.doctorsForThisPatient.push(currentItem);
    });
    this.updateDoctorForPatient(userId, this.doctorsForThisPatient);

  }
  OnItemDeSelectDoctors(userId) {
    this.doctorsForThisPatient = [];
    this.selectedItems[userId].forEach(d => {
      const currentItem = { 'id': d['id'] };
      this.doctorsForThisPatient.push(currentItem);
    });
    this.updateDoctorForPatient(userId, this.doctorsForThisPatient);
  }
  updateDoctorForPatient(patientID, doctorsForThisPatient) {
    this.userListService.updateDoctorForPatient(patientID, doctorsForThisPatient)
      .subscribe(response => {
        if (response.response === 'Doctor Added') {
          this.notify.openSnackBar('Doctor added successfully', '');
        } else {
          this.notify.openSnackBar('Doctor removed !', '');
        }
      });
  }
  onCareItemSelect(item: any, patientID) {
    this.caregiversForThisPatient = [];
    this.selectedCareItems[patientID].forEach(selected => {
      const currentCareItem = { 'id': selected['id'] };
      this.caregiversForThisPatient.push(currentCareItem);
    });
    this.updateCaregiverForPatient(patientID, this.caregiversForThisPatient);
  }
  OnCareItemDeSelect(item: any, patientID) {
    this.caregiversForThisPatient = [];
    this.selectedCareItems[patientID].forEach(c => {
      const currentCareItem = { 'id': c['id'] };
      this.caregiversForThisPatient.push(currentCareItem);
    });
    this.updateCaregiverForPatient(patientID, this.caregiversForThisPatient);
  }
  updateCaregiverForPatient(patientID, caregiversForThisPatient) {
    this.userListService.updateCaregiverForPatient(patientID, caregiversForThisPatient)
      .subscribe(response => {
        if (response.response === 'Nurse List Updated' || response.response === 'Nurse Added') {
          this.notify.openSnackBar('Caregiver added successfully', '');
        } else if (response.response === 'Nurse Removed') {
          this.notify.openSnackBar('Caregiver removed !', '');
        }
      });
  }
  onSearchValueChange(value, page) {
    if (value) {
      this.userListService.searchPatientNameQuery(value, page).subscribe(response => {
        this.setListOfPatients(response.response.content);
        this.listLength = response.response.totalElements;
        this.numberOfElements = response.response.numberOfElements;

      });
    } else {
      this.page = 0;
      this.getListOfPatients(0);

    }
  }
  clearSearchInput() {
    if (this.listFilter) {
      this.listFilter = '';
      this.getListOfPatients(0);

      this.onSearchValueChange(this.listFilter, 0);
    }
  }
  changePackage(e, user) {
    // console.log();
    e.source.checked = !e.source.checked;
    if (this.gd.currentUser.role === 'SUB_ADMIN') {
      this.notify.openSnackBar('Access is denied. You may not have the appropriate permissions to access this ', '');
      this.getListOfPatients(this.page - 1);
      return;
    }
    this.refreshFlag = false;
    const isEnabled = e.source.checked;
    // tslint:disable-next-line:max-line-length
    const blockMessagePackage = `Are you sure you want to ${!isEnabled ? 'enable packages of ' : 'disable packages of '} ${user.patientName} ?`;
    this.dialogsService.openDialogModal({ title: 'Confirm Dialog', message: blockMessagePackage })
      .subscribe(res => {
        if (res) {
          if (isEnabled) {
            this.userListService.packageDisable(user.id)
              .subscribe((response) => {
                if (response.projectStatusCode === 'S1001') {
                  e.source.checked = !e.source.checked;
                  this.refreshFlag = true;
                  this.notify.openSnackBar('Packages Disabled Successfully ', '');
                }
              });
          } else {
            this.userListService.packageEnable(user.id)
              .subscribe((response) => {
                if (response.projectStatusCode === 'S1001') {
                  e.source.checked = !e.source.checked;
                  this.refreshFlag = true;
                  this.notify.openSnackBar('Packages Enabled Successfully ', '');
                }
              });
          }
        } else {
          if (this.numberOfElements === 1) {
            this.page = this.page - 1;
          }
          this.getListOfPatients(this.page - 1);
        }

      });
  }

  userBlockClick(user: any) {
    const blockMessage = `Are you sure you want to ${!user.enabled ? 'unblock' : 'block'} ${user.patientName} ?`;
    this.refreshFlag = false;
    this.dialogsService.openDialogModal({ title: 'Confirm Dialog', message: blockMessage })
      .subscribe(res => {
        if (res) {
          this.userListService.toggleUserBlock(user.id, !user.enabled)
            .subscribe((response) => {
              if (response.projectStatusCode === 'S1034') {
                this.refreshFlag = true;
                this.notify.openSnackBar('User blocked successfully ', '');
                this.refresh();
              } else if (response.projectStatusCode === 'S1035') {
                this.refreshFlag = true;
                this.notify.openSnackBar('User unblocked successfully ', '');
              }
              if (this.numberOfElements === 1) {
                this.page = this.page - 1;
              }
              this.getListOfPatients(this.page - 1);
              const usersTemp = this.users;
              const usersTempFilter = _.filter(usersTemp, (patient: any) => patient.id === user.id);

            });
        }
      });


  }
  userDeleteClick(userIDToDelete, userNameToDelete) {
    this.refreshFlag = false;
    const dialogOptions = {
      title: 'Confirm Dialog', message: 'Are you sure you want to remove ' + userNameToDelete + ' ?'
    };
    this.dialogsService.openDialogModal(dialogOptions)
      .subscribe(res => {
        if (res) {
          this.userListService.userDelete(userIDToDelete)
            .subscribe((response) => {
              if (response.projectStatusCode === 'S1033') {
                this.refreshFlag = true;
                this.notify.openSnackBar('User removed successfully', '');
                // this.refresh();
                if (this.numberOfElements === 1) {
                  this.page = this.page - 1;
                }
                this.getListOfPatients(this.page - 1);

              }
            });
        }
      });
  }
  refresh() {
    this.listFilter = '';
    this.noUser = false;
    const page = this.page ? this.page - 1 : 0;
    this.getListOfPatients(page);
  }
  getDoctorsList() {
    this.userListService.getListOfDoctors()
      .subscribe((response) => {
        this.doctors = response;
        this.doctors.forEach(d => {
          const currentDoc = { 'id': d['id'], 'itemName': d['name'] };
          this.dropdownListOfDoctor.push(currentDoc);
        });
      });
  }
  getCaregiverList() {
    this.userListService.getListOfCaregivers()
      .subscribe((response) => {
        this.caregivers = response;
        this.caregivers.forEach(c => {
          const currentcar = { 'id': c['id'], 'itemName': c['name'] };
          this.dropdownListOfCaregiver.push(currentcar);
        });
      });
  }
  inviteUsers() {
    const dialogRef = this.dialog.open(InviteUsersComponent);

    dialogRef.afterClosed().subscribe(result => {
      // console.log(`Dialog result: ${result}`);
    });
  }
  pagechange(page: number) {
    this.page = page;
    if (this.listFilter) {
      this.onSearchValueChange(this.listFilter, this.page - 1);
    } else {
      this.getListOfPatients(page - 1);
    }
  }
}

