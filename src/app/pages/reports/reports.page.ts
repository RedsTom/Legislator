import {AsyncPipe} from '@angular/common';
import {Component, OnInit, signal} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterLink} from '@angular/router';
import {SharedModule} from 'primeng/api';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {Divider} from 'primeng/divider';
import {Paginator, PaginatorState} from 'primeng/paginator';
import {ProgressSpinner} from 'primeng/progressspinner';
import {BehaviorSubject, Observable, of, switchMap, tap} from 'rxjs';
import {ReportSummary, ReportSummaryList} from '../../models/reports.model';
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
    GroupByPipe,
    Divider
  ],
  templateUrl: './reports.page.html',
  styleUrl: './reports.page.scss'
})
export class ReportsPage implements OnInit {

  private pageSubject = new BehaviorSubject<number>(0);

  protected loading$ = signal(true);
  protected reports$: Observable<ReportSummaryList> = of();
  maxPage: number = 1;

  constructor(
    private reportsListService: ReportListService
  ) {
  }

  ngOnInit() {
    this.reports$ = this.pageSubject.pipe(
      tap(() => this.loading$.set(true)),
      switchMap(page => this.reportsListService.list(page + 1)),
      tap(reports => this.maxPage = reports.maxPage),
      tap(() => this.loading$.set(false)),
    )
  }

  groupByDate(report: ReportSummary): [string, ReportSummary] {
    return [report.date.toDateString(), report];
  }

  updatePage(event: PaginatorState) {
    this.pageSubject.next(event.page ?? 0);
  }
}
