import {Component, Input} from '@angular/core';
import {Speech} from "../../models/reports.model";

@Component({
  selector: 'app-speech-display',
  imports: [],
  templateUrl: './speech-display.component.html',
  styleUrl: './speech-display.component.scss'
})
export class SpeechDisplayComponent {

  @Input() speech!: Speech;
}
