export interface ReportSummaryList {
  page: number;
  maxPage: number;

  reports: ReportSummary[];
}

export interface ReportSummary {
  title: string;
  pageLink: string;
  date: Date;
  temporary: boolean;
  orders: string[];
}

export enum SpeakerRole { none, president }

export interface Speaker {
  name: String;
  role: SpeakerRole;
  title?: string;
}

export interface Speech {
  speaker?: Speaker;
  text: string;
}

export interface Debate {
  name: string;
  speeches: Speech[];
  subDebates?: Debate[];
  level: number;
  parent?: Debate;
  order: string;
}
