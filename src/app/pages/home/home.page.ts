import { Component } from '@angular/core';
import {NgxTeleportModule} from 'ngx-teleport';
import {SharedModule} from "primeng/api";

@Component({
  selector: 'app-home',
  imports: [
    SharedModule,
    NgxTeleportModule
  ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {

}
