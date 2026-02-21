import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SvgIconsService } from '../../services/svg.icons.service';
import { ApiService } from '../../services/api.service';

import { ApiEndpointEnums } from '../../enums/api-endpoint';

@Component({
  selector: 'app-report-modal',
  imports: [],
  templateUrl: './report-modal.html',
  styleUrl: './report-modal.scss',
})
export class ReportModal {
  @Input() reportId: number | null = null;
  @Input() reportContext: 'post' | 'comment' | 'user' | null = null;

  @Output() closeModal = new EventEmitter<void>();

  submitResponse: boolean | null = null;
  alreadyReported: boolean = false;

  isProcessingReported = false;

  constructor(
    public svgIconsService: SvgIconsService,
    private apiService: ApiService,
  ) {}

  /**
   * Close the report modal
   */
  onClose() {
    this.closeModal.emit();
  }

  /**
   * Submit a report for a post, comment, or user with the specified reason
   *
   * @param reportId The ID of the entity being reported (post, comment, or user)
   * @param reportContext The type of entity being reported ('post', 'comment', or 'user')
   * @param reason The optional reason for reporting the entity
   * @returns void
   */
  submitReport(reportId: number | null, reportContext: 'post' | 'comment' | 'user' | null, reason: string) {
    if (this.isProcessingReported) {
      return;
    }

    this.isProcessingReported = true;

    const url = ApiEndpointEnums.REPORT;

    let data = {
      reportable_type: reportContext,
      reportable_id: reportId,
      reason: reason,
    };

    this.apiService.post(url, data).subscribe({
      next: (response) => {
        this.submitResponse = true;
        this.isProcessingReported = false;
        setTimeout(() => {
          this.onClose();
        }, 1500);
      },
      error: (error) => {
        if (error.error.errors === 'ALREADY_REPORTED') {
          this.alreadyReported = true;
          this.submitResponse = true;
        } else {
          this.submitResponse = false;
        }
        this.isProcessingReported = false;
      },
    });
  }
}
