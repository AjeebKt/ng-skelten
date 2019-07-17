import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, CanActivateChild } from '@angular/router';
import { Observable } from 'rxjs';
import { CurrentUser } from 'src/app/model/current-user';
import { GlobalDataService } from '../global-data.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild {

  constructor(private globalDataService: GlobalDataService) { }
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser: CurrentUser = sessionStorage.getItem('currentUser') ?
      JSON.parse(sessionStorage.getItem('currentUser')) : this.globalDataService.currentUser;
    this.globalDataService.currentUser = currentUser;
    return !!currentUser.token;

  }
  canActivateChild(childRoute: ActivatedRouteSnapshot, state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const currentUser: CurrentUser = sessionStorage.getItem('currentUser') ?
      JSON.parse(sessionStorage.getItem('currentUser')) : this.globalDataService.currentUser;
    this.globalDataService.currentUser = currentUser;
    return !!currentUser.token;
  }


}
