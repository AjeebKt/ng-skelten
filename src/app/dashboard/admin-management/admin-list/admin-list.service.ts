import { ResponseMessage, ResponseWithDataMessage } from '../../../model/response';
import { Injectable } from '@angular/core';
import { GlobalDataService } from '../../../core/services/global-data.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Admin } from '../../model/admin';
@Injectable({
  providedIn: 'root'
})
export class AdminListService {

  constructor(private httpClient: HttpClient, private globalDataService: GlobalDataService) { }
  getListOfAdmins(page): Observable<any> {
    return this.httpClient.get<any>(
      `/suboperator-service/sub-admin?page=${page}&size=10`
    );
  }

  // http://202.88.246.152:8762/suboperator-service/sub-admin?page=0&size=4&subAdminNameQuery=ddd
  searchAdminNameQuery(name, page): Observable<any> {
    return this.httpClient.get<any>(
      `/suboperator-service/sub-admin?subAdminNameQuery=${name}&page=${page}&size=10`
    );
  }
  adminBlock(id): Observable<any> {
    return this.httpClient.put<any>(`/suboperator-service/sub-operator/${id}/block`, {});
  }
  adminUnBlock(id): Observable<any> {
    return this.httpClient.put<any>(`/suboperator-service/sub-operator/${id}/unblock`, {});
  }

  adminDelete(adminIDToDelete): Observable<any> {
    return this.httpClient.delete<any>(`/suboperator-service/sub-operator?subOperatorId=${adminIDToDelete}`, {});
  }
  // adminDelete(adminIDToDelete): Observable<ResponseWithDataMessage> {
  //   return this.httpClient.delete<ResponseWithDataMessage>(
  //     '/sub-admin?adminId=' + adminIDToDelete
  //   );
  // }
}

