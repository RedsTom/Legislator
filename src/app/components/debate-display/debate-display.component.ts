import {NgClass, NgForOf, NgIf} from '@angular/common';
import {Component, Input} from '@angular/core';
import {MarkdownComponent} from 'ngx-markdown';
import {Debate, SpeakerRole} from '../../models/reports.model';

@Component({
  selector: 'app-debate-display',
  templateUrl: './debate-display.component.html',
  imports: [
    NgClass,
    MarkdownComponent,
    NgIf,
    NgForOf
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
