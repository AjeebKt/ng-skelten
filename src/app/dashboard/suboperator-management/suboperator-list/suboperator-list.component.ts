import { Component, OnInit } from '@angular/core';
import { SuboperatorListService } from './suboperator-list.service';
import { Router } from '@angular/router';
import { GlobalDataService } from '../../../core/services/global-data.service';
import { SnackBarService } from '../../../core/services/snack-bar.service';
import { ProgressBarService } from '../../../core/services/progress-bar.service';
import { Ng2SearchPipe } from 'ng2-search-filter';
import { ConfirmModalService } from 'src/app/core/confirm-modal/confirm-modal.service';
import { FilterPipe } from 'src/app/shared/pipes/filter.pipe';

@Component({
  selector: 'app-suboperator-list',
  templateUrl: './suboperator-list.component.html',
  styleUrls: ['./suboperator-list.component.scss']
})
export class SuboperatorListComponent implements OnInit {

  fileUpload: any;
  itemsPerPage: any = 12;
  users: any;
  list_suboperators: any;
  filteredsuboperators = [];
  loggedInUserID: any;
  hospitalID: any;
  hospitalName: any;
  showExcell: any = false;
  uploadedFile: any;
  corporateId: any;
  pageTitle: any = 'Sub operators';
  selectedArray: any = [];
  selectedGroup: any;
  userId: any;
  blokedStatus: any;
  listFilter: string;
  noUser = false;
  blockMessage: string;
  page: number;
  filterPipeInstance = new FilterPipe();
  constructor(private SuboperatorListingService: SuboperatorListService,
    private globalDataService: GlobalDataService,
    private confirmModalService: ConfirmModalService,
    private notify: SnackBarService,
    private progressbarService: ProgressBarService,
    private router: Router) { }
  ngOnInit() {
    this.getSubOperatorList();
    this.page = this.globalDataService.subOperatorIdToEdit ? this.globalDataService.subOperatorIdToEdit.page : this.page;
    this.globalDataService.subOperatorIdToEdit = null;
  }
  getSubOperatorList() {
    this.SuboperatorListingService.fetchSubOperators()
      .subscribe(suboperators => {
        if (suboperators.length === 0) {
          this.noUser = true;
        }
        this.list_suboperators = suboperators && suboperators.length ? suboperators.reverse() : [];
        // this.filteredsuboperators = suboperators;
        this.onSearchValueChange('');
      });
  }
  onSearchValueChange(value) {
    this.filteredsuboperators = this.filterPipeInstance.transform(this.list_suboperators, value, ['subOperatorName']);
  }
  clearSearchInput() {
    if (this.listFilter) {
      this.listFilter = '';
      this.onSearchValueChange(this.listFilter);
    }
  }
  blockUserClick(blockId, name, status) {
    if (status) {
      this.blockMessage = 'Are you sure you want to unblock ' + name + ' ?';
    } else {
      this.blockMessage = 'Are you sure you want to block ' + name + ' ?';
    }
    this.confirmModalService.openDialogModal({ title: 'Confirm Dialog', message: this.blockMessage })
      .subscribe(res => {
        if (res) {
          this.SuboperatorListingService.blockSubAdmin(blockId)
            .subscribe((response) => {
              if (response.response === 'Blocked') {
                this.notify.openSnackBar('Sub operator blocked successfully', '');
              } else if (response.response === 'Unblocked') {
                this.notify.openSnackBar('Sub operator unblocked successfully', '');
              }
              this.getSubOperatorList();
            });
        }
      });
  }
  deleteUser(userIDToDelete, name) {
    this.confirmModalService.openDialogModal({ title: 'Confirm Dialog', message: 'Are you sure, you want to remove ' + name + '?' })
      .subscribe(res => {
        if (res) {
          this.SuboperatorListingService.subOperatorDelete(userIDToDelete)
            .subscribe((response) => {
              this.getSubOperatorList();
              this.notify.openSnackBar('Sub operator removed successfully', '');
            });
        }
      });
  }
  subOperatorChange(id) {
    this.globalDataService.subOperatorIdToEdit = { id: +id, page: this.page || 1 };
    this.router.navigate(['app/dashboard/suboperator-management/edit-suboperator']);
  }
  refresh() {
    this.getSubOperatorList();
    this.listFilter = '';
  }
}
