import {AsyncPipe} from '@angular/common';
import {Component} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {SharedModule} from 'primeng/api';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {Paginator} from 'primeng/paginator';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Observable, of} from 'rxjs';
import {ReportSummary} from '../../models/reports.model';
import {GroupByPipe} from '../../pipes/group-by.pipe';
import {ReportListService} from '../../services/report-list.service';

@Component({
  selector: 'app-reports.page',
  imports: [
    SharedModule,
    Button,
    AsyncPipe,
    Paginator,
    FormsModule,
    ProgressSpinner,
    Card,
    RouterLink,
    GroupByPipe
  ],
  templateUrl: './reports.page.html',
  styleUrl: './reports.page.scss'
})
export class ReportsPage {

  protected reports$: Observable<ReportSummary[]> = of();
  protected page = 0;

  constructor(
    private reportsListService: ReportListService
  ) {
  }

  ngOnInit() {
    this.reports$ = this.reportsListService.list(this.page + 1)
  }

  toJson(obj: any): string {
    return JSON.stringify(obj, null, 2);
  }

  groupByDate(report: ReportSummary): [string, ReportSummary] {
    return [report.date.toDateString(), report];
  }
}
