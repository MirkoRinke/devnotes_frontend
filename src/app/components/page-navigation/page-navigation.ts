import { Component, inject, DestroyRef, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { SvgIconsService } from '../../services/svg.icons.service';
import { SearchService } from '../../services/search.service';

import { TranslatePipe } from '../../i18n/translate-pipe';

import { PageContextEnums } from '../../enums/context';

import { SearchButton } from './search-button/search-button';
import { Search } from '../search/search';
@Component({
  selector: 'app-page-navigation',
  imports: [CommonModule, RouterModule, Search, SearchButton, TranslatePipe],
  templateUrl: './page-navigation.html',
  styleUrl: './page-navigation.scss',
})
export class PageNavigation {
  private context: PageContextEnums | null = null;
  @Input() enableSearch: boolean = false;

  readonly navigationLinks = [
    { label: 'myArea', path: '/my-area', icon: 'my_area', context: PageContextEnums.MY_AREA },
    { label: 'favorites', path: '/favorites', icon: 'favorites', context: PageContextEnums.FAVORITES },
    { label: 'network', path: '/network', icon: 'network', context: PageContextEnums.NETWORK },
    { label: 'community', path: '/community', icon: 'community', context: PageContextEnums.COMMUNITY },
  ];

  readonly searchButtonIndex = this.navigationLinks.length / 2 - 1;

  public activeMap: { [key in PageContextEnums]?: boolean } = {};

  public showSearch: boolean = false;
  public delayedSearch: boolean = false;

  private lastBaseUrl: string = '';

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    public readonly svgIconsService: SvgIconsService,
    public readonly searchService: SearchService,
  ) {
    this.subscribeNavigationEnd();
  }

  /**
   * Subscribe to route query params and router events to update context and active map
   */
  private subscribeNavigationEnd(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      this.context = params['context'] || null;
    });

    this.lastBaseUrl = this.router.url.split('?')[0];

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
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
   * Update activeMap based on current context or URL
   */
  private updateActiveMap(): void {
    const url = this.router.url;

    this.navigationLinks.forEach((link) => {
      this.activeMap[link.context] = this.context === link.context || url.includes(link.path);
    });
  }

  /**
   * Toggle search visibility
   */
  public toggleSearch(): void {
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
}
