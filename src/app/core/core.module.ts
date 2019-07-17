import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core.component';
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from '../shared/shared.module';
import { FrameWorkBodyComponent } from './frame-work-body/frame-work-body.component';
import { LeftNavBarComponent } from './left-nav-bar/left-nav-bar.component';
import { ConfirmModalComponent } from './confirm-modal/confirm-modal.component';
import { RouterModule } from '@angular/router';
import { NavigationModule } from './navigation/navigation.module';

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule,
    SharedModule,
    RouterModule,
    NavigationModule
  ],
  declarations: [CoreComponent, FrameWorkBodyComponent, LeftNavBarComponent, ConfirmModalComponent],
  exports: [HttpClientModule, FrameWorkBodyComponent, ConfirmModalComponent],
  entryComponents: [ConfirmModalComponent]
})
export class CoreModule { }
