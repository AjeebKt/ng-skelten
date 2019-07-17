import { Caregiver } from '../../model/caregiver';
import { Doctor } from '../../model/doctor';
import { ResponseMessage } from '../../../model/response';
import { Injectable } from '@angular/core';
import { GlobalDataService } from '../../../core/services/global-data.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Patient } from '../../model/patient';

@Injectable({
  providedIn: 'root'
})
export class UserListService {

  constructor(private httpClient: HttpClient, private gd: GlobalDataService) { }
  getAllPatients(page): Observable<any> {
    const udata = this.gd.currentUser.userData;
    const subOperatorId = udata.subId;
    const requestBody = JSON.stringify({
      id: subOperatorId,
    });
    return this.httpClient.get<any>(`/patient-service/patient?page=${page}&size=10`);
    // return this.httpClient.post<Patient[]>('/allPatient', requestBody);
  }
  packageEnable(userIDtoFetch): Observable<any> {
    return this.httpClient.put<any>(`/patient-service/subscription/enable-by-admin?patientId=${userIDtoFetch}`, '');
  }
  packageDisable(userIDtoFetch): Observable<any> {
    return this.httpClient.put<any>(`/patient-service/subscription/disable?patientId=${userIDtoFetch}`, '');
  }
  toggleUserBlock(userIDtoFetch, status): Observable<any> {
    const udata = this.gd.currentUser.userData;
    const subOperatorId = udata.subId;
    const requestBody = JSON.stringify({
      patientId: userIDtoFetch
    });
    return this.httpClient.put<any>(`/patient-service/patient/${userIDtoFetch}/status?status=${status}`, {});
  }

  userDelete(userIDtoFetch): Observable<any> {
    const udata = this.gd.currentUser.userData;
    const subOperatorId = udata.subId;
    const requestBody = JSON.stringify({
      patientId: userIDtoFetch
    });
    return this.httpClient.delete<any>(`/patient-service/patient/deletePatient/${userIDtoFetch}`);
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
  updateDoctorForPatient(patientID, doctors): Observable<ResponseMessage> {
    const requestBody = JSON.stringify({
      listOfUsers: doctors,
      patientid: patientID
    });
    return this.httpClient.post<ResponseMessage>(
      '/patient/updateDoctors', requestBody
    );
  }
  updateCaregiverForPatient(patientID, caregivers): Observable<ResponseMessage> {
    const requestBody = JSON.stringify({
      listOfUsers: caregivers,
      patientid: patientID
    });
    return this.httpClient.post<ResponseMessage>(
      '/patient/updateNurses', requestBody
    );
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
  inviteIndividualUsers(details): Observable<any> {
    const udata = this.gd.currentUser.userData;
    const subOperatorId = udata.subId;
    const requestBody = JSON.stringify({
      operatorId: subOperatorId,
      emailArray: details
    });
    return this.httpClient.post<any>(
      '/invitebyoperatoremail', requestBody
    );
  }
  searchPatientNameQuery(name, page): Observable<any> {
    return this.httpClient.get<any>(`/patient-service/patient?patientNameQuery=${name}&page=${page}&size=10`);

  }
}
