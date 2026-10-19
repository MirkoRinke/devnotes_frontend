import { Component, Input, Output, EventEmitter } from '@angular/core';

import { TranslatePipe } from '../../../i18n/translate-pipe';

import { SvgIconsService } from '../../../services/svg.icons.service';

@Component({
  selector: 'app-report-button',
  imports: [TranslatePipe],
  templateUrl: './report-button.html',
  styleUrl: './report-button.scss',
})
export class ReportButton {
  @Input() showLabel: boolean = false;

  @Output() openReportModal = new EventEmitter<void>();

  constructor(public readonly svgIconsService: SvgIconsService) {}

  /**
   * Handle report button click event send open report modal event to parent
   */
  public onReportClick(): void {
    this.openReportModal.emit();
  }
}
