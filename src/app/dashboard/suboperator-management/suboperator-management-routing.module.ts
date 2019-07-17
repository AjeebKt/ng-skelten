import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SuboperatorListComponent } from './suboperator-list/suboperator-list.component';
import { AddEditSuboperatorComponent } from './add-edit-suboperator/add-edit-suboperator.component';

const routes: Routes = [
  { path: '', component: SuboperatorListComponent },
  { path: ':action', component: AddEditSuboperatorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SuboperatorManagementRoutingModule { }
