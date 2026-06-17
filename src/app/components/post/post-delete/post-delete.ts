import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';

import { SvgIconsService } from '../../../services/svg.icons.service';

import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

import { ApiEndpointEnums } from '../../../enums/api-endpoint';

import type { PostInterface } from '../../../interfaces/post';
import type { PostParamsInterface } from '../../../interfaces/post-params';
import type { SplittedConfirmationTitleInterface } from '../../../interfaces/post-delete';
import type { BadgeMessagesInterface } from '../../../interfaces/validation-messages';
import { badgeMessagesInit } from '../../../interfaces/validation-messages';
import { Badge } from '../../badge/badge';

@Component({
  selector: 'app-post-delete',
  imports: [Badge],
  templateUrl: './post-delete.html',
  styleUrl: './post-delete.scss',
})
export class PostDelete {
  @Input() context: PostParamsInterface['context'] = null;
  @Input() endPoint: PostParamsInterface['endPoint'] = null;
  @Input() selectedEntity: PostParamsInterface['selectedEntity'] = null;
  @Input() selectedEntityValue: PostParamsInterface['selectedEntityValue'] = null;
  @Input() selectedPostType: PostParamsInterface['selectedPostType'] = null;

  @Input() post: PostInterface | null = null;

  @Output() closeModal = new EventEmitter<void>();

  fastDeleteEnabled = false;
  fastDeleteTimeLimitMinutes = 15;
  fastDeleteMaxComments = 0;

  isDeleteConfirmed = false;
  initialTitle: string | null = null;
  confirmationTitle: string | null = null;
  confirmationTitleMaxLength = 20;
  inputConfirmationValue: string | null = null;

  splittedConfirmationTitle: SplittedConfirmationTitleInterface[] = [];

  messages: BadgeMessagesInterface = { ...badgeMessagesInit };

  feedbackTimeout: number | null = null;

  constructor(
    public svgIconsService: SvgIconsService,
    private apiService: ApiService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.checkFastDeletePossibility();
    this.createConfirmation();
  }

  /**
   * Checks if the post can be deleted quickly without confirmation based on its age and number of comments.
   * If the post is older than the defined time limit or has more comments than the defined maximum, fast delete is disabled and confirmation is required.
   * Otherwise, fast delete is enabled and the delete action can be performed immediately without confirmation.
   */
  private checkFastDeletePossibility(): void {
    if (this.post) {
      let overTime = false;
      let hasComments = false;

      if (this.post.created_at) {
        const createdAt = new Date(this.post.created_at);
        const now = new Date();
        const diffInMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
        overTime = diffInMinutes > this.fastDeleteTimeLimitMinutes;
      }

      if (this.post.comments_count) {
        hasComments = this.post.comments_count > this.fastDeleteMaxComments;
      }

      this.fastDeleteEnabled = !overTime && !hasComments;
      this.isDeleteConfirmed = this.fastDeleteEnabled;
    }
  }

  /**
   * Creates the confirmation title and splits it into individual characters with their initial status.
   */
  private createConfirmation(): void {
    if (this.post && this.post.title) {
      this.initialTitle = this.post.title.replace(/\s+/g, ' ').trim();
      this.confirmationTitle = this.initialTitle.substring(0, Math.min(this.confirmationTitleMaxLength, this.initialTitle.length));
      this.splittedConfirmationTitle = this.confirmationTitle.split('').map((value) => ({
        value,
        status: 'pending',
      }));
    }
  }

  /**
   * Handle input change for delete confirmation
   *
   * @param event
   */
  onDeleteConfirmationInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.inputConfirmationValue = input.value;

    if (this.confirmationTitle) {
      this.updateSplittedConfirmationTitle();

      if (this.inputConfirmationValue === this.confirmationTitle) {
        this.isDeleteConfirmed = true;
      } else {
        this.isDeleteConfirmed = false;
      }
    }
  }

  /**
   * Updates the splittedConfirmationTitle array based on the current inputConfirmationValue and confirmationTitle.
   */
  private updateSplittedConfirmationTitle(): void {
    if (this.confirmationTitle) {
      this.splittedConfirmationTitle = this.confirmationTitle.split('').map((value, index) => {
        let status: SplittedConfirmationTitleInterface['status'] = 'pending';

        if (this.inputConfirmationValue && this.inputConfirmationValue[index]) {
          if (this.inputConfirmationValue[index] === value) {
            status = 'matched';
          } else if (this.inputConfirmationValue[index] !== value) {
            status = 'error';
          }
        }

        return { value, status };
      });
    }
  }

  /**
   * Clears any existing feedback messages (errors or info) and sets a timeout to clear them after 3 seconds
   */
  private clearFeedback(): void {
    if (this.feedbackTimeout) {
      clearTimeout(this.feedbackTimeout);
    }

    this.messages = { ...badgeMessagesInit };

    this.feedbackTimeout = setTimeout(() => {
      this.messages = { ...badgeMessagesInit };
    }, 3000);
  }

  /**
   * Focuses the confirmation input field when the fade-in animation ends, ensuring that the user can immediately start
   * typing the confirmation text without needing to click on the input field.
   *
   * @param event The animation event triggered when the fade-in animation ends.
   */
  @ViewChild('confirmationInput') confirmationInput!: ElementRef;
  @HostListener('animationend', ['$event'])
  onHostAnimationEnd(event: AnimationEvent) {
    if (event.animationName.endsWith('fade-in') && this.confirmationInput) {
      this.confirmationInput.nativeElement.focus();
    }
  }

  /**
   * Handle post deletion
   *
   * @param post
   * @returns
   */
  onDeletePost(post: PostInterface): void {
    if (this.authService.getCurrentUserId() !== post.user_id) {
      this.clearFeedback();
      this.messages['error'] = 'Keine Berechtigung zum Löschen.';
      return;
    }

    if (!this.isDeleteConfirmed) {
      this.clearFeedback();
      if (this.inputConfirmationValue === null || this.inputConfirmationValue.length === 0) {
        this.messages['info'] = 'Bitte Bestätigungstext eingeben.';
      } else {
        this.messages['error'] = 'Bestätigungstext stimmt nicht überein.';
      }
      return;
    }

    const url = `${ApiEndpointEnums.DELETE_POSTS}${post.id}`;

    const hasRequiredParams = !!(this.context && this.endPoint && this.selectedEntity && this.selectedEntityValue);

    this.apiService.delete(url).subscribe({
      next: () => {
        console.log('Post deleted successfully');
        this.clearFeedback();
        this.messages['success'] = 'Beitrag erfolgreich gelöscht.';
        setTimeout(() => {
          if (hasRequiredParams) {
            this.router.navigate(['/posts-list'], {
              queryParams: {
                context: this.context,
                endPoint: this.endPoint,
                selectedEntity: this.selectedEntity,
                selectedEntityValue: this.selectedEntityValue,
                selectedPostType: this.selectedPostType ?? null,
              },
              replaceUrl: true,
            });
          } else {
            this.router.navigate(['/']);
          }
        }, 1500);
      },
      error: (error) => {
        console.error('Error deleting post:', error);
        this.clearFeedback();
        this.messages['error'] = 'Fehler beim Löschen des Beitrags.';
      },
    });
  }

  /**
   * Close the delete confirmation modal
   */
  public onClose(): void {
    this.closeModal.emit();
  }
}
