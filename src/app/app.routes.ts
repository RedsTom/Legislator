import { Routes } from '@angular/router';
import {MainLayout} from './layouts/main/main.layout';
import {CalendarPage} from './pages/calendar/calendar.page';
import {HomePage} from './pages/home/home.page';
import {LivePage} from './pages/live/live.page';
import {MfpPage} from './pages/mfp/mfp.page';
import {ReportPage} from './pages/reports/entry/report.page';
import {ReportsPage} from './pages/reports/list/reports.page';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    title: 'Legislator',
    children: [
      {
        path: '',
        title: 'Legislator | Accueil',
        component: HomePage,
      },
      {
        path: 'live',
        title: 'Legislator | En direct',
        component: LivePage
      },
      {
        path: 'reports',
        title: 'Legislator | Rapports',
        component: ReportsPage
      },
      {
        path: 'reports/:date/:seanceId',
        title: 'Legislator | Rapport',
        component: ReportPage
      },
      {
        path: 'mfp',
        title: 'Legislator | Députés',
        component: MfpPage
      },
      {
        path: 'calendar',
        title: 'Calendrier',
        component: CalendarPage
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'home',
  }
];
