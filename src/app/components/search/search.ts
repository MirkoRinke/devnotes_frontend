import { Component, ViewChild, ElementRef, AfterViewInit, Output, EventEmitter, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

import { filter } from 'rxjs/operators';

import { SvgIconsService } from '../../services/svg.icons.service';
import { SearchService } from '../../services/search.service';

import { TranslatePipe } from '../../i18n/translate-pipe';

@Component({
  selector: 'app-search',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements AfterViewInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  @Output() closeSearchEvent = new EventEmitter<void>();

  private readonly destroyRef = inject(DestroyRef);
  private lastBaseUrl: string = '';

  public hasTags: boolean = false;
  public hasText: boolean = false;

  constructor(
    public readonly svgIconsService: SvgIconsService,
    public readonly searchService: SearchService,
    private readonly router: Router,
  ) {}

  ngAfterViewInit(): void {
    this.manageSearchPersistence();
    this.searchValueInput();
  }

  /**
   * Manages the persistence of the search input across different routes. It listens to router events and resets the search input when the user navigates to a different base URL.
   * This ensures that the search state is cleared appropriately when the user navigates to a different section of the application.
   */
  private manageSearchPersistence(): void {
    this.lastBaseUrl = this.router.url.split('?')[0];

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef),
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
  private resetSearchInput(): void {
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
  public updateIndicators(value: string): void {
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
  public startSearch(value: string): void {
    this.searchService.searchValueInput(value);
  }

  /**
   * Subscribes to search value changes and update the input value.
   */
  private searchValueInput(): void {
    this.searchService.searchValue$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((inputValue) => {
      this.searchInput.nativeElement.value = inputValue ?? '';

      if (inputValue === null || inputValue.length === 0) {
        this.hasTags = false;
        this.hasText = false;
      } else {
        this.updateIndicators(inputValue);
      }
    });
  }

  /**
   * Emits an event to close the visibility of the search input. This method is typically called when the user clicks the close search button.
   */
  public closeSearch(): void {
    this.closeSearchEvent.emit();
  }
}
