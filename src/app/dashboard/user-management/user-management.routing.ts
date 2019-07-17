import { Routes, RouterModule } from '@angular/router';
import { UserListComponent } from './user-list/user-list.component';
import { NgModule } from '@angular/core';
import { AddEditUserComponent } from './add-edit-user/add-edit-user.component';

const routes: Routes = [
  { path: '', component: UserListComponent },
  { path: 'user/:action', component: AddEditUserComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserManagementRoutingModule {
}
