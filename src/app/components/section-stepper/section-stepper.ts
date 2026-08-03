import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SvgIconsService } from '../../services/svg.icons.service';

@Component({
  selector: 'app-section-stepper',
  imports: [],
  templateUrl: './section-stepper.html',
  styleUrl: './section-stepper.scss',
})
export class SectionStepper {
  @Input() direction: 'forward' | 'backward' = 'forward';
  @Input() currentPage: number = 0;
  @Input() totalPages: number = 0;

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  constructor(public svgIconsService: SvgIconsService) {}

  handleClick(): void {
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
}
