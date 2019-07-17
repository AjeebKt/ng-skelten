import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LoginResponse } from '../model/login-response';
import { UserDetail } from '../model/user-detail';
import { GlobalDataService } from '../core/services/global-data.service';
import { TokenResponse } from '../model/token-response';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient, private gd: GlobalDataService) { }
  login(user: { username: string, password: string }): Observable<TokenResponse> {

    const requestBody = 'username=' + user.username + '&password=' + user.password + '&grant_type=password';

    // tslint:disable-next-line: max-line-length
    return this.http.post<TokenResponse>('/auth-service/oauth/token', requestBody);


    // return this.http.post<TokenResponse>('/oauth/token', requestBody);
  }

  getLogo(): Observable<any> {
    return this.http.get<any>('/suboperator-service/configuration/logo');
  }

  getAdditionalDetails(): Observable<AdditionalDetails> {
    return this.http.get<AdditionalDetails>('/getAdditionalDetails');
  }
  getUserDetails(userid: string): Observable<any> {

    const useridJson = { 'id': userid };
    return this.http.get<any>('/suboperator-service/configuration');
  }
  logout(): Observable<boolean> {
    const userID = this.gd.currentUser['userID'];

    const userName = this.gd.currentUser['username'];
    this.gd.reset();

    const requestBody = JSON.stringify({
      userid: userID,
      username: userName,

    });

    return this.http.post<boolean>('/app/logout', requestBody);

  }


}
export class AdditionalDetails {
  hospitalId: string;
  userId: string;
  subOperatorId: string;
  subOperatorLogo?: string;
  favIcon?: string;
}
