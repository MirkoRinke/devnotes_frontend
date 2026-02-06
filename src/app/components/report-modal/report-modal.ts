import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SvgIconsService } from '../../services/svg.icons.service';

@Component({
  selector: 'app-report-modal',
  imports: [],
  templateUrl: './report-modal.html',
  styleUrl: './report-modal.scss',
})
export class ReportModal {
  @Input() reportContext!: string;

  @Input() reportID!: number;

  @Output() closeModal = new EventEmitter<void>();

  constructor(public svgIconsService: SvgIconsService) {}

  /**
   * Close the report modal
   */
  onClose() {
    this.closeModal.emit();
  }

  /**
   * TODO: Implement report submission functionality
   * @param reason The reason for reporting
   */
  submitReport(reason: string) {
    console.log(`Report submitted for ${this.reportContext} ID ${this.reportID} with reason: ${reason}`);
    this.onClose();
  }
}
