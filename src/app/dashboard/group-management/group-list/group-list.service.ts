import { Group } from '../../model/group';
import { Injectable } from '@angular/core';
import { GlobalDataService } from '../../../core/services/global-data.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GroupDelete } from '../../model/group-delete';

@Injectable({
  providedIn: 'root'
})
export class GroupListService {
  constructor(private httpClient: HttpClient, private gd: GlobalDataService) { }
  getListOfGroups(page): Observable<any> {
    const udata = this.gd.currentUser.userData;
    const subOperatorId = udata.subId;
    return this.httpClient.get<any>(
      `/patient-service/group?page=${page}&size=10`
    );
  }
  searchGroupNameQuery(name, page): Observable<any> {
    const udata = this.gd.currentUser.userData;
    const subOperatorId = udata.subId;
    return this.httpClient.get<any>(
      `/patient-service/group?groupNameQuery=${name}&page=${page}&size=10`
    );
  }
  groupDelete(groupId): Observable<any> {
    return this.httpClient.delete<any>(
      `/patient-service/group/groupId=${groupId}?groupId=${groupId}`
    );
    // /patient-service/group/{groupId}?groupId=5
  }
}
