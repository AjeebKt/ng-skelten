import { Injectable } from '@angular/core';

import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

import { Observable, Observer, of, BehaviorSubject } from 'rxjs';


import { HttpClient } from '@angular/common/http';
import { GlobalDataService } from 'src/app/core/services/global-data.service';
import { Group } from '../model/group';
import { CurrentUser } from 'src/app/model/current-user';
import { catchError, tap } from 'rxjs/operators';
import { ErrorResponse } from 'src/app/core/services/response.interceptor';

@Injectable({
    providedIn: 'root'
})
export class GroupListResolverService implements Resolve<Observable<Group[]>> {
    groupListResolver = new BehaviorSubject(null);
    constructor(private http: HttpClient, private gd: GlobalDataService) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<Group[]> |
        Observable<Observable<Group[]>> | Promise<Observable<Group[]>> {
        return Observable.create((observer: Observer<any>) => {
            this.getListOfGroups().pipe(catchError((err) => {
                return of(err);
            }), tap((response) => {
                const isError = response instanceof ErrorResponse;
                if (!isError) {
                    return response.reverse();
                } return [];
            })).subscribe((data) => {
                const isError = data instanceof ErrorResponse;
                const list = !isError ? data : [];
                observer.next(list);
                this.groupListResolver.next(list);
                observer.complete();
            });
        });
    }
    getListOfGroups(): Observable<Group[]> {
        const currentUser: CurrentUser = sessionStorage.getItem('currentUser') ? JSON.parse(sessionStorage.getItem('currentUser')) : null;
        this.gd.currentUser = currentUser || this.gd.currentUser;
        const udata = currentUser ? currentUser.userData : this.gd.currentUser.userData;
        const subOperatorId = udata.subId;
        return this.http.get<Group[]>(
            '/group/getallgroups?subOpertorId=' + subOperatorId
        );
    }
}
