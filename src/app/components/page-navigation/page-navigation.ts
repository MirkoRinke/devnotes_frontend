import { Component } from '@angular/core';
import { RouterModule, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-page-navigation',
  imports: [RouterModule],
  templateUrl: './page-navigation.html',
  styleUrl: './page-navigation.scss',
})
export class PageNavigation {
  context: string | null = null;
  activeMap: { [key: string]: boolean } = {};

  constructor(private route: ActivatedRoute) {
    this.route.queryParams.subscribe((params) => {
      this.context = params['context'] || null;
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
