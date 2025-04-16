import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {filter, map, Observable, of} from 'rxjs';
import {Debate} from '../models/reports.model';

const parser = new DOMParser();

@Injectable({
  providedIn: 'root'
})
export class ReportService {

  private reportCache: Map<string, Map<string, Debate>> = new Map();

  constructor(
    private http: HttpClient
  ) {
  }

  public getReport(seanceId: string, order: string): Observable<Debate | undefined> {
    if (this.reportCache.has(seanceId) && this.reportCache.get(seanceId)?.has(order)) {
      return of(this.reportCache.get(seanceId)?.get(order));
    }

    const report = this.http.get(`@/dyn/opendata/${seanceId}.xml`, {
      responseType: "text"
    }).pipe(
      map((xml) => this.processReport(xml))
    );

    report.subscribe((reports) => {
      this.reportCache.set(seanceId, reports);
    });

    return report.pipe(
      map((reports ) => Array.from(reports.entries())),
      map((reports) => reports
        .filter(([key,]) => key.includes(order) || order.includes(key))
      ),
      map((reports) => reports[0]),
      filter(a => a !== undefined),
      map(([_, debate]) => debate),
    );
  }

  private processReport(xml: string): Map<string, Debate> {
    const document = parser.parseFromString(xml, "text/xml");
    const debates: Map<string, Debate> = new Map();

    // Récupérer les différents débats
    // Les débats sont discriminés par le champ valeur_ptsodj


    return debates;
  }
}
