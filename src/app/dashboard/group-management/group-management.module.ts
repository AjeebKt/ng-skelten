import { AddEditGroupComponent } from './add-edit-group/add-edit-group.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GroupManagementComponent } from './group-management.component';
import { GroupManagementRoutingModule } from './group-management.routing';
import { SharedModule } from '../../shared/shared.module';
import { GroupListComponent } from './group-list/group-list.component';

@NgModule({
  imports: [
    CommonModule,
    GroupManagementRoutingModule,
    SharedModule
  ],
  declarations: [GroupManagementComponent,
  AddEditGroupComponent,
  GroupListComponent]
})
export class GroupManagementModule { }
