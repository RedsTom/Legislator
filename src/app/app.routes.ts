import { Routes } from '@angular/router';
import {MainLayout} from './layouts/main/main.layout';
import {CalendarPage} from './pages/calendar/calendar.page';
import {HomePage} from './pages/home/home.page';
import {LivePage} from './pages/live/live.page';
import {MfpPage} from './pages/mfp/mfp.page';
import {ReportsPage} from './pages/reports/reports.page';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      {
        path: '',
        title: 'Accueil',
        component: HomePage,
      },
      {
        path: 'live',
        title: 'En direct',
        component: LivePage
      },
      {
        path: 'reports',
        title: 'Rapports',
        component: ReportsPage
      },
      {
        path: 'mfp',
        title: 'Députés',
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
