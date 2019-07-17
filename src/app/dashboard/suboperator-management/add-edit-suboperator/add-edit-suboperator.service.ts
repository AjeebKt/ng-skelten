import { ResponseMessage } from '../../../model/response';
import { Injectable } from '@angular/core';
import { GlobalDataService } from '../../../core/services/global-data.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AddEditSuboperatorService {

  constructor(private httpClient: HttpClient, private gd: GlobalDataService) { }

  addSubOperator(savenewSuboperatorData): Observable<ResponseMessage> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.httpClient.post<ResponseMessage>('/newSubOperator', savenewSuboperatorData, { headers: headers });
  }
  checkUserName(username1): Observable<ResponseMessage> {
    const requestBody = username1;
    return this.httpClient.post<ResponseMessage>('/checkhospitalusernameexists', requestBody);
  }
  fetchSuboperatorDetialsEdit(subOperatorId): Observable<any> {
    const requestBody = JSON.stringify({
      Id: subOperatorId
    });
    return this.httpClient.post<any>('/getSubOperatorDetails', requestBody);
  }
  updateSuboperatorDetialsEdit(updateSuboperatorData): Observable<ResponseMessage> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    return this.httpClient.post<ResponseMessage>('/updateSubOperator', updateSuboperatorData, { headers: headers });
  }
}
