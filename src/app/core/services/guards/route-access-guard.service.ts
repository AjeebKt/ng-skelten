import { Injectable } from '@angular/core';
import { GlobalDataService } from '../global-data.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivate, CanLoad, Route, UrlSegment, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CurrentUser } from 'src/app/model/current-user';
import * as _ from 'underscore';
@Injectable({
  providedIn: 'root'
})
export class RouteAccessGuardService implements CanActivate, CanLoad {

  constructor(private globalDataService: GlobalDataService,
    private router: Router) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    return this.hasPermission(...route.data['authorities']);

  }
  canLoad(route: Route, segments: UrlSegment[]): Observable<boolean> | Promise<boolean> | boolean {

    return this.hasPermission(...route.data['authorities']);
  }

  hasPermission(...permittedRoles: string[]): boolean {

    const currentUser: CurrentUser = sessionStorage.getItem('currentUser') ?
      JSON.parse(sessionStorage.getItem('currentUser')) : this.globalDataService.currentUser;
    this.globalDataService.currentUser = currentUser;
    if (!!currentUser) {
      if (_.contains(permittedRoles, currentUser.role)) {
        return _.contains(permittedRoles, currentUser.role);
      } else {
        sessionStorage.clear();
        this.globalDataService.reset();
        this.router.navigate(['/401']);

      }
    } else {
      sessionStorage.clear();
      this.globalDataService.reset();
      this.router.navigate(['/401']);

      return false;
    }
  }
  hasToken() {

    return !!sessionStorage.getItem('CURRENT_USER') ? true : false;

  }
}

