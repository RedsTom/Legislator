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
  id: number;
  role: SpeakerRole;
}

export interface Speech {
  speaker?: Speaker;
  text: string;
}

export interface Debate {
  topic: String;
  speeches: Speech[];
}
