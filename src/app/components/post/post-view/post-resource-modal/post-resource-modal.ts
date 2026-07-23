import { Component, Input, Output, EventEmitter } from '@angular/core';

import type { PostResourceModalInterface, PostResourceType } from '../../../../interfaces/post-resource-modal';

import { ApiService } from '../../../../services/api.service';
import { AuthService } from '../../../../services/auth.service';
import { LocalConsentService } from '../../../../services/local-consent.service';
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
    private localConsentService: LocalConsentService,
  ) {}

  onClose() {
    this.closeModal.emit();
  }

  enableExternalContent(type: PostResourceType, hours: number) {
    if (!this.authService.isLoggedIn()) {
      this.handleGuestConsent(type, hours);
      return;
    }

    /**
     * Prevent multiple requests if the user clicks the button multiple times or if the type is null (which means no external content type is selected).
     */
    if (this.isProcessing || type === null) {
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
   * Handles the consent for guest users by saving their preference in local storage and emitting an event to enable external content.
   *
   * @param type
   * @param hours
   * @returns
   */
  handleGuestConsent(type: PostResourceType, hours: number) {
    if (type === null) return;
    const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
    const localStorageName = `X-Show-External-${capitalizedType}`;

    const data = {
      type: type,
    };

    this.localConsentService.saveLocalConsent(localStorageName, hours, data);

    this.externalContentEnabled.emit(type);
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
