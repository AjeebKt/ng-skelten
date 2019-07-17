import { OverviewComponent } from '../overview/overview.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserManagementComponent } from './user-management.component';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';
import { UserListComponent } from './user-list/user-list.component';
import { SharedModule } from '../../shared/shared.module';
import { UserManagementRoutingModule } from './user-management.routing';
import { InviteUsersComponent } from './invite-users/invite-users.component';
import { MAT_DIALOG_DEFAULT_OPTIONS } from '@angular/material';

@NgModule({
  imports: [
    CommonModule,
    UserManagementRoutingModule,
    SharedModule,

  ],
  declarations: [UserManagementComponent,
    AddEditUserComponent,
    InviteUsersComponent,
    UserListComponent,
    OverviewComponent],
  entryComponents: [
    InviteUsersComponent
  ],
  providers: [
    {provide: MAT_DIALOG_DEFAULT_OPTIONS, useValue: {hasBackdrop: false}}
  ]
})
export class UserManagementModule { }
