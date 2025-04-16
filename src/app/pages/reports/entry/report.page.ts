import {Location} from '@angular/common';
import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgxTeleportModule} from 'ngx-teleport';
import {Button} from 'primeng/button';
import {Debate} from '../../../models/reports.model';
import {ReportService} from '../../../services/report.service';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-entry',
  standalone: true,
  imports: [
    NgxTeleportModule,
    Button,
    CommonModule
  ],
  templateUrl: './report.page.html',
  styleUrl: './report.page.scss'
})
export class ReportPage implements OnInit {

  protected date?: Date;
  protected seanceId?: string;
  protected section?: string;
  protected debate?: Debate;
  protected loading: boolean = false;

  constructor(
    protected location: Location,
    protected route: ActivatedRoute,
    private reportService: ReportService,
  ) {
    this.route.params.subscribe(params => {
      this.date = new Date(Date.parse(params["date"]));
      this.seanceId = params["seanceId"]
    });

    this.route.queryParams.subscribe(params => {
      this.section = params['section'];
    });
  }

  ngOnInit(): void {
    if (this.seanceId && this.section) {
      this.loading = true;
      this.reportService.getReport(this.seanceId, this.section).subscribe({
        next: (report: Debate | undefined) => {
          this.debate = report;
          console.log('Rapport chargé:', this.debate);
          this.loading = false;
        },
        error: (err) => {
          console.error('Erreur lors du chargement du rapport:', err);
          this.loading = false;
        }
      });
    }
  }

  /**
   * Détermine la classe CSS en fonction du rôle de l'orateur
   */
  getSpeakerClass(role: number): string {
    return role === 1 ? 'president-speech' : 'regular-speech';
  }
}
