import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import * as chrono from "chrono-node";
import {map, Observable, of} from 'rxjs';
import {ReportSummary, ReportSummaryList} from '../models/reports.model';

const parser = new DOMParser();

@Injectable({
  providedIn: 'root'
})
export class ReportListService {
  private pageCache: Map<number, ReportSummaryList> = new Map();
  private seanceIdCache: Map<string, string> = new Map();

  constructor(private http: HttpClient) {
  }

  public list(page: number): Observable<ReportSummaryList> {
    if (this.pageCache.has(page)) {
      return of(this.pageCache.get(page)!);
    }

    const reportSummaryList = this.http.get("@/dyn/17/comptes-rendus/seance", {
      params: {
        page: page,
        limit: 5
      },
      responseType: "text"
    }).pipe(
      map((reports) => this.processReports(reports, page))
    );

    reportSummaryList.subscribe((reports) => {
      this.pageCache.set(page, reports);
    });

    return reportSummaryList;
  }

  private processReports(reportsHtml: string, page: number): ReportSummaryList {
    const document = parser.parseFromString(reportsHtml, "text/html");
    const base = document.createElement("base");
    base.href = "https://www.assemblee-nationale.fr/"

    document.head.appendChild(base)

    const reports: ReportSummary[] = [];
    let pageButtons = document.querySelectorAll(".an-pagination .an-pagination--item:not(.next):not(.prev)");
    let maxPage = Number(pageButtons[pageButtons.length - 1]?.textContent ?? "10");

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

  seanceId(seance: ReportSummary): Observable<string> {
    if (this.seanceIdCache.has(seance.pageLink)) {
      return of(this.seanceIdCache.get(seance.pageLink)!);
    }

    const seanceId = this.http.get(`~${seance.pageLink}`, {
      responseType: "text"
    }).pipe(
      map((html) => this.getXmlLink(html)),
      map(s => s.split("\/")),
      map((urlPieces) => urlPieces[urlPieces.length - 1]),
      map((xmlName) => xmlName.split(".")),
      map((xmlNamePieces) => xmlNamePieces.splice(0, xmlNamePieces.length - 1).join(".")),
    );

    seanceId.subscribe((id) => {
      this.seanceIdCache.set(seance.pageLink, id);
    });

    return seanceId;
  }

  getXmlLink(html: string): string {
    const document = parser.parseFromString(html, "text/html");
    const base = document.createElement("base");
    base.href = "https://www.assemblee-nationale.fr/"
    document.head.appendChild(base)

    const xmlLink = document.querySelector<HTMLAnchorElement>(
      "ul._vertical > li:has(i.an-icons-embed2) a"
    );

    if (xmlLink) {
      return xmlLink.href;
    } else {
      throw new Error("XML link not found");
    }
  }
}
