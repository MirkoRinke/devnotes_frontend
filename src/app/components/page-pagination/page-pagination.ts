import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { PaginationInfoInterface } from '../../interfaces/pagination-info';

@Component({
  selector: 'app-page-pagination',
  imports: [RouterLink],
  templateUrl: './page-pagination.html',
  styleUrl: './page-pagination.scss',
})
export class PagePagination<T> {
  @Input() paginationInfo!: PaginationInfoInterface<T>;

  constructor() {}

  getPages(): number[] {
    const total = this.paginationInfo.last_page;
    const current = this.paginationInfo.current_page;
    const pages: number[] = [];

    const maxPages = 8;
    const halfMax = Math.floor(maxPages / 2);

    let start = current - halfMax;
    let end = current + halfMax;

    /**
     * Limit: never less than 1, never more than total
     */
    if (start < 1) {
      start = 1;
      end = Math.min(total, start + maxPages - 1);
    }
    if (end > total) {
      end = total;
      start = Math.max(1, end - maxPages + 1);
    }

    /**
     * Ensure that left and right are never more than halfMax away from current
     */
    if (current - start > halfMax) {
      start = current - halfMax;
    }
    if (end - current > halfMax) {
      end = current + halfMax;
      if (end > total) end = total;
    }

    for (let pageNumber = start; pageNumber <= end; pageNumber++) {
      pages.push(pageNumber);
    }
    return pages;
  }
}
