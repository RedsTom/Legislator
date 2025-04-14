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

enum SpeakerRole { none, president}

interface Speaker {
  name: String;
  id: number;
  role: SpeakerRole;
}

interface Speech {
  speaker?: Speaker;
  text: string;
}

interface Debate {
  topic: String;
  speeches: Speech[];
}
