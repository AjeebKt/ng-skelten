import { Injectable } from '@angular/core';
import { GlobalDataService } from '../../../core/services/global-data.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IUser } from '../../model/user';

@Injectable({
  providedIn: 'root'
})
export class SuboperatorListService {

  constructor(private httpClient: HttpClient, private gd: GlobalDataService) { }
  fetchSubOperators(): Observable<IUser[]> {
    const udata = this.gd.currentUser.userData;
    const subOperatorId = udata.subId;
    const requestBody = JSON.stringify({
      operatorId: this.gd.currentHospital.hospitalID,
    });
    return this.httpClient.post<IUser[]>('/getSubOperatorsForThisOperator', requestBody);
  }
  blockSubAdmin(subOperatorId): Observable<any> {
    const requestBody = JSON.stringify({
      subOperatorId: subOperatorId
    });
    return this.httpClient.post<IUser[]>('/toggleSubOperatorBlock', requestBody);
  }
  subOperatorDelete(userIDtoFetch): Observable<any> {
    const requestBody = JSON.stringify({
      Id: userIDtoFetch
    });
    return this.httpClient.post<IUser[]>('/deleteSubOperator', requestBody);
  }
}
