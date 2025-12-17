import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router, NavigationEnd, NavigationStart } from '@angular/router';

import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

import { Search } from '../search/search';

import { SvgIconsService } from '../../services/svg.icons.service';
import { SearchService } from '../../services/search.service';
@Component({
  selector: 'app-page-navigation',
  imports: [CommonModule, RouterModule, Search],
  templateUrl: './page-navigation.html',
  styleUrl: './page-navigation.scss',
})
export class PageNavigation {
  context: string | null = null;
  activeMap: { [key: string]: boolean } = {};

  showSearch: boolean = false;
  delayedSearch: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public svgIconsService: SvgIconsService,
    public searchService: SearchService,
  ) {
    this.subscribeNavigationEnd();
  }

  ngOnInit() {
    this.subscribeNavigationStarted();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Update activeMap based on current context or URL
   */
  updateActiveMap() {
    const url = window.location.href;
    this.activeMap = {
      'my-area': this.context === 'my-area' || url.includes('/my-area'),
      favorites: this.context === 'favorites' || url.includes('/favorites'),
      network: this.context === 'network' || url.includes('/network'),
      community: this.context === 'community' || url.includes('/community'),
    };
  }

  /**
   * Subscribe to router navigation start events to clear search data and disable search
   */
  subscribeNavigationStarted() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.showSearch = false;
        this.searchService.clear();
      });
  }

  /**
   * Subscribe to route query params and router events to update context and active map
   */
  subscribeNavigationEnd() {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.context = params['context'] || null;
    });

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.updateActiveMap();
      });
  }

  /**
   * Check if a route fragment is active
   *
   * @param routeFragment
   * @returns
   */
  isActive(routeFragment: string): boolean {
    return this.activeMap[routeFragment] || false;
  }

  /**
   * Toggle search visibility
   *
   * @returns
   */
  toggleSearch() {
    if (!this.searchService.enableSearchValue) {
      return;
    }

    this.showSearch = !this.showSearch;

    if (this.showSearch) {
      this.searchService.showSearchResults();
      setTimeout(() => {
        this.delayedSearch = true;
      }, 250);
    } else {
      /**
       * When hiding the search, only clear the input value here. Full cleanup (searchService.clear()) is performed in the Search component's ngOnDestroy.
       */
      this.searchService.searchValueInput('');
      setTimeout(() => {
        this.delayedSearch = false;
      }, 500);
    }
  }
}
