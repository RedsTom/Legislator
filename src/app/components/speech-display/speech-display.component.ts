import {Component, Input} from '@angular/core';
import {MarkdownComponent} from 'ngx-markdown';
import {Speech} from "../../models/reports.model";
import {ResultDisplayComponent} from '../result-display/result-display.component';

@Component({
  selector: 'speech-display',
  imports: [
    MarkdownComponent,
    ResultDisplayComponent
  ],
  templateUrl: './speech-display.component.html',
  styleUrl: './speech-display.component.scss'
})
export class SpeechDisplayComponent {

  @Input() speech!: Speech;
}
