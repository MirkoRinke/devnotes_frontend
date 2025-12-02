import { Component } from '@angular/core';
import { RouterModule, ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-page-navigation',
  imports: [RouterModule],
  templateUrl: './page-navigation.html',
  styleUrl: './page-navigation.scss',
})
export class PageNavigation {
  context: string | null = null;
  activeMap: { [key: string]: boolean } = {};

  constructor(private route: ActivatedRoute, private router: Router) {
    this.route.queryParams.subscribe((params) => {
      this.context = params['context'] || null;
    });

    this.router.events.pipe(filter((event) => event instanceof NavigationEnd)).subscribe(() => {
      this.updateActiveMap();
    });
  }

  updateActiveMap() {
    const url = window.location.href;
    this.activeMap = {
      'my-area': this.context === 'my-area' || url.includes('/my-area'),
      favorites: this.context === 'favorites' || url.includes('/favorites'),
      network: this.context === 'network' || url.includes('/network'),
      community: this.context === 'community' || url.includes('/community'),
    };
  }

  isActive(routeFragment: string): boolean {
    return this.activeMap[routeFragment] || false;
  }
}
