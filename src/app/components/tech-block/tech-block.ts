import { Component, Input, OnInit, OnDestroy, HostListener, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil, debounceTime } from 'rxjs/operators';

import { TechTile } from '../tech-tile/tech-tile';
import { PageStepper } from '../page-stepper/page-stepper';

import type { AvailableValuesInterface } from '../../interfaces/available-values';

import { ApiEndpointEnums } from '../../enums/api-endpoint';
import { PageContextEnums } from '../../enums/context';

import { UserFavoriteTechnologiesService } from '../../services/user-favorite-technologies.service';
import { SvgIconsService } from '../../services/svg.icons.service';
import { AvailableValuesService } from '../../services/available-values.service';
import { SearchService } from '../../services/search.service';

import { getCssVariableValue, getElementSizeFrom } from '../../utils/css-helper';
import { blurActiveElementInside } from '../../utils/dom-helper';

@Component({
  selector: 'app-tech-block',
  imports: [TechTile, PageStepper],
  templateUrl: './tech-block.html',
  styleUrl: './tech-block.scss',
})
export class TechBlock implements OnDestroy, OnInit {
  @Input() context: PageContextEnums | null = null;
  @Input() endPoint: keyof typeof ApiEndpointEnums | null = null;
  @Input() params: Array<string> | null = null;

  @Input() heading: string | null = null;
  @Input() version: 'default' | 'favorites' | 'search-results' = 'default';

  isLoading = true;

  pageSize = 10;
  currentPage: number = 0;
  totalPages: number = 0;

  private destroy$ = new Subject<void>();
  private resize$ = new Subject<void>();

  availableTiles: AvailableValuesInterface[] = [];
  filteredTiles: AvailableValuesInterface[] = [];
  favoriteTechStack: Array<string> = [];
  favoriteUpdateStack: Array<string> = [];

  currentSearchValue: string | null = null;

  refreshFeedbackAnimation: boolean = false;

  paginatedTiles: AvailableValuesInterface[] = [];
  containerSize: ElementRef | null = null;
  private initialLoad = true;

  constructor(
    public userFavoriteTechnologiesService: UserFavoriteTechnologiesService,
    public svgIconsService: SvgIconsService,
    private availableValuesService: AvailableValuesService,
    private searchService: SearchService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    if (!this.params || this.params.length === 0 || !this.endPoint || !(this.endPoint in ApiEndpointEnums)) {
      console.error(`URL input and valid Endpoint are required for TechBlock component ${this.heading || ''}`);
      return;
    }
    this.initResizeSubscription();
    this.getAvailableValues(this.params, this.endPoint);

    this.getUserFavoriteTechStack();
    this.getUserFavoriteUpdate();

    this.searchValueInput();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.resize$.complete();

    if (this.version === 'search-results') {
      this.searchService.clear();
    }
  }

  /**
   * Subscribes to search value changes and filters tiles accordingly.
   */
  searchValueInput() {
    this.searchService.searchValue$.pipe(takeUntil(this.destroy$)).subscribe((inputValue) => {
      this.currentSearchValue = inputValue;
      this.filterFunction(inputValue || '');
    });
  }

  /**
   * Handles window resize events.
   */
  @HostListener('window:resize')
  onResize() {
    this.resize$.next();
  }

  /**
   * Refreshes the pagination by updating the pagination state and paginating the items.
   */
  private refreshPagination() {
    this.updatePaginationState();
    this.pagedItems();
  }

  /**
   * Updates the pagination state based on the filtered tiles.
   */
  private updatePaginationState() {
    this.totalPages = Math.max(1, Math.ceil(this.filteredTiles.length / this.pageSize));

    if (this.currentPage > this.totalPages - 1) {
      this.currentPage = 0;
    }
  }

  /**
   * Paginates the items based on the current page and page size.
   */
  private pagedItems() {
    const start = this.currentPage * this.pageSize;
    const pagedItems = this.filteredTiles.slice(start, start + this.pageSize);
    this.paginatedTiles = pagedItems;
  }

  /**
   * Initializes the resize subscription to handle window resize events.
   */
  private initResizeSubscription() {
    this.resize$.pipe(debounceTime(200), takeUntil(this.destroy$)).subscribe(() => {
      this.tilesPerPage();
    });
  }

  /**
   * Sets the reference to the container element and calculates the page size based on its width.
   *
   * @param element
   */
  @ViewChild('tilesContainer') set tilesContainerRef(element: ElementRef) {
    if (element) {
      this.containerSize = element;
      requestAnimationFrame(() => {
        this.resize$.next();
      });
    }
  }

