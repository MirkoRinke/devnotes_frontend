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

  private debounceTimer?: number;

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
    if (this.debounceTimer) {
      clearTimeout(this.debounceTimer);
    }
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
      this.searchService.searchValueInput('');
    }
  }

  /**
   * Handles the input event from the search field. It implements a debounce mechanism to delay the search action until the user has stopped
   * typing for a specified duration (1 second in this case). If the input value is empty, it immediately clears the search value in the SearchService.
   *
   * @param value
   * @returns
   */
  onInput(value: string): void {
    clearTimeout(this.debounceTimer);

    if (value.length === 0) {
      this.searchService.searchValueInput(null);
      return;
    }

    this.debounceTimer = window.setTimeout(() => {
      this.searchService.searchValueInput(value);
    }, 1000);
  }

  /**
   * Handles the keydown event for the search input field. If the user presses the Enter key, it immediately triggers the search action without waiting for the debounce timer.
   *
   * @param value
   */
  onEnter(value: string): void {
    clearTimeout(this.debounceTimer);
    this.searchService.searchValueInput(value);
  }

  /**
   * Subscribes to search value changes and update the input value.
   */
  searchValueInput() {
    this.searchService.searchValue$.pipe(takeUntil(this.destroy$)).subscribe((inputValue) => {
      this.searchInput.nativeElement.value = inputValue ?? '';
    });
  }
}
