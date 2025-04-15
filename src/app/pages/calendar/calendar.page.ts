import { Component } from '@angular/core';
import {NgxTeleportModule} from 'ngx-teleport';
import {SharedModule} from 'primeng/api';

@Component({
  selector: 'app-calendar',
  imports: [
    SharedModule,
    NgxTeleportModule
  ],
  templateUrl: './calendar.page.html',
  styleUrl: './calendar.page.scss'
})
export class CalendarPage {

}
