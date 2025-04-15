import {Location} from '@angular/common';
import {Component} from '@angular/core';
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

  constructor(
    protected location: Location
  ) {
  }

}
