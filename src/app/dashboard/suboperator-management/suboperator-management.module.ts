import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';

import { SuboperatorManagementRoutingModule } from './suboperator-management-routing.module';
import { SuboperatorListComponent } from './suboperator-list/suboperator-list.component';
import { AddEditSuboperatorComponent } from './add-edit-suboperator/add-edit-suboperator.component';

@NgModule({
  declarations: [SuboperatorListComponent, AddEditSuboperatorComponent],
  imports: [
    CommonModule,
    SuboperatorManagementRoutingModule,
    SharedModule
  ]
})
export class SuboperatorManagementModule { }
