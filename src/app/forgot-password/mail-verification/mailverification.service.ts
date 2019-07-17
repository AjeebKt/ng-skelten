import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MailverificationService {

  constructor(private http: HttpClient) { }
  verification(encryptData, urlData): Observable<any> {
    console.log(JSON.stringify(encryptData));
    return this.http.post<any>('/saas5_1_MxHi0_6/' + urlData, JSON.stringify(encryptData));
  }
}
