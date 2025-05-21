import {Component, Input} from '@angular/core';
import {MarkdownComponent} from 'ngx-markdown';
import {Avatar} from 'primeng/avatar';
import {Tag} from 'primeng/tag';
import {Tooltip} from 'primeng/tooltip';
import {Speech} from "../../models/reports.model";
import {CapitalizePipe} from '../../pipes/capitalize.pipe';
import {ResultDisplayComponent} from '../result-display/result-display.component';

@Component({
  selector: 'speech-display',
  imports: [
    MarkdownComponent,
    ResultDisplayComponent,
    Avatar,
    Tag,
    Tooltip,
    CapitalizePipe
  ],
  templateUrl: './speech-display.component.html',
  styleUrl: './speech-display.component.scss'
})
export class SpeechDisplayComponent {

  @Input() speech!: Speech;

  get initials() {
    return this.speech.speaker.name
      .split(' ')
      .slice(1)
      .map(word => word.charAt(0).toUpperCase())
      .map(word => word.trim())
      .filter(a => !!a)
      .join('')
  }

  get paragraphs() {
    return this.speech.text
      .split("\n\n")
      .map(paragraph => paragraph.trim())
      .map(paragraph => paragraph.replace(/(?:^[\s\u00a0]+)|(?:[\s\u00a0]+$)/g, ''))
      .map(paragraph => paragraph.replace('&nbsp;', ''))
      .filter(paragraph => !!paragraph);
  }
}
