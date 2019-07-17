import { GlobalDataService } from 'src/app/core/services/global-data.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ForgotService {

  constructor(private http: HttpClient, private gd: GlobalDataService) { }
  forgotpassword(param): Observable<any> {
    const headers = new HttpHeaders();
    const requestBody = 'userName=' + param + '&type=' + 'WEB';

    // return this.http.post<any>('/web/forgotpassword', requestBody, { headers: headers.append('Content-Type', 'application/json') });
    return this.http.post<any>(`/auth-service/user/forgotPassword?username=${param}`, '');
  }
}

