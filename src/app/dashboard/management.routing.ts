import { CaregiverListResolverService } from './resolvers/caregiver-list-resolver';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { GroupListResolverService } from './resolvers/group-list.resolver';
import { SUPER_USER, SUB_ADMIN } from '../app.constants';
import { UserListResolverService } from './resolvers/user-list-resolver';
import { AdminListResolverService } from './resolvers/admin-list-resolver';
import { RouteAccessGuardService } from '../core/services/guards/route-access-guard.service';
import { DoctorListResolverService } from './resolvers/doctor-list-resolver';

const routes: Routes = [
  { path: '', redirectTo: 'user-management', pathMatch: 'full' },
  {
    path: 'user-management',
    loadChildren: './user-management/user-management.module#UserManagementModule',
    canActivate: [RouteAccessGuardService],
    canLoad: [RouteAccessGuardService],
    // resolve: { userList: UserListResolverService },
    runGuardsAndResolvers: 'always',
    data: {
      authorities: [...SUPER_USER, ...SUB_ADMIN]
    }
  },
  {
    path: 'group-management',
    loadChildren: './group-management/group-management.module#GroupManagementModule',
    // resolve: { groupList: GroupListResolverService, userList: UserListResolverService },
    runGuardsAndResolvers: 'always',
    canLoad: [RouteAccessGuardService],
    canActivate: [RouteAccessGuardService],
    data: {
      authorities: [...SUPER_USER, ...SUB_ADMIN]
    }
  },
  {
    path: 'admin-management',
    loadChildren: './admin-management/admin-management.module#AdminManagementModule',
    resolve: { adminList: AdminListResolverService },
    runGuardsAndResolvers: 'always',
    canActivate: [RouteAccessGuardService],
    canLoad: [RouteAccessGuardService],
    data: {
      authorities: [...SUPER_USER]
    }
  },
  {
    path: 'suboperator-management',
    loadChildren: './suboperator-management/suboperator-management.module#SuboperatorManagementModule',
    canActivate: [RouteAccessGuardService],
    canLoad: [RouteAccessGuardService],
    data: {
      authorities: []
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ManagementRoutingModule {

}
