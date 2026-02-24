import { Component, ViewChild, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { SvgIconsService } from '../../services/svg.icons.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  imports: [CommonModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements OnDestroy, AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  private destroy$ = new Subject<void>();
  private lastBaseUrl: string = '';

  hasTags: boolean = false;
  hasText: boolean = false;

  constructor(
    public svgIconsService: SvgIconsService,
    public searchService: SearchService,
    private router: Router,
  ) {}

  ngAfterViewInit(): void {
    this.manageSearchPersistence();
    this.searchValueInput();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Manages the persistence of the search input across different routes. It listens to router events and resets the search input when the user navigates to a different base URL.
   * This ensures that the search state is cleared appropriately when the user navigates to a different section of the application.
   */
  manageSearchPersistence() {
    this.lastBaseUrl = this.router.url.split('?')[0];

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntil(this.destroy$),
      )
      .subscribe((event: NavigationEnd) => {
        const newBaseUrl = event.urlAfterRedirects.split('?')[0];

        if (this.lastBaseUrl !== newBaseUrl) {
          this.resetSearchInput();
          this.searchService.clear();
          this.searchService.enableSearch(false);
          this.lastBaseUrl = newBaseUrl;
        }
      });
  }

  /**
   * Resets the search input field and clears the search value in the SearchService.
   * This method is called when the user navigates to a different base URL, ensuring that the search state is cleared appropriately.
   */
  private resetSearchInput() {
    if (this.searchInput?.nativeElement) {
      this.searchInput.nativeElement.value = '';
      this.searchService.searchValueInput(null);
    }
  }

  /**
   * Handles the input event of the search field. It checks if the input value contains tags (indicated by the presence of '#') and updates the hasTags and hasText properties accordingly.
   *
   * @param value
   * @returns
   */
  updateIndicators(value: string): void {
    this.hasTags = value.includes('#');
    this.hasText =
      value
        .replace(/#[\w-]+/g, '')
        .replace(/#/g, '')
        .trim().length > 0;
  }

  /**
   * Starts the search process by updating the search value in the SearchService. This method is triggered when the user clicks the search button or presses the Enter key.
   *
   * @param value
   */
  startSearch(value: string): void {
    this.searchService.searchValueInput(value);
  }

  /**
   * Subscribes to search value changes and update the input value.
   */
  searchValueInput() {
    this.searchService.searchValue$.pipe(takeUntil(this.destroy$)).subscribe((inputValue) => {
      this.searchInput.nativeElement.value = inputValue ?? '';

      if (inputValue === null || inputValue.length === 0) {
        this.hasTags = false;
        this.hasText = false;
      } else {
        this.updateIndicators(inputValue);
      }
    });
  }
}
