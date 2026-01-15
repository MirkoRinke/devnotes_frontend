import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { PaginationInfoInterface } from '../../interfaces/pagination-info';

import { SvgIconsService } from '../../services/svg.icons.service';

@Component({
  selector: 'app-page-pagination',
  imports: [RouterLink],
  templateUrl: './page-pagination.html',
  styleUrl: './page-pagination.scss',
})
export class PagePagination<T> {
  @Input() paginationInfo!: PaginationInfoInterface<T>;

  constructor(public svgIconsService: SvgIconsService) {}

  /**
   * Get pages to display
   *
   * @returns
   */
  getPages(): number[] {
    const total = this.paginationInfo.last_page;
    const current = this.paginationInfo.current_page;
    const pages: number[] = [];

    const maxPages = 9;

    let start = 1;
    let end = total;

    if (total > maxPages) {
      const halfMax = Math.floor(maxPages / 2);
      start = current - halfMax;
      end = current + halfMax;

      if (start < 1) {
        start = 1;
        end = maxPages;
      }

      if (end > total) {
        end = total;
        start = total - maxPages + 1;
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
  getDistanceClass(page: number): string {
    const distance = Math.abs(page - this.paginationInfo.current_page);
    return distance > 0 && distance <= 4 ? `is-near-${distance}` : '';
  }
}
