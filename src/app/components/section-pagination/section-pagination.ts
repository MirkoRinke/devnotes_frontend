import { Component, Input, ElementRef, ViewChild, HostListener, inject, DestroyRef, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { NgTemplateOutlet } from '@angular/common';

import type { PaginationInfoInterface } from '../../interfaces/pagination-info';

import { SvgIconsService } from '../../services/svg.icons.service';

import { TranslatePipe } from '../../i18n/translate-pipe';

import { getCssVariableValue } from '../../utils/css-helper';

import type { NavigationLinksInterface } from '../../interfaces/navigation-links';

@Component({
  selector: 'app-section-pagination',
  imports: [TranslatePipe, RouterLink, NgTemplateOutlet],
  templateUrl: './section-pagination.html',
  styleUrl: './section-pagination.scss',
})
export class SectionPagination<T> implements OnInit {
  @Input() paginationInfo: PaginationInfoInterface<T> | null = null;

  private readonly destroyRef = inject(DestroyRef);
  private readonly resize$ = new Subject<void>();

  private paginationContainer: ElementRef | null = null;
  private maxPages: number = 5;

  public readonly leftNavigationLinks: NavigationLinksInterface[] = [
    { label: 'firstPage', path: '.', icon: 'first_page' },
    { label: 'previousPage', path: '.', icon: 'previous_page' },
  ];

  public readonly rightNavigationLinks: NavigationLinksInterface[] = [
    { label: 'nextPage', path: '.', icon: 'next_page' },
    { label: 'lastPage', path: '.', icon: 'last_page' },
  ];

  public readonly mobileNavigationLinks: NavigationLinksInterface[] = [];

  constructor(public readonly svgIconsService: SvgIconsService) {
    this.mobileNavigationLinks = this.leftNavigationLinks.concat(this.rightNavigationLinks);
  }

  ngOnInit(): void {
    this.initResizeSubscription();
  }

  /**
   * Returns the query parameters for the given pagination link label.
   *
   * @param label The label of the pagination link (e.g., 'firstPage', 'previousPage', 'nextPage', 'lastPage').
   * @returns An object containing the query parameters for the specified pagination link.
   */
  public params(label: string): Record<string, number> {
    if (!this.paginationInfo) return {};

    const paramsMap: Record<string, Record<string, number>> = {
      firstPage: { page: 1 },
      previousPage: { page: this.paginationInfo.current_page - 1 },
      nextPage: { page: this.paginationInfo.current_page + 1 },
      lastPage: { page: this.paginationInfo.last_page },
    };

    return paramsMap[label] || {};
  }

  /**
   * Checks if a pagination link should be disabled based on the current pagination state.
   *
   * @param label The label of the pagination link (e.g., 'firstPage', 'previousPage', 'nextPage', 'lastPage').
   * @returns True if the link should be disabled, false otherwise.
   */
  public isLinkDisabled(label: string): boolean {
    if (!this.paginationInfo) return false;

    switch (label) {
      case 'firstPage':
      case 'previousPage':
        return this.paginationInfo.current_page === 1;
      case 'nextPage':
      case 'lastPage':
        return this.paginationInfo.current_page === this.paginationInfo.last_page;
      default:
        return false;
    }
  }

  /**
   * Sets the reference to the container element and initializes the resize observer to update the maximum number of pages dynamically.
   *
   * @param element
   */
  @ViewChild('paginationContainer') public set paginationContainerRef(element: ElementRef) {
    if (element && element !== this.paginationContainer) {
      this.paginationContainer = element;
      requestAnimationFrame(() => {
        this.updateMaxPages();
      });
    }
  }

  /**
   * Handles window resize events.
   */
  @HostListener('window:resize')
  public onResize(): void {
    this.resize$.next();
  }

  /**
   * Initializes the resize subscription to handle window resize events.
   */
  private initResizeSubscription(): void {
    this.resize$.pipe(debounceTime(200), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.updateMaxPages();
    });
  }

  /**
   * Updates the maximum number of pages based on the container's CSS variable.
   *
   * @returns
   */
  private updateMaxPages(): void {
    if (!this.paginationContainer) return;
    const style = getComputedStyle(this.paginationContainer.nativeElement);
    const value = getCssVariableValue(style, '--maxPages');
    this.maxPages = value > 0 ? value : this.maxPages;
  }

  /**
   * Get pages to display
   *
   * @returns
   */
  public getPages(currentPage: number, totalPages: number): number[] {
    const pages: number[] = [];
    const maxPages = this.maxPages;

    let start = 1;
    let end = totalPages;

    if (totalPages > maxPages) {
      const halfMax = Math.floor(maxPages / 2);
      start = currentPage - halfMax;
      end = currentPage + halfMax;

      if (start < 1) {
        start = 1;
        end = maxPages;
      }

      if (end > totalPages) {
        end = totalPages;
        start = totalPages - maxPages + 1;
      }
    }

    for (let pageNumber = start; pageNumber <= end; pageNumber++) {
      pages.push(pageNumber);
    }
    return pages;
  }

  /**
   * Get distance class for page
   *
   * @param page
   * @returns
   */
  public getDistanceClass(current_page: number, page: number): string {
    const distance = Math.abs(page - current_page);
    return distance > 0 && distance <= 4 ? `is-near-${distance}` : '';
  }
}
