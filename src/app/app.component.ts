import { Component, OnInit } from '@angular/core';
import { ProgressBarService } from './core/services/progress-bar.service';
import { Router } from '@angular/router';
import { NavigationService } from './core/navigation/navigation.service';
import { NavigationModel } from './core/navigation/navigation.model';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { GlobalDataService } from './core/services/global-data.service';
import { ConfirmModalService } from './core/confirm-modal/confirm-modal.service';
declare let colorsIn: any;
declare let $: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'CL-Health-Wellness-FE';
  showLoader: boolean;
  constructor(
    private progressbarService: ProgressBarService,
    private confirmDialogService: ConfirmModalService, private globalDataService: GlobalDataService,
    private router: Router, private navigationService: NavigationService) {
    this.navigationService.setNavigationModel(new NavigationModel(router, confirmDialogService, globalDataService, navigationService));

  }

  ngOnInit() {
    const colors = new colorsIn('#292d37');
    this.progressbarService.status.pipe(debounceTime(200), distinctUntilChanged()).subscribe((val: boolean) => {
      this.showLoader = val;
    });
  }
}
