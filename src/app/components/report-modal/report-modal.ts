import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SvgIconsService } from '../../services/svg.icons.service';

@Component({
  selector: 'app-report-modal',
  imports: [],
  templateUrl: './report-modal.html',
  styleUrl: './report-modal.scss',
})
export class ReportModal {
  @Input() reportID!: number;

  @Output() closeModal = new EventEmitter<void>();

  constructor(public svgIconsService: SvgIconsService) {}

  onClose() {
    this.closeModal.emit();
  }
}
