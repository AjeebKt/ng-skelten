import { SharedModule } from '../../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminManagementComponent } from './admin-management.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { AddEditAdminComponent } from './add-edit-admin/add-edit-admin.component';
import { AdminManagementRoutingModule } from './admin-management.routing';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AdminManagementRoutingModule
  ],
  declarations: [
    AdminManagementComponent,
    AdminListComponent,
    AddEditAdminComponent]
})
export class AdminManagementModule { }
