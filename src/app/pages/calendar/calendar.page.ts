import { Component } from '@angular/core';
import {SharedModule} from 'primeng/api';

@Component({
  selector: 'app-calendar',
  imports: [
    SharedModule
  ],
  templateUrl: './calendar.page.html',
  styleUrl: './calendar.page.scss'
})
export class CalendarPage {

}
