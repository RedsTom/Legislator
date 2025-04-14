import {Component, OnInit} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {MenuItem, SharedModule} from 'primeng/api';
import {Button} from 'primeng/button';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    RouterOutlet,
    Button,
    RouterLink,
    SharedModule
  ],
  templateUrl: './main.layout.html',
  styleUrl: './main.layout.scss'
})
export class MainLayout implements OnInit {
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

  protected activeItem!: MenuItem;

  constructor(private router: Router) {
  }

  ngOnInit() {
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

    return path.startsWith(this.router.url);
  }
}
