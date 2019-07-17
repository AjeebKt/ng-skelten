import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthenticComponent } from './authentic/authentic.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { SUPER_USER, UVT_ADMIN } from './app.constants';
import { AuthGuardService } from './core/services/guards/auth-guard.service';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { MailVerificationComponent } from './forgot-password/mail-verification/mail-verification.component';
import { AuthenticDeactivateGuard } from './core/services/guards/authentic-deactivate.guard';
import { ConfigurationComponent } from './configuration/configuration.component';

const routes: Routes = [{
  path: '', redirectTo: 'login', pathMatch: 'full'
},
{
  path: 'login', component: LoginComponent,
},
{
  path: 'forgot-password', component: ForgotPasswordComponent,
},
{
  path: 'verification', component: MailVerificationComponent,
},

// {
//   path: 'configuration', component: ConfigurationComponent, data: {
//     authorities: [...UVT_ADMIN]
//   }
// },

{
  path: 'app', component: AuthenticComponent,
  canActivate: [AuthGuardService], canActivateChild: [AuthGuardService],
  canDeactivate: [AuthenticDeactivateGuard],
  children: [
    { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    {
      path: 'configuration', component: ConfigurationComponent, data: {
        authorities: [...UVT_ADMIN]
      }
    },
    {
      path: 'dashboard',
      loadChildren: './dashboard/management.module#ManagementModule',
      data: {
        authorities: [...SUPER_USER]
      }

    },
    {
      path: 'settings',
      loadChildren: './settings/settings.module#SettingsModule',
      data: {
        authorities: [...SUPER_USER]
      }

    }
  ]
},
{ path: '401', component: UnauthorizedComponent },
{ path: '**', component: PageNotFoundComponent }

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true, onSameUrlNavigation: 'reload' })],
  exports: [RouterModule],
  providers: []
})
export class AppRoutingModule { }
