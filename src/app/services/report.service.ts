import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {filter, map, Observable, of, tap} from 'rxjs';
import {Debate, Speaker, SpeakerRole, Speech} from '../models/reports.model';
import {parseText} from "../utils/xml.utils";

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

    let start: DOMHighResTimeStamp | undefined, end: DOMHighResTimeStamp | undefined;
    const report = this.http.get(`@/dyn/opendata/${seanceId}.xml`, {
        responseType: "text"
      }).pipe(
        tap(() => start = performance.now()),
        map((xml) => this.processReport(xml)),
        tap(() => end = performance.now()),
        tap(() => console.log(`Report processing time: ${(end ?? 0) - (start ?? 0)} ms`)),
      )
    ;

    report.subscribe((reports) => {
      this.reportCache.set(seanceId, reports);
    });

    return report.pipe(
      map((reports) => Array.from(reports.entries())),
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

    const sommaireNodes = document.querySelectorAll("sommaire > sommaire1");
    sommaireNodes.forEach((sommaire) => {
      const valeurPtsOdj: string = sommaire.getAttribute("valeur_pts_odj") || "0";
      const name = sommaire.querySelector("titreStruct > intitule")?.textContent?.trim() ?? "Inconnu";

      const mainDebate: Debate = {
        name: name,
        speeches: [],
        subDebates: [],
        level: 0,
        order: valeurPtsOdj
      };

      const points = document.querySelectorAll(`contenu > point[valeur_ptsodj="${valeurPtsOdj}"]`);

      points.forEach(point => {
        this.processPointsHierarchically(point, mainDebate);
      });

      debates.set(valeurPtsOdj, mainDebate);
    });

    return debates;
  }

  private processPointsHierarchically(pointElement: Element, parentDebate: Debate): void {
    const nivPoint = Number(pointElement.getAttribute("nivpoint") || "0");

    if (nivPoint > parentDebate.level + 1) {
      const properParent = this.findProperParent(parentDebate, nivPoint - 1);
      if (properParent) {
        this.processPoint(pointElement, properParent);
        return;
      }
    }

    this.processPoint(pointElement, parentDebate);
  }

  private findProperParent(debate: Debate, targetLevel: number): Debate | null {
    if (debate.level === targetLevel) {
      return debate;
    }

    if (debate.subDebates && debate.subDebates.length > 0) {
      for (let i = debate.subDebates.length - 1; i >= 0; i--) {
        const candidate = this.findProperParent(debate.subDebates[i], targetLevel);
        if (candidate) {
          return candidate;
        }
      }
    }

    return null;
  }

  private processPoint(pointElement: Element, parentDebate: Debate): void {
    const nivPoint = Number(pointElement.getAttribute("nivpoint") || "0");
    const valeurPtsOdj = pointElement.getAttribute("valeur_ptsodj") || "0";
    const name = pointElement.querySelector(":scope > texte")?.textContent?.trim() ?? "Sans titre";

    const debate: Debate = {
      name,
      speeches: this.extractSpeeches(pointElement),
      subDebates: [],
      level: nivPoint,
      order: valeurPtsOdj
    };

    parentDebate.subDebates?.push(debate);

    const subPoints = pointElement.querySelectorAll(":scope > point");
    subPoints.forEach(subPoint => {
      this.processPointsHierarchically(subPoint, debate);
    });
  }

  private extractSpeeches(element: Element): Speech[] {
    const speeches: Speech[] = [];

    // Récupérer tous les paragraphes, y compris ceux à l'intérieur des interExtractions
    const directParagraphs = element.querySelectorAll(":scope > paragraphe");
    const interExtractions = element.querySelectorAll(":scope > interExtraction");

    // Traiter les paragraphes directs
    this.processParagraphs(directParagraphs, speeches);

    // Traiter les paragraphes dans les interExtractions
    interExtractions.forEach(extraction => {
      const extractionParagraphs = extraction.querySelectorAll("paragraphe");
      this.processParagraphs(extractionParagraphs, speeches);
    });

    return speeches;
  }

  /**
   * Traite une collection de paragraphes et ajoute les discours extraits à la liste fournie
   */
  private processParagraphs(paragraphs: NodeListOf<Element>, speeches: Speech[]): void {
    paragraphs.forEach(para => {
      const orateurs = para.querySelector("orateurs");
      if (orateurs) {
        const orateur = orateurs.querySelector("orateur");
        if (orateur) {
          const speakerName = orateur.querySelector("nom")?.textContent || "Inconnu";
          const qualite = orateur.querySelector("qualite")?.textContent || "";

          let role = SpeakerRole.none;
          if (para.getAttribute("roledebat") === "president") {
            role = SpeakerRole.president;
          }

          const speaker: Speaker = {
            name: speakerName,
            role: role,
            title: qualite || undefined
          };

          const texte = para.querySelector("texte")?.getHTML() || "";

          if (texte.trim()) {
            speeches.push({
              speaker,
              text: parseText(texte.replace(/\s+/g, ' ').trim())
            });
          }
        }
      }
    });
  }
}
