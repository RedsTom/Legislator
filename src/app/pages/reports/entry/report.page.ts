import {NgClass, NgForOf, NgIf} from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {NgxTeleportModule} from 'ngx-teleport';
import {Button} from 'primeng/button';
import {DebateDisplayComponent} from '../../../components/debate-display/debate-display.component';
import { Debate, SpeakerRole } from '../../../models/reports.model';
import { ReportService } from '../../../services/report.service';

@Component({
  selector: 'app-report',
  templateUrl: './report.page.html',
  imports: [
    NgxTeleportModule,
    Button,
    NgClass,
    DebateDisplayComponent,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./report.page.scss']
})
export class ReportPage implements OnInit {
  protected date?: Date;
  protected seanceId?: string;
  protected section?: string;
  protected debate?: Debate;
  protected loading: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private reportService: ReportService
  ) {
    this.route.params.subscribe(params => {
      this.date = new Date(Date.parse(params["date"]));
      this.seanceId = params["seanceId"]
    });

    this.route.queryParams.subscribe(params => {
      this.section = params['section'];
    });
  }

  ngOnInit() {
    if (this.seanceId && this.section) {
      this.loadReport(this.seanceId, this.section);
    } else {
      console.error("Seance ID ou section manquante");
    }
  }

  loadReport(seanceId: string, order: string) {
    this.loading = true;
    this.reportService.getReport(seanceId, order).subscribe({
      next: (debate) => {
        this.debate = debate;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement du rapport', err);
        this.loading = false;
      }
    });
  }

  getSpeakerClass(role: SpeakerRole | undefined): string {
    if(!role) role = SpeakerRole.none;
    return role === SpeakerRole.president ? 'president' : '';
  }
}
