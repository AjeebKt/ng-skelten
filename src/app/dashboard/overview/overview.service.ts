import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OverviewService {

  constructor(
    private http: HttpClient
  ) { }
  getInit(p) {
    // console.log('');
    // const config = this.http.get<any>(`/suboperator-service/configuration`);
    const totalUsers = this.http.get<any>(`/patient-service/patient/totalusers`);
    const newUsers = this.http.get<any>(
      `/patient-service/patient/users-count?end=${p.newusers[0].end}&start=${p.newusers[0].start}`
    );
    const renewedUsers = this.http.get<any>(
      `/patient-service/patient/renewed-users-count?end=${p.renewedusers[0].end}&start=${p.renewedusers[0].start}`
    );
    const unsubscribedUsers = this.http.get<any>(
      `/patient-service/patient/unsubscibe-count?end=${p.unsubscribedusers[0].end}&start=${p.unsubscribedusers[0].start}`
    );
    const subAdminCount = this.http.get<any>(
      `/suboperator-service/sub-admin/totalcount`
    );
    const groupCount = this.http.get<any>(
      '/patient-service/group/totalgroup'
    );
    const blockedCount = this.http.get<any>(
      '/patient-service/patient/disbaled-users-count'
    );
    const freeTrailCount = this.http.get<any>(
      '/patient-service/patient/subscription-enabled-by-admin'
    );
    const sy = p.totalRevenue[0].revenueFromYear;
    const sm = p.totalRevenue[0].revenueFromMonth;
    const ey = p.totalRevenue[0].revenueToYear;
    const em = p.totalRevenue[0].revenueToMonth;
    const totalRevenue = this.http.get<any>(
      `/suboperator-service/sub-operator/revenue/${sy}/${sm}/to/${ey}/${em}`
    );
    return forkJoin([totalUsers, newUsers, renewedUsers, unsubscribedUsers,
      subAdminCount, groupCount, blockedCount, freeTrailCount, totalRevenue]).pipe(map((r) => {
        // console.log(r);
        const data = {
          totalUsersCount: r[0].response.count,
          newUsersCount: r[1].response.count,
          renewedUsersCount: r[2].response.count,
          unsubscribedUsers: r[3].response.count,
          subAdminCount: r[4].response.count,
          groupCount: r[5].response.count,
          blockedCount: r[6].response.count,
          freeTrailCount: r[7].response.count,
          totalRevenue: r[8].response.usd.allTimeRevenue,
        };
        return data;
      }));
  }
  getGrowth(params): Observable<any> {
    return this.http.get<any>(
      `/suboperator-service/sub-operator/growth/${params.startYear}/${params.startMonth}/to/${params.endYear}/${params.endMonth}`
    );
  }
}
