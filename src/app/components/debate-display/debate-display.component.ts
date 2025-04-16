import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MarkdownComponent} from 'ngx-markdown';
import { Debate, SpeakerRole } from '../../models/reports.model';

@Component({
  selector: 'app-debate-display',
  standalone: true,
  imports: [CommonModule, MarkdownComponent],
  templateUrl: './debate-display.component.html',
  styleUrls: ['./debate-display.component.scss']
})
export class DebateDisplayComponent {
  @Input() debate!: Debate;

  /**
   * Détermine la classe CSS en fonction du rôle de l'orateur
   */
  getSpeakerClass(role: number): string {
    return role === SpeakerRole.president ? 'president-speech' : 'regular-speech';
  }
}
