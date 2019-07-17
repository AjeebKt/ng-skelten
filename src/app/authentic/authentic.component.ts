import { ConfirmModalService } from './../core/confirm-modal/confirm-modal.service';
import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../core/navigation/navigation.service';
import { NavigationModel } from '../core/navigation/navigation.model';
import { GlobalDataService } from '../core/services/global-data.service';
import { CurrentUser } from '../model/current-user';
import * as _ from 'underscore';
import { MenuItem } from '../model/menu-item';
import { Router } from '@angular/router';
import { IAuthenticDeactivateGuard } from '../core/services/guards/authentic-deactivate.guard';
@Component({
  selector: 'app-authentic',
  templateUrl: './authentic.component.html',
  styleUrls: ['./authentic.component.scss']
})
export class AuthenticComponent implements IAuthenticDeactivateGuard, OnInit {

  constructor(private navigationService: NavigationService,
    private confirmDialogService: ConfirmModalService,
    private router: Router, private globalDataService: GlobalDataService) {
  }

  canDeactivate() {
    return !this.globalDataService.currentUser.token;
  }

  ngOnInit() {
    this.setMenus();
  }
  setMenus() {
    const navigationModel = new NavigationModel(this.router, this.confirmDialogService, this.globalDataService, this.navigationService);
    const currentUser: CurrentUser = sessionStorage.getItem('currentUser') ? JSON.parse(sessionStorage.getItem('currentUser')) : null;
    this.globalDataService.currentUser = currentUser || this.globalDataService.currentUser;
    const savedUser = this.globalDataService.currentUser;
    const menus = navigationModel.menus;

    if (!!savedUser) {
      let submenus = [];
      let submenu;
      // _.each(currentUser.role, (role: Role) => {
      const temp_menu = _.filter(_.map(menus), (menu: MenuItem) => {
        return _.contains(menu.roles, savedUser.role);
      });
      _.each(_.map(temp_menu), (headMenu: MenuItem) => {
        submenu = _.filter(headMenu.submenu, (subMenu: MenuItem) => {
          subMenu.groupBy = headMenu.id;
          return _.contains(subMenu.roles, savedUser.role);
        });
        submenus = _.union(submenus, submenu);
      });
      const grouped = _.groupBy(submenus, m => m.groupBy);
      _.each(temp_menu, e => {
        e.submenu = grouped[e.id];
      });

      navigationModel.menus = temp_menu;
      this.navigationService.setNavigationModel(navigationModel);
    }

  }
}
