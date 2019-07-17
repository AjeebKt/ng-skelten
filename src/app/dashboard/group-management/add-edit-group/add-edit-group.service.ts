import { Group } from '../../model/group';
import { ResponseWithDataMessage, ResponseMessage } from '../../../model/response';
import { GlobalDataService } from '../../../core/services/global-data.service';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AddEditGroupService {
  constructor(private httpClient: HttpClient, private gd: GlobalDataService) { }
  addGroup(groupName, patientIds): Observable<any> {
    const requestBody = JSON.stringify({
      groupName: groupName,
      patientIdList: patientIds,
    });
    return this.httpClient.post<any>('/patient-service/group', requestBody);
  }

  getGroup(id): Observable<any> {
    // return this.httpClient.get<any>(`/patient-service/group/{groupId}?groupId=${id}`);
    return this.httpClient.get<any>(`/patient-service/group/${id}`);
  }
  isGroupnameExist(groupName): Observable<any> {
    const udata = this.gd.currentUser.userData;
    const subOperatorId = udata.subId;
    const requestBody = JSON.stringify({
      groupName: groupName,
      subOperatorId: subOperatorId
    });
    // http://202.88.246.152:8762/patient-service/group/exists?groupName=we
    return this.httpClient.get<any>(`/patient-service/group/exists?groupName=${groupName}`);
  }
  getGroupDetails(): Observable<Group[]> {
    const udata = this.gd.currentUser.userData;
    const subOperatorId = udata.subId;
    return this.httpClient.get<Group[]>('/group/getallgroups?subOpertorId=' + subOperatorId);
  }
  getAllPatientsWithoutPagination(): Observable<any> {
    return this.httpClient.get<any>(`/patient-service/patient/all`);
  }
  updateGroup(groupName, patientIdList, id): Observable<any> {
    const requestBody = JSON.stringify({
      groupName: groupName,
      patientIdList: patientIdList,
      groupId: id,
      // subOperatorId: subOperatorId
    });
    return this.httpClient.put<any>('/patient-service/group', requestBody);
  }

}
