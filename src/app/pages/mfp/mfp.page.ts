import { Component } from '@angular/core';
import {NgxTeleportModule} from 'ngx-teleport';
import {SharedModule} from 'primeng/api';

@Component({
  selector: 'app-mfp',
  imports: [
    SharedModule,
    NgxTeleportModule
  ],
  templateUrl: './mfp.page.html',
  styleUrl: './mfp.page.scss'
})
export class MfpPage {

}
