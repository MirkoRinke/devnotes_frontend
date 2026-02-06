import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SvgIconsService } from '../../services/svg.icons.service';

@Component({
  selector: 'app-report-button',
  imports: [],
  templateUrl: './report-button.html',
  styleUrl: './report-button.scss',
})
export class ReportButton {
  @Input() showLabel: boolean = false;

  @Output() openReportModal = new EventEmitter<void>();

  constructor(public svgIconsService: SvgIconsService) {}

  /**
   * Handle report button click event send open report modal event to parent
   */
  onReportClick() {
    this.openReportModal.emit();
  }
}
