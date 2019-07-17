import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, Observer, of, BehaviorSubject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GlobalDataService } from 'src/app/core/services/global-data.service';
import { catchError, tap } from 'rxjs/operators';
import { Caregiver } from '../model/caregiver';
import { CurrentUser } from 'src/app/model/current-user';
import { ErrorResponse } from 'src/app/core/services/response.interceptor';

@Injectable({
    providedIn: 'root'
})
export class CaregiverListResolverService implements Resolve<Observable<Caregiver[]>> {
    caregiverListResolver = new BehaviorSubject(null);
    constructor(private httpClient: HttpClient, private globalDataService: GlobalDataService) {
    }
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot):
        Observable<Caregiver[]> |
        Observable<Observable<Caregiver[]>> | Promise<Observable<Caregiver[]>> {
        return Observable.create((observer: Observer<any>) => {
            this.getListOfCaregivers().pipe(catchError((err) => {
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
                this.caregiverListResolver.next(list);
                observer.complete();
            });
        });
    }
    getListOfCaregivers(): Observable<Caregiver[]> {
        const currentUser: CurrentUser = sessionStorage.getItem('currentUser') ? JSON.parse(sessionStorage.getItem('currentUser')) : null;
        this.globalDataService.currentUser = currentUser || this.globalDataService.currentUser;
        const udata = currentUser ? currentUser.userData : this.globalDataService.currentUser.userData;
        const subOperatorId = udata.subId;
        const requestBody = JSON.stringify({
            id: subOperatorId
          });
          return this.httpClient.post<Caregiver[]>(
            '/allnurse', requestBody
          );
    }
}
