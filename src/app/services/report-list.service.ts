import {HttpClient} from '@angular/common/http';
import {Injectable, Signal} from '@angular/core';
import {toSignal} from '@angular/core/rxjs-interop';
import {map, Observable} from 'rxjs';
import {ReportSummary} from '../models/reports.model';
import * as chrono from "chrono-node";

const parser = new DOMParser();

@Injectable({
  providedIn: 'root'
})
export class ReportListService {
  constructor(private http: HttpClient) {
  }

  public list(page: number): Observable<ReportSummary[]> {
    return this.http.get("@/dyn/17/comptes-rendus/seance", {
      params: {
        page: page,
        limit: 10
      },
      responseType: "text"
    }).pipe(
      map((reports) => this.processReports(reports))
    );
  }

  private processReports(reportsHtml: string): ReportSummary[] {
    console.log(reportsHtml);
    const document = parser.parseFromString(reportsHtml, "text/html");

    const reports: ReportSummary[] = [];

    let days = document.querySelector("ul.crs-index-days");
    days?.querySelectorAll("& > li").forEach((day) => {
      let date = day.querySelector(".container > h2")?.textContent ?? "Inconnu";

      day.querySelectorAll("ul.ha-grid > div.ha-grid-item").forEach((seance) => {
        let titleElement = seance.querySelector<HTMLAnchorElement>("a.link.h5");

        let name = titleElement?.textContent?.trim() ?? "Inconnu";
        let url = titleElement?.href ?? "#";

        let temporary =
          seance.querySelector("span.crs-index-item-provisoire") != null;

        let orders: string[] = [];
        seance.querySelectorAll("ul.crs-index-item-summary > li > a").forEach((
          order,
        ) => {
          orders.push(order.textContent ?? "");
        });

        reports.push({
          title: name,
          pageLink: url,
          date: chrono.fr.parseDate(date, {}) ?? new Date(),
          temporary: temporary,
          orders: orders,
        });
      });
    });

    return reports;
  }
}
