import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

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

  private destroy$ = new Subject<void>();

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

    this.getAvailableValues();
    this.getUserFavoriteTechStack();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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
