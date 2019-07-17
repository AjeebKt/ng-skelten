import { Component, OnInit, OnDestroy, Input, HostBinding } from '@angular/core';
import { Subscription } from 'rxjs';
import { NavigationService } from './navigation.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnDestroy {
  navigationModel: any[];
  navigationModelChangeSubscription: Subscription;
  @HostBinding('class') classes = 'accordion';
  constructor(private navigationService: NavigationService) {
    this.navigationModelChangeSubscription =
      this.navigationService.onNavigationModelChange
        .subscribe((navigationModel) => {
          // console.log(navigationModel);

          this.navigationModel = navigationModel;
        });
  }

  ngOnDestroy() {
    this.navigationModelChangeSubscription.unsubscribe();
  }

}
