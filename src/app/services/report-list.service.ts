import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as chrono from "chrono-node";
import {map, Observable} from 'rxjs';
import {ReportSummary, ReportSummaryList} from '../models/reports.model';

const parser = new DOMParser();

@Injectable({
  providedIn: 'root'
})
export class ReportListService {
  constructor(private http: HttpClient) {
  }

  public list(page: number): Observable<ReportSummaryList> {
    return this.http.get("@/dyn/17/comptes-rendus/seance", {
      params: {
        page: page,
        limit: 5
      },
      responseType: "text"
    }).pipe(
      map((reports) => this.processReports(reports, page))
    );
  }

  private processReports(reportsHtml: string, page: number): ReportSummaryList {
    const document = parser.parseFromString(reportsHtml, "text/html");

    const reports: ReportSummary[] = [];
    let pageButtons = document.querySelectorAll(".an-pagination .an-pagination--item:not(.next):not(.prev)");
    let maxPage = Number(pageButtons[pageButtons.length - 1]?.textContent ?? "10");
    console.log("Max Page", maxPage);

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

    return {
      page: page,
      maxPage: maxPage,
      reports: reports
    };
  }
}
