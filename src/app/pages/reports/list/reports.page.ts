import {AsyncPipe} from '@angular/common';
import {Component, OnInit, signal, TemplateRef, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import dayjs from 'dayjs';
import {NgxTeleportModule} from 'ngx-teleport';
import {SharedModule} from 'primeng/api';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {Divider} from 'primeng/divider';
import {Paginator, PaginatorState} from 'primeng/paginator';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Timeline} from 'primeng/timeline';
import {BehaviorSubject, Observable, of, switchMap, tap} from 'rxjs';
import {ReportSummary, ReportSummaryList} from '../../../models/reports.model';
import {GroupByPipe} from '../../../pipes/group-by.pipe';
import {ReportListService} from '../../../services/report-list.service';
import 'dayjs/locale/fr.js';

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
    GroupByPipe,
    Divider,
    Timeline,
    NgxTeleportModule,
  ],
  templateUrl: './reports.page.html',
  styleUrl: './reports.page.scss'
})
export class ReportsPage implements OnInit {
  @ViewChild('header') public header: TemplateRef<any> | undefined;

  private pageSubject = new BehaviorSubject<number>(0);

  protected loading$ = signal(true);
  protected reports$: Observable<ReportSummaryList> = of();
  protected maxPage: number = 1;

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
    let date = dayjs(report.date).locale('fr').format('dddd D MMMM YYYY');
    date = date[0].toUpperCase() + date.slice(1);

    return [date, report];
  }

  updatePage(event: PaginatorState) {
    this.pageSubject.next(event.page ?? 0);
  }
}