  /**
   * Calculates the number of tiles that can fit on a page based on the container width, tile size, and gap.
   */
  private tilesPerPage() {
    if (!this.containerSize?.nativeElement) return;
    const container = this.containerSize.nativeElement;
    const containerWidth = getElementSizeFrom(container, 'width');
    if (containerWidth === 0) return;

    /**
     * Get the tile size and gap from CSS variables.
     * This allows the page size to dynamically adjust based on the actual rendered size of the tiles and gaps, which is crucial for responsive design.
     */
    const style = getComputedStyle(container);
    const tileSize = getCssVariableValue(style, '--tile-width');
    const gap = getCssVariableValue(style, '--column-gap');

    const tilesPerRow = Math.max(1, Math.floor((containerWidth + gap) / (tileSize + gap)));
    const rowsPerPage = 2;

    /**
     * snap PageSize is the value of perPage before the resize.
     */
    const snapPageSize = this.pageSize;

    this.pageSize = tilesPerRow * rowsPerPage;

    if (snapPageSize !== this.pageSize || this.initialLoad) {
      this.refreshPagination();
      this.initialLoad = false;
      this.cdr.detectChanges();
    }

    if (snapPageSize !== this.pageSize) {
      blurActiveElementInside(container);
    }
  }

  /**
   * Sets the current tiles based on the heading.
   */
  private setCurrentTiles() {
    if (this.version === 'favorites') {
      this.filteredTiles = this.availableTiles.filter((tile) => this.favoriteTechStack.includes(tile.name) || this.favoriteUpdateStack.includes(tile.name));
    } else if (this.version === 'search-results') {
      this.filteredTiles = this.availableTiles;
    } else {
      this.filteredTiles = this.availableTiles.filter((tile) => !this.favoriteTechStack.includes(tile.name) || this.favoriteUpdateStack.includes(tile.name));
    }
  }

  /**
   * Filters the tiles based on user input.
   *
   * @param inputValue
   */
  filterFunction(inputValue: string) {
    const input = (inputValue || '').toLowerCase().trim();
    if (input.length > 0) {
      this.setCurrentTiles();
      this.filteredTiles = this.filteredTiles.filter((tile) => tile.name.toLowerCase().startsWith(input));
      this.refreshPagination();
    } else {
      this.setCurrentTiles();
      this.refreshPagination();
    }
  }

  /**
   * Handles page change events from the PageStepper component.
   *
   * @param newPage
   */
  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.refreshPagination();
  }

  /**
   * Fetches available values from the service and sorts them before assigning to tiles.
   * Also handles loading state and search results state.
   */
  private getAvailableValues(params: Array<string>, endPoint: string) {
    this.availableValuesService
      .getAvailableValues(params, endPoint)
      .pipe(take(1))
      .subscribe((availableValues) => {
        this.availableTiles = this.sortAvailableValues(availableValues);
        this.setCurrentTiles();
        this.refreshPagination();
        if (this.version === 'search-results') {
          this.searchService.dataLoaded(true);
        }
        this.isLoading = false;
      });
  }

  /**
   * Sorts available values by total_counts descending and then by name ascending.
   *
   * @param availableValues
   * @returns
   */
  private sortAvailableValues(availableValues: AvailableValuesInterface[]): AvailableValuesInterface[] {
    return availableValues.sort((a, b) => {
      if (b.total_counts !== a.total_counts) {
        return b.total_counts - a.total_counts;
      }
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Fetches the user's favorite tech stack from the service.
   */
  private getUserFavoriteTechStack() {
    this.userFavoriteTechnologiesService.favoriteTechStack$.pipe(takeUntil(this.destroy$)).subscribe((stack) => {
      this.favoriteTechStack = stack;
      if (this.currentSearchValue === null || this.currentSearchValue.trim() === '') {
        this.setCurrentTiles();
        this.refreshPagination();
      }
    });
    this.userFavoriteTechnologiesService.loadFavoriteTechStack();
  }

  /**
   * Fetches the user's update stack from the service.
   * This stack is used to immediately reflect changes in the UI when a user adds or removes a technology from their favorites.
   * The actual update to the backend is handled in the TechTile component, so this function only listens for changes and updates the local state accordingly.
   */
  private getUserFavoriteUpdate() {
    this.userFavoriteTechnologiesService.favoriteUpdate$.pipe(takeUntil(this.destroy$)).subscribe((stack) => {
      this.favoriteUpdateStack = stack;
      if (this.currentSearchValue === null || this.currentSearchValue.trim() === '') {
        this.setCurrentTiles();
        this.refreshPagination();
      }
    });
  }

  /**
   * Clears the favorite update stack and triggers the refresh animation for visual feedback.
   */
  public clearFavoriteUpdate() {
    this.userFavoriteTechnologiesService.clearFavoriteUpdate();
    this.refreshFeedbackAnimation = true;
  }

  /**
   * Handle animation end events
   *
   * @param event
   */
  onAnimationEnd(event: AnimationEvent) {
    if (event.animationName.endsWith('rotate')) {
      this.refreshFeedbackAnimation = false;
    }
  }
}
