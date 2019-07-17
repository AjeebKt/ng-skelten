import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, CanDeactivate, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthenticDeactivateGuard implements CanDeactivate<IAuthenticDeactivateGuard> {
  canDeactivate(component: IAuthenticDeactivateGuard, currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot):
    boolean | UrlTree | Observable<boolean |
      UrlTree> | Promise<boolean |
        UrlTree> {
    return component.canDeactivate();
  }
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    return true;
  }
}
export interface IAuthenticDeactivateGuard {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}
