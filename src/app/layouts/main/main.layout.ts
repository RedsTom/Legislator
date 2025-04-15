import {Component, OnInit, TemplateRef, ViewChild, ViewContainerRef} from '@angular/core';
import {Router, RouterLink, RouterOutlet} from '@angular/router';
import {NgxTeleportModule} from 'ngx-teleport';
import {MenuItem, SharedModule} from 'primeng/api';
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

  @ViewChild('headerTeleport', { read: ViewContainerRef }) headerTeleport!: ViewContainerRef;
  private headerTemplate: TemplateRef<any> | undefined;

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

  onActivate(componentRef: any) {
    console.log("Activated component", componentRef);
    if(componentRef.header) {
      console.log("Header template found", componentRef.header);

      this.clearHeaderTeleport();
      this.headerTemplate = componentRef.header;
      this.attachHeaderTeleport();
    } else {
      console.log("No header template found");

      this.clearHeaderTeleport();
    }
  }

  private attachHeaderTeleport() {
    if(this.headerTeleport && this.headerTemplate) {
      this.headerTeleport.createEmbeddedView(this.headerTemplate);
    }
  }

  private clearHeaderTeleport() {
    if(this.headerTeleport) {
      this.headerTeleport.clear();
    }
  }

}
