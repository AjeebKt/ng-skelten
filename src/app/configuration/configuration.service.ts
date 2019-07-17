import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ConfigurationService {

  constructor(private httpClient: HttpClient) { }

  getConf(): Observable<any> {
    return this.httpClient.get('/suboperator-service/configuration');
  }
  uploadData(data): Observable<any> {
    return this.httpClient.post('/suboperator-service/configuration', data);
  }
  uploadImg(data): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.set('Content-Type', 'multipart/form-data');
    return this.httpClient.post('/suboperator-service/configuration/logo', data, { headers: headers });
  }
  logout(): Observable<any> {
    return this.httpClient.delete<any>('/auth-service/user/logout');
  }

}
