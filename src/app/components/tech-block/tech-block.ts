import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil, debounceTime } from 'rxjs/operators';

import { TechTile } from '../tech-tile/tech-tile';

import type { AvailableValuesInterface } from '../../interfaces/available-values';

import { ApiEndpointEnums } from '../../enums/api-endpoint';

import { UserFavoriteTechnologiesService } from '../../services/user-favorite-technologies.service';
import { AvailableValuesService } from '../../services/available-values.service';
import { PageStepper } from '../page-stepper/page-stepper';

@Component({
  selector: 'app-tech-block',
  imports: [TechTile, PageStepper],
  templateUrl: './tech-block.html',
  styleUrl: './tech-block.scss',
})
export class TechBlock implements OnDestroy, OnInit {
  @Input() heading!: string;
  @Input() endPoint!: string;
  @Input() params!: Array<string>;
  @Input() context?: string;

  pageSize = 10;
  currentPage: number = 0;
  totalPages: number = 0;

  windowWidth: number = window.innerWidth || 1920;

  private destroy$ = new Subject<void>();
  private resize$ = new Subject<void>();

  constructor(
    private userFavoriteTechnologiesService: UserFavoriteTechnologiesService,
    private availableValuesService: AvailableValuesService,
  ) {}

  availableTiles: AvailableValuesInterface[] = [];
  filteredTiles: AvailableValuesInterface[] = [];
  favoriteTechStack: Array<string> = [];

  paginatedTiles: AvailableValuesInterface[] = [];

  ngOnInit() {
    if (!this.params || this.params.length === 0) {
      console.error(`URL input is required for TechBlock component ${this.heading}`);
      return;
    }

    if (!(this.endPoint in ApiEndpointEnums)) {
      console.error(`Invalid endPoint provided to TechBlock component ${this.heading}`);
      return;
    }

    this.setPageSize();
    this.initResizeSubscription();
    this.getAvailableValues();
    this.getUserFavoriteTechStack();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.resize$.complete();
  }

  /**
   * Handles window resize events.
   */
  @HostListener('window:resize')
  onResize() {
    this.resize$.next();
  }

  /**
   * Paginates the items based on the current page and page size.
   */
  private pagedItems() {
    this.setCurrentTiles();
    const start = this.currentPage * this.pageSize;
    const pagedItems = this.filteredTiles.slice(start, start + this.pageSize);
    this.paginatedTiles = pagedItems;
  }

  /**
   * Initializes the resize subscription to handle window resize events.
   */
  private initResizeSubscription() {
    this.resize$.pipe(debounceTime(200), takeUntil(this.destroy$)).subscribe(() => {
      this.windowWidth = window.innerWidth;
      this.setPageSize();
      this.pagedItems();
    });
  }

  /**
   * Sets the page size based on the current window width.
   */
  private setPageSize() {
    console.log(this.windowWidth);
    if (this.windowWidth >= 3440) {
      this.pageSize = 30;
    } else if (this.windowWidth >= 2560) {
      this.pageSize = 22;
    } else if (this.windowWidth >= 1920) {
      this.pageSize = 16;
    } else if (this.windowWidth >= 1280) {
      this.pageSize = 10;
    } else {
      this.pageSize = 6;
    }
  }

  /**
   * Sets the current tiles based on the heading.
   */
  private setCurrentTiles() {
    if (this.heading === 'Favoriten') {
      this.filteredTiles = this.availableTiles.filter((tile) => this.favoriteTechStack.includes(tile.name));
    } else {
      this.filteredTiles = this.availableTiles.filter((tile) => !this.favoriteTechStack.includes(tile.name));
    }
    this.updatePaginationState();
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
   * Handles page change events from the PageStepper component.
   *
   * @param newPage
   */
  onPageChange(newPage: number) {
    this.currentPage = newPage;
    this.pagedItems();
  }

  /**
   * Fetches available values from the service and sorts them before assigning to tiles.
   */
  private getAvailableValues() {
    this.availableValuesService
      .getAvailableValues(this.params, this.endPoint)
      .pipe(take(1))
      .subscribe((availableValues) => {
        this.availableTiles = this.sortAvailableValues(availableValues);
        this.pagedItems();
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
      this.pagedItems();
    });
    this.userFavoriteTechnologiesService.loadFavoriteTechStack();
  }
}
