import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsComponent } from './settings.component';
import { FormsModule } from '@angular/forms';
import { SettingsRoutingModule } from './settings.routing';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    SettingsRoutingModule,
    SharedModule,
  ],
  declarations: [SettingsComponent,
    ChangePasswordComponent]
})
export class SettingsModule { }
