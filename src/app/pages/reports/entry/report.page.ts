import {Location} from '@angular/common';
import {Component} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NgxTeleportModule} from 'ngx-teleport';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-entry',
  imports: [
    NgxTeleportModule,
    Button
  ],
  templateUrl: './report.page.html',
  styleUrl: './report.page.scss'
})
export class ReportPage {

  protected date?: Date;
  protected seanceId?: string;
  protected section?: string;

  constructor(
    protected location: Location,
    protected route: ActivatedRoute
  ) {
    this.route.params.subscribe(params => {
      this.date = new Date(Date.parse(params["date"]));
      this.seanceId = params["seanceId"]
    });

    this.route.queryParams.subscribe(params => {
      this.section = params['section'];
    });
  }

}
