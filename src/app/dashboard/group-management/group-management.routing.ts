import { AddEditGroupComponent } from './add-edit-group/add-edit-group.component';
import { GroupListComponent } from './group-list/group-list.component';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', component: GroupListComponent },
  { path: ':action', component: AddEditGroupComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class GroupManagementRoutingModule {

}

