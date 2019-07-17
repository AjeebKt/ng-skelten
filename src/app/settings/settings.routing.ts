import { SUB_ADMIN } from './../app.constants';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { RouteAccessGuardService } from './../core/services/guards/route-access-guard.service';
import { Routes, RouterModule } from '@angular/router';
import { SUPER_USER } from '../app.constants';
import { NgModule } from '@angular/core';

const routes: Routes = [
  { path: '', redirectTo: 'app-settings', pathMatch: 'full' },
  {
    path: 'change-password', component: ChangePasswordComponent,
    canActivate: [RouteAccessGuardService],
    canLoad: [RouteAccessGuardService],
    data: {
      authorities: [...SUPER_USER, ...SUB_ADMIN]
    }
  }
];
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {

}
