import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SvgIconsService } from '../../../services/svg.icons.service';
import { ApiService } from '../../../services/api.service';

import { TranslatePipe } from '../../../i18n/translate-pipe';

import { ApiEndpointEnums } from '../../../enums/api-endpoint';

import { ClickOutsideDirective } from '../../../directives/click-outside.directive';
import { EscapeCloseDirective } from '../../../directives/escape-close.directive';

@Component({
  selector: 'app-report-modal',
  imports: [TranslatePipe, ClickOutsideDirective, EscapeCloseDirective],
  templateUrl: './report-modal.html',
  styleUrl: './report-modal.scss',
})
export class ReportModal {
  @Input() reportId: number | null = null;
  @Input() reportContext: 'post' | 'comment' | 'userProfile' | 'user' | null = null;

  @Output() closeModal = new EventEmitter<void>();

  private readonly timeToAutoClose: number = 2000;

  public submitResponse: boolean | null = null;
  public alreadyReported: boolean = false;

  public isProcessingReported: boolean = false;

  constructor(
    public readonly svgIconsService: SvgIconsService,
    private readonly apiService: ApiService,
  ) {}

  /**
   * Close the report modal
   */
  public onClose(): void {
    this.closeModal.emit();
  }

  /**
   * Submit a report for a post, comment, userProfile or user with the specified reason
   *
   * @param reportId The ID of the entity being reported (post, comment, userProfile or user)
   * @param reportContext The type of entity being reported ('post', 'comment', 'userProfile' or 'user')
   * @param reason The optional reason for reporting the entity
   * @returns void
   */
  public submitReport(reportId: number | null, reportContext: 'post' | 'comment' | 'userProfile' | 'user' | null, reason: string): void {
    if (this.isProcessingReported) {
      return;
    }

    /**
     * The backend expects 'userProfile' as the reportable_type for user reports, but the frontend uses 'user' and userProfile' interchangeably.
     * To ensure the correct reportable_type is sent to the backend, we need to convert 'user' to 'userProfile' before making the API call.
     */
    if (reportContext === 'user') {
      reportContext = 'userProfile';
    }

    this.isProcessingReported = true;

    const url = ApiEndpointEnums.REPORT;

    const data = {
      reportable_type: reportContext,
      reportable_id: reportId,
      reason: reason,
    };

    this.apiService.post(url, data).subscribe({
      next: () => {
        this.submitResponse = true;
        this.isProcessingReported = false;
        setTimeout(() => {
          this.onClose();
        }, this.timeToAutoClose);
      },
      error: (error) => {
        if (error.error.errors === 'ALREADY_REPORTED') {
          this.alreadyReported = true;
          this.submitResponse = true;
          setTimeout(() => {
            this.onClose();
          }, this.timeToAutoClose);
        } else {
          this.submitResponse = false;
        }
        this.isProcessingReported = false;
      },
    });
  }
}
