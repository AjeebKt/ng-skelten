import { Caregiver } from '../../model/caregiver';
import { ResponseMessage } from '../../../model/response';
import { GlobalDataService } from 'src/app/core/services/global-data.service';
import { Patient, NewPatientResponse } from '../../model/patient';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { EditUserResponse } from '../../model/edit-user-response';
import { Doctor } from '../../model/doctor';

@Injectable()
export class AddEditUserService {

  constructor(private httpClient: HttpClient, private gd: GlobalDataService) { }

  getUserDetailsById(id): Observable<any> {
    return this.httpClient.get<any>(`/patient-service/patient/${id}`);

  }
  addUser(data): Observable<any> {
    return this.httpClient.post<ResponseMessage>('/patient-service/patient', data);
  }
  isUsernameExist(name): Observable<any> {
    // /auth-service/user/exists?username=asdf
    return this.httpClient.get<any>(`/auth-service/user/exists?username=${name}`);

  }
  updateUserDetails(data): Observable<any> {
    return this.httpClient.put<any>('/patient-service/patient/update-by-admin', data);
  }
  getGroupList(): Observable<any> {
    return this.httpClient.get<any>('/patient-service/group/groupnames');
  }
  getAssignedGroupList(id): Observable<any> {
    return this.httpClient.get<any>(`/patient-service/group/patientgroups?patientId=${id}`);
  }
  getListOfCaregivers(): Observable<Caregiver[]> {
    const udata = this.gd.currentUser.userData;
    const subOperatorId = udata.subId;
    const requestBody = JSON.stringify({
      id: subOperatorId
    });
    return this.httpClient.post<Caregiver[]>(
      '/allnurse', requestBody
    );
  }
  getListOfDoctors(): Observable<Doctor[]> {
    const udata = this.gd.currentUser.userData;
    const subOperatorId = udata.subId;
    const requestBody = JSON.stringify({
      id: subOperatorId
    });
    return this.httpClient.post<Doctor[]>(
      '/alldoctor', requestBody
    );
  }
}
