import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { PaginationInfoInterface } from '../../interfaces/pagination-info';

import { SvgIconsService } from '../../services/svg.icons.service';

@Component({
  selector: 'app-section-pagination',
  imports: [RouterLink],
  templateUrl: './section-pagination.html',
  styleUrl: './section-pagination.scss',
})
export class SectionPagination<T> {
  @Input() paginationInfo: PaginationInfoInterface<T> | null = null;

  constructor(public svgIconsService: SvgIconsService) {}

  /**
   * Get pages to display
   *
   * @returns
   */
  getPages(currentPage: number, totalPages: number): number[] {
    const pages: number[] = [];
    const maxPages = 9;

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
  getDistanceClass(current_page: number, page: number): string {
    const distance = Math.abs(page - current_page);
    return distance > 0 && distance <= 4 ? `is-near-${distance}` : '';
  }
}
