import { AddEditAdminComponent } from './add-edit-admin/add-edit-admin.component';
import { AdminListComponent } from './admin-list/admin-list.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', component: AdminListComponent },
  { path: ':action', component: AddEditAdminComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class AdminManagementRoutingModule {

}
