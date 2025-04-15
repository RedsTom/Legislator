import {Component} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {NgxTeleportModule} from 'ngx-teleport';
import {SharedModule} from 'primeng/api';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet,
    Button,
    RouterLink,
    SharedModule,
    NgxTeleportModule
  ],
  templateUrl: './main.layout.html',
  styleUrl: './main.layout.scss'
})
export class MainLayout {
  protected tabs = [
    {
      index: 0,
      routerLink: '/',
      icon: 'pi pi-home',
      label: 'Accueil'
    },
    {
      index: 1,
      routerLink: '/live',
      icon: 'pi pi-desktop',
      label: 'En direct'
    },
    {
      index: 2,
      routerLink: '/calendar',
      icon: 'pi pi-calendar',
      label: 'Calendrier'
    },
    {
      index: 3,
      routerLink: '/reports',
      icon: 'pi pi-receipt',
      label: 'Rapports'
    },
    {
      index: 4,
      routerLink: '/mfp',
      icon: 'pi pi-user',
      label: 'Députés'
    }
  ];

  constructor(private router: Router) {
  }

  get sortedTabs() {
    const sortedTabs = [...this.tabs];
    sortedTabs.sort((a, b) => a.index - b.index)

    return sortedTabs;
  }

  protected isActiveRoute(path: string): boolean {
    if (path === "/" && this.router.url === "/") {
      return true;
    }

    if (path === "/" && this.router.url !== "/"
      || this.router.url === "/" && path !== "/") {
      return false;
    }

    return this.router.url.startsWith(path);
  }
}
