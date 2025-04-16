import {AsyncPipe} from '@angular/common';
import {AfterContentInit, Component, signal, TemplateRef, ViewChild} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import dayjs from 'dayjs';
import {NgxTeleportModule} from 'ngx-teleport';
import {SharedModule} from 'primeng/api';
import {Button} from 'primeng/button';
import {Card} from 'primeng/card';
import {Divider} from 'primeng/divider';
import {Paginator, PaginatorState} from 'primeng/paginator';
import {ProgressSpinner} from 'primeng/progressspinner';
import {Timeline} from 'primeng/timeline';
import {BehaviorSubject, lastValueFrom, Observable, of, switchMap, tap} from 'rxjs';
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
export class ReportsPage implements AfterContentInit {
  @ViewChild('header') public header: TemplateRef<any> | undefined;

  private pageSubject = new BehaviorSubject<number>(0);

  protected loading$ = signal(true);
  protected reports$: Observable<ReportSummaryList> = of();
  protected maxPage: number = 1;

  private loadingButtons: Map<string, boolean> = new Map();

  constructor(
    private reportsListService: ReportListService,
    private router: Router
  ) {
  }

  ngAfterContentInit() {
    this.reports$ = this.pageSubject.pipe(
      tap(() => this.loading$.set(true)),
      switchMap(page => this.reportsListService.list(page + 1)),
      tap(reports => this.maxPage = reports.maxPage),
      tap(() => this.loading$.set(false)),
    )
  }

  groupByDate(report: ReportSummary): [string, ReportSummary] {
    return [report.date.toString(), report];
  }

  updatePage(event: PaginatorState) {
    this.pageSubject.next(event.page ?? 0);
  }

  formatReadableDate(datetime: Date) {
    let date = dayjs(datetime).locale('fr').format('dddd D MMMM YYYY');
    return date[0].toUpperCase() + date.slice(1);
  }

  formatUrlDate(datetime: Date) {
    return dayjs(datetime).format('YYYY-MM-DD');
  }

  getSeanceId(seance: ReportSummary): Observable<string> {
    return this.reportsListService.seanceId(seance);
  }

  async navigateToReport(report: ReportSummary, order: string) {
    this.loadingButtons.set(report.pageLink + "$" + order, true);
    const seanceId = await lastValueFrom(this.getSeanceId(report));
    this.loadingButtons.set(report.pageLink + "$" + order, false);
    await this.router.navigate(['/reports', this.formatUrlDate(report.date), seanceId], {
      queryParams: {
        section: order,
      }
    })
  }

  isLoading(report: ReportSummary, order: any) {
    return !!this.loadingButtons.get(report.pageLink + "$" + order);
  }
}
