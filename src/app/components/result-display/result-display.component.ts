import {Component, Input, OnInit} from '@angular/core';
import {$dt} from '@primeng/themes';
import {UIChart} from 'primeng/chart';
import {Message} from 'primeng/message';
import {TableModule} from 'primeng/table';

@Component({
  selector: 'result-display',
  imports: [
    TableModule,
    UIChart,
    Message
  ],
  templateUrl: './result-display.component.html',
  styleUrl: './result-display.component.scss'
})
export class ResultDisplayComponent implements OnInit {
  @Input({alias: "result"}) rawResult!: string;

  protected result = {
    'voting': 0,
    'expressed': 0,
    'for': 0,
    'against': 0,
  }

  protected titles = {
    'voting': 'Nombre de votants',
    'expressed': 'Nombre de suffrages exprimés',
    'for': 'Nombre de voix pour',
    'against': 'Nombre de voix contre'
  }

  ngOnInit() {
    const voting = this.getValue(this.rawResult, 'Nombre de votants');
    const expressed = this.getValue(this.rawResult, 'Nombre de suffrages exprimés');
    const against = this.getValue(this.rawResult, 'Contre');
    const forAdoption = this.getValue(this.rawResult, 'Pour l’adoption');

    this.result['voting'] = voting;
    this.result['expressed'] = expressed;
    this.result['for'] = forAdoption;
    this.result['against'] = against;
  }

  private getValue(text: string, key: string): number {
    const regex = new RegExp(`${key}.*?(\\d+)`);
    const match = text.match(regex);
    if (match && match[1]) {
      return parseInt(match[1], 10);
    }
    return 0;
  }

  get resultEntries() {
    return Object.entries(this.result);
  }

  get chartData() {
    return {
      labels: ['Pour', 'Non exprimés', 'Contre'],
      datasets: [
        {
          data: [this.result.for, this.result.voting - this.result.expressed, this.result.against],
          backgroundColor: [$dt('green.500').value, $dt('slate.500').value, $dt('red.500').value],
          hoverBackgroundColor: [$dt('green.700').value, $dt('slate.700').value, $dt('red.700').value]
        }
      ]
    }
  }

  get isAdopted() {
    return this.result.for > this.result.against;
  }
}
