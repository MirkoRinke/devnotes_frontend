import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SvgIconsService } from '../../services/svg.icons.service';

import { TranslatePipe } from '../../i18n/translate-pipe';

import type { ParamsInterface } from '../../interfaces/error-handling';

@Component({
  selector: 'app-section-stepper',
  imports: [TranslatePipe],
  templateUrl: './section-stepper.html',
  styleUrl: './section-stepper.scss',
})
export class SectionStepper {
  @Input() direction: 'forward' | 'backward' = 'forward';
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;

  @Input() params: ParamsInterface | null = null;

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(public readonly svgIconsService: SvgIconsService) {}

  /**
   * Handles the click event for the stepper, updating the current page based on the direction and emitting the new page number.
   * It wraps around when reaching the first or last page.
   */
  public handleClick(): void {
    let newPage = this.currentPage;
    if (this.direction === 'forward') {
      if (this.currentPage < this.totalPages - 1) {
        newPage = this.currentPage + 1;
      } else {
        newPage = 0;
      }
    } else if (this.direction === 'backward') {
      if (this.currentPage > 0) {
        newPage = this.currentPage - 1;
      } else {
        newPage = this.totalPages - 1;
      }
    }
    if (newPage !== this.currentPage) {
      this.pageChange.emit(newPage);
    }
  }

  /**
   * Returns the aria-label key based on the provided params and direction.
   *
   * @returns
   */
  public ariaLabelKey(): string {
    if (this.params) {
      return this.direction === 'backward' ? 'stepperBackwardParams' : 'stepperForwardParams';
    } else {
      return this.direction === 'backward' ? 'stepperBackward' : 'stepperForward';
    }
  }

  /**
   * Returns the aria-label parameters based on the provided params.
   *
   * @returns
   */
  public ariaLabelParams(): ParamsInterface | null {
    return this.params ? this.params : null;
  }
}
