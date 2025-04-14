import { Component } from '@angular/core';
import {SharedModule} from "primeng/api";

@Component({
  selector: 'app-home',
    imports: [
        SharedModule
    ],
  templateUrl: './home.page.html',
  styleUrl: './home.page.scss'
})
export class HomePage {

}
