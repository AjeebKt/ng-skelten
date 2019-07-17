import { GlobalDataService } from 'src/app/core/services/global-data.service';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ChangePasswordService {

  constructor(private httpClient: HttpClient, private gd: GlobalDataService) { }
  changePassword(currentPass, newPass): Observable<any> {
    const udata = this.gd.currentUser.userData;
    const id = udata.subId;
    const requestBody = JSON.stringify({
      currentPassword: currentPass,
      newPassword: newPass
    });
    return this.httpClient.post<any>(
      '/auth-service/user/change-password', requestBody
    );
  }
}
