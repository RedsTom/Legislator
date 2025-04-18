import {Component, Input} from '@angular/core';
import {Debate, SpeakerRole} from '../../models/reports.model';
import {SpeechDisplayComponent} from '../speech-display/speech-display.component';

@Component({
  selector: 'app-debate-display',
  templateUrl: './debate-display.component.html',
  imports: [
    SpeechDisplayComponent
  ],
  styleUrls: ['./debate-display.component.scss']
})
export class DebateDisplayComponent {
  @Input() debate!: Debate;

  getSpeakerClass(role: SpeakerRole | undefined): string {
    if(!role) role = SpeakerRole.none;

    return role === SpeakerRole.president ? 'president' : '';
  }

  /**
   * Vérifie si le débat est implicite (créé par le système)
   */
  isImplicitDebate(): boolean {
    return this.debate.node.metadata?.type === 'implicit';
  }
}
