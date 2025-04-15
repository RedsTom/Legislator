import { Component } from '@angular/core';
import {NgxTeleportModule} from 'ngx-teleport';
import {DrawerModule} from 'primeng/drawer';

@Component({
  selector: 'app-live',
  imports: [
    DrawerModule,
    NgxTeleportModule
  ],
  templateUrl: './live.page.html',
  styleUrl: './live.page.scss'
})
export class LivePage {

}
