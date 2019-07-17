import { ResponseMessage } from '../../../model/response';
import { Admin } from '../../model/admin';
import { Injectable } from '@angular/core';
import { GlobalDataService } from '../../../core/services/global-data.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddEditAdminService {

  constructor(private httpClient: HttpClient, private globalDataService: GlobalDataService) { }
  isAdminUsernameExist(username): Observable<ResponseMessage> {
    return this.httpClient.post<ResponseMessage>(
      '/checkhospitalusernameexists', username
    );
  }
  // /suboperator-service/sub-admin
  addAdmin(data): Observable<any> {
    const headers = new HttpHeaders();
    return this.httpClient.post<any>('/suboperator-service/sub-admin', data);
  }
  getAdminDetails(id): Observable<any> {
    return this.httpClient.get<any>(`/suboperator-service/sub-admin/${id}`);
  }
  isUsernameExist(name): Observable<any> {
    return this.httpClient.get<any>(`/auth-service/user/exists?username=${name}`);
  }
  // /suboperator-service/sub-admin
  updateAdminDetails(data): Observable<any> {
    return this.httpClient.put<any>(`/suboperator-service/sub-admin`, data);
  }
  // updateAdminDetails(formData): Observable<ResponseMessage> {
  //   const headers = new HttpHeaders();
  //   return this.httpClient.post<ResponseMessage>(
  //     '/updateSubOperator', formData, { headers: headers.append('Content-Type', 'application/json') }
  //   );
  //   // return this.httpClient.post<any>( '/updateSubOperator', formData);
  // }
}
