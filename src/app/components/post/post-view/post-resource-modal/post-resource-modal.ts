import { Component, Input, Output, EventEmitter } from '@angular/core';

import type { PostResourceModalInterface, PostResourceType } from '../../../../interfaces/post-ressource-modal';

import { ApiService } from '../../../../services/api.service';
import { AuthService } from '../../../../services/auth.service';
import { SvgIconsService } from '../../../../services/svg.icons.service';

import { ApiEndpointEnums } from '../../../../enums/api-endpoint';
@Component({
  selector: 'app-post-resource-modal',
  imports: [],
  templateUrl: './post-resource-modal.html',
  styleUrl: './post-resource-modal.scss',
})
export class PostResourceModal {
  @Input() modalData!: PostResourceModalInterface;
  @Output() closeModal = new EventEmitter<void>();

  @Output() externalContentEnabled = new EventEmitter<PostResourceType>();

  isProcessing = false;

  constructor(
    public svgIconsService: SvgIconsService,
    private apiService: ApiService,
    private authService: AuthService,
  ) {}

  onClose() {
    this.closeModal.emit();
  }

  enableExternalContent(type: PostResourceType, hours: number) {
    /**
     * Prevent multiple requests and ensure user is logged in and type is valid
     */
    if (this.isProcessing || !this.authService.isLoggedIn() || type === null) {
      return;
    }

    this.isProcessing = true;

    const url = `${ApiEndpointEnums.USER_PROFILES}${this.authService.getCurrentUserId()}${ApiEndpointEnums.ENABLE_TEMPORARY_EXTERNALS_SUFFIX}`;

    let data = {
      type: type,
      hours: hours,
    };

    this.apiService.post(url, data).subscribe({
      next: (response) => {
        this.isProcessing = false;
        this.externalContentEnabled.emit(type);
      },
      error: (error) => {
        this.isProcessing = false;
      },
    });
  }

  /**
   * Checks if the current user is the owner of the post to determine if they should have permissions to enable external content or remove links.
   *
   * @returns
   */
  isOwner(): boolean {
    return this.authService.getCurrentUserId() === this.modalData.postOwnerId;
  }
}
