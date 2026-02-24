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

  hasSearchValue: boolean = false;

  private lastBaseUrl: string = '';

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
    this.searchValueInput();
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
   * Subscribe to route query params and router events to update context and active map
   */
  subscribeNavigationEnd() {
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.context = params['context'] || null;
    });

    this.lastBaseUrl = this.router.url.split('?')[0];

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event: NavigationEnd) => {
        this.updateActiveMap();

        const newBaseUrl = event.urlAfterRedirects.split('?')[0];
        if (this.lastBaseUrl !== newBaseUrl) {
          this.showSearch = false;
          this.lastBaseUrl = newBaseUrl;
        }
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
      setTimeout(() => {
        this.delayedSearch = false;
      }, 500);
    }
  }

  /**
   * Subscribes to search value changes and filters tiles accordingly.
   */
  searchValueInput() {
    this.searchService.searchValue$.pipe(takeUntil(this.destroy$)).subscribe((inputValue) => {
      this.hasSearchValue = inputValue ? inputValue.trim().length > 0 : false;
    });
  }

  /**
   * Clears the search input and resets the search state in the SearchService. This method is typically called when the user clicks a "clear search" button.
   */
  clearSearch() {
    this.searchService.searchValueInput(null);
  }
}
