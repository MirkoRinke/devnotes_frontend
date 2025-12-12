import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-page-stepper',
  imports: [],
  templateUrl: './page-stepper.html',
  styleUrl: './page-stepper.scss',
})
export class PageStepper {
  @Input() direction!: string;
  @Input() currentPage!: number;
  @Input() totalPages!: number;

  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit() {
    if (!this.direction || (this.direction !== 'forward' && this.direction !== 'backward')) {
      console.error(`Invalid direction input for PageStepper component: ${this.direction}`);
    }
    if (this.currentPage === undefined || this.totalPages === undefined) {
      console.error(`currentPage and totalPages inputs are required for PageStepper component`);
    }
  }

  handleClick() {
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
    console.log(newPage);
  }
}
