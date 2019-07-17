import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OverviewService } from './overview.service';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnChanges {
  data: any;
  // initData: {
  //   'totalUsersCount': 36, 'newUsersCount': 36, 'renewedUsersCount': 5, 'unsubscribedUsers': 0,
  //   'subAdminCount': 16, 'groupCount': 7, 'blockedCount': 1, 'freeTrailCount': 19
  // };
  growthBy: any;
  @Input() refreshData: boolean;
  constructor(
    private overViewService: OverviewService,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    // this.getInitData();
    // this.getGrowth();
  }
  ngOnChanges(change: SimpleChanges) {
    // this.getInitData();
    // this.getInitData();
  }
  getInitData() {
    const date = new Date();
    const firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    const lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);
    const revenueFromMonth = date.getMonth() - 1;
    const revenueFromYear = date.getFullYear();
    const revenueToMonth = date.getMonth();
    const revenueToYear = date.getFullYear();
    const params = {
      newusers: [{
        start: firstDay.toISOString(),
        end: lastDay.toISOString()
      }],
      renewedusers: [{
        start: firstDay.toISOString(),
        end: lastDay.toISOString()
      }],
      unsubscribedusers: [{
        start: firstDay.toISOString(),
        end: lastDay.toISOString()
      }],
      totalRevenue: [{
        revenueFromMonth: revenueFromMonth,
        revenueFromYear: revenueFromYear,
        revenueToMonth: revenueToMonth,
        revenueToYear: revenueToYear
      }],
    };
    this.overViewService.getInit(params).subscribe(res => {
      this.data = res;
    },
      (err: HttpErrorResponse) => {
        if (err instanceof HttpErrorResponse) {
          this.toastr.warning('Error in connection');
        }
      });
  }
  getGrowth() {
    const date = new Date();
    const thisMonth = date.getMonth() + 1;
    const thisYear = date.getFullYear();

    const params = {
      startYear: thisYear,
      startMonth: thisMonth - 1,
      endYear: thisYear,
      endMonth: thisMonth
    };
    this.overViewService.getGrowth(params).subscribe(res => {
      this.growthBy = res.response;
    },
      (err: HttpErrorResponse) => {
        if (err instanceof HttpErrorResponse) {
          this.toastr.warning('Error in connection');
        }
      });
  }
}
