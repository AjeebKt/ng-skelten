import { finalize } from 'rxjs/operators';
import { GroupListService } from './group-list.service';
import { ConfirmModalService } from '../../../core/confirm-modal/confirm-modal.service';
import { SnackBarService } from '../../../core/services/snack-bar.service';
import { ProgressBarService } from '../../../core/services/progress-bar.service';
import { GlobalDataService } from '../../../core/services/global-data.service';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Group } from '../../model/group';
import { FilterPipe } from 'src/app/shared/pipes/filter.pipe';
import * as _ from 'underscore';
import { GroupListResolverService } from '../../resolvers/group-list.resolver';

@Component({
  selector: 'app-group-list',
  templateUrl: './group-list.component.html',
  styleUrls: ['./group-list.component.scss']
})
export class GroupListComponent implements OnInit {
  itemsPerPage = 10;
  noUser: boolean;
  listOfGroupDetails: Group[];
  filteredGroups: Group[];
  filterPipeInstance = new FilterPipe();
  listFilter: string;
  pageTitle: string;
  page = 1;
  listLength: number;
  numberOfElements: any;
  constructor(
    private groupListService: GroupListService,
    private dialogsService: ConfirmModalService,
    private notify: SnackBarService,
    private globalDataService: GlobalDataService,
    private resolve: GroupListResolverService,
    private progressbarService: ProgressBarService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {

    this.pageTitle = 'Groups';
    this.noUser = false;
    // this.setListOfGroups();
    this.page = this.globalDataService.groupIdToEdit ? this.globalDataService.groupIdToEdit.page : this.page;
    this.globalDataService.groupIdToEdit = null;
    this.getListOfGroups(this.page - 1);
  }
  getListOfGroups(page) {
    this.groupListService.getListOfGroups(page).pipe(finalize(() => {
      sessionStorage.removeItem('groupIdToEdit');
      this.globalDataService.groupIdToEdit = null;

    })).subscribe(data => {
      this.setListOfGroups(data.response.content);
      this.listLength = data.response.totalElements;
      this.numberOfElements = data.response.numberOfElements;
      // console.log(this.listLength);
      // console.log(this.numberOfElements);
    });
  }
  refresh() {
    this.pageTitle = 'Groups';
    this.listFilter = '';
    this.noUser = false;
    const page = this.page ? this.page - 1 : 0;
    this.getListOfGroups(page);
  }
  setListOfGroups(groups) {
    // console.log(groups);

    const groupList = groups;
    this.noUser = !groupList || (groupList && !groupList.length);
    this.listOfGroupDetails = groups;
    this.filteredGroups = groups;
    // console.log(this.listOfGroupDetails);

  }
  onSearchValueChange(value, page) {
    // this.filteredGroups = this.filterPipeInstance.transform(
    //   this.listOfGroupDetails,
    //   value, ['groupName']
    // );
    if (value) {
      this.groupListService.searchGroupNameQuery(value, page).subscribe(response => {
        // console.log(response);
        this.setListOfGroups(response.response.content);
        this.listLength = response.response.totalElements;
        this.numberOfElements = response.response.numberOfElements;
      });
    } else {
      this.page = 0;
      this.getListOfGroups(0);

    }
  }
  clearSearchInput() {
    if (this.listFilter) {
      this.listFilter = '';
      this.getListOfGroups(0);

      this.onSearchValueChange(this.listFilter, 0);
    }
  }
  groupDeleteClick(groupIdToDelete, groupNameToDelete) {
    const dialogOptions = {
      title: 'Confirm Dialog',
      message: 'Are you sure you want to remove ' + groupNameToDelete + ' ?'
    };
    this.dialogsService.openDialogModal(dialogOptions).subscribe(res => {
      if (res) {
        this.groupListService
          .groupDelete(groupIdToDelete)
          .subscribe(response => {
            if (response.projectStatusCode === 'S1016') {
              this.notify.openSnackBar('Group removed successfully', '');
              this.refresh();
            }
          });
      }
    });
  }
  userIdChange(id) {
    this.globalDataService.groupIdToEdit = { id: +id, page: this.page || 1 };
    this.router.navigate(['app/dashboard/group-management/edit-group']);
  }
  pagechange(page: number) {
    this.page = page;
    if (this.listFilter) {
      this.onSearchValueChange(this.listFilter, this.page - 1);
    } else {
      this.getListOfGroups(page - 1);
    }
  }
}
