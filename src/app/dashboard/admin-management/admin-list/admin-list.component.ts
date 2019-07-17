import { AdminListResolverService } from '../../resolvers/admin-list-resolver';
// import { Admin } from './../../model/admin';
import { ConfirmModalService } from '../../../core/confirm-modal/confirm-modal.service';
import { SnackBarService } from '../../../core/services/snack-bar.service';
import { ProgressBarService } from '../../../core/services/progress-bar.service';
import { GlobalDataService } from '../../../core/services/global-data.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AdminListService } from './admin-list.service';
import { FilterPipe } from 'src/app/shared/pipes/filter.pipe';
import * as _ from 'underscore';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-admin-list',
  templateUrl: './admin-list.component.html',
  styleUrls: ['./admin-list.component.scss']
})
export class AdminListComponent implements OnInit {
  pageTitle: string;
  noUser: boolean;
  adminDetails: any[];
  filteredAdmins: any[];
  listFilter: string;
  itemsPerPage = 10;
  page = 1;
  filterPipeInstance = new FilterPipe();
  blockMessage: string;
  blokedStatus: any;
  listLength: number;
  numberOfElements: number;
  constructor(
    private globalDataService: GlobalDataService,
    private dialogsService: ConfirmModalService,
    private router: Router,
    private progressbarService: ProgressBarService,
    public notify: SnackBarService,
    private adminListService: AdminListService,
    private activatedRoute: ActivatedRoute,
    private resolve: AdminListResolverService
  ) { }

  ngOnInit() {
    this.pageTitle = 'Admins';
    this.page = this.globalDataService.adminIdToEdit ? this.globalDataService.adminIdToEdit.page : this.page;
    this.getListOfAdmins(this.page - 1);
  }
  getListOfAdmins(page) {
    this.adminListService.getListOfAdmins(page).pipe(finalize(() => {
      sessionStorage.removeItem('adminIdToEdit');
      this.globalDataService.adminIdToEdit = null;

    })).subscribe(response => {
      this.setListOfAdmins(response.response.content);
      this.listLength = response.response.totalElements;
      this.numberOfElements = response.response.numberOfElements;
    });
  }
  setListOfAdmins(admins) {
    const adminList = admins;
    this.noUser = !adminList || (adminList && !adminList.length);
    this.adminDetails = admins;
    this.filteredAdmins = admins;
  }
  refresh() {
    this.listFilter = '';
    this.noUser = false;
    const page = this.page ? this.page - 1 : 0;
    this.getListOfAdmins(page);
    this.listFilter = '';
    this.noUser = false;
    // this.router.navigate(['/app/dashboard/admin-management']);
  }
  pagechange(page: number) {
    this.page = page;
    if (this.listFilter) {
      this.onSearchValueChange(this.listFilter, this.page - 1);
    } else {
      this.getListOfAdmins(page - 1);
    }
  }
  onSearchValueChange(value, page) {
    if (value) {
      this.adminListService.searchAdminNameQuery(value, page).subscribe(response => {
        this.setListOfAdmins(response.response.content);
        this.listLength = response.response.totalElements;
        this.numberOfElements = response.response.numberOfElements;

      });
    } else {
      this.page = 0;
      this.getListOfAdmins(0);

    }
  }
  clearSearchInput() {
    if (this.listFilter) {
      this.listFilter = '';
      this.getListOfAdmins(0);

      this.onSearchValueChange(this.listFilter, 0);
    }
  }
  toggleAdminBlock(object: any) {
    const blockMessage = `Are you sure you want to ${!object.enable ? 'unblock' : 'block'} ${object.subOperatorName} ?`;
    const dialogOptions = {
      title: 'Confirm Dialog',
      message: blockMessage
    };
    this.dialogsService
      .openDialogModal(dialogOptions)
      .subscribe(
        res => {
          if (res) {
            const toggleMsg = !object.enable ? 'unblock' : 'block';
            if (object.enable) {
              this.adminListService.adminBlock(object.id).subscribe(
                response => {
                  this.blokedStatus = response.response;
                  if (response.projectStatusCode === 'S1039') {
                    this.notify.openSnackBar('Admin blocked successfully ', '');
                  } else {
                    this.notify.openSnackBar('Failed', '');
                    object.blocked = false;
                  }
                  this.refresh();
                });
            } else {
              this.adminListService.adminUnBlock(object.id).subscribe(
                response => {
                  this.blokedStatus = response.response;
                  // this.getListOfAdmins(this.page - 1);
                  if (response.projectStatusCode === 'S1040') {
                    this.notify.openSnackBar('Admin unblocked successfully ', '');
                  } else {
                    this.notify.openSnackBar('Failed', '');
                    object.blocked = false;
                  }
                  this.refresh();
                });
            }
            // this.adminListService.toggleAdminBlock(object.id).subscribe(
            //   response => {
            //     this.blokedStatus = response.response;
            //     this.setListOfAdmins(this.page - 1);
            //     if (response.response === 'Blocked') {
            //       this.notify.openSnackBar('Admin blocked successfully ', '');
            //     } else if (response.response === 'Unblocked') {
            //       this.notify.openSnackBar('Admin unblocked successfully', '');
            //       object.blocked = false;
            //     }
            //     this.refresh();
            //   });
            this.getListOfAdmins(this.page - 1);

          }
        });
  }
  adminDelete(adminIDToDelete, adminNameToDelete) {
    // console.log(adminIDToDelete, adminNameToDelete);
    const dialogOptions = {
      title: 'Confirm Dialog',
      message: 'Are you sure you want to remove ' + adminNameToDelete + ' ?'
    };
    this.dialogsService
      .openDialogModal(dialogOptions)
      .subscribe(
        res => {
          if (res) {
            this.adminListService.adminDelete(adminIDToDelete).subscribe(
              response => {
                if (response.response === 'success') {
                  this.notify.openSnackBar('Admin removed successfully', '');
                  this.refresh();
                }
              });
          }
        });
  }
  userIdChange(id) {
    this.globalDataService.adminIdToEdit = { id: +id, page: this.page || 1 };
    this.router.navigate(['app/dashboard/admin-management/edit-admin']);
  }
}
