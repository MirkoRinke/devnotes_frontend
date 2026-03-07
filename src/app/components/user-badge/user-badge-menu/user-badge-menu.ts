import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

import type { UserInterface } from '../../../interfaces/user';

import { ApiEndpointEnums } from '../../../enums/api-endpoint';

@Component({
  selector: 'app-user-badge-menu',
  imports: [RouterModule],
  templateUrl: './user-badge-menu.html',
  styleUrl: './user-badge-menu.scss',
})
export class UserBadgeMenu {
  @Input() user: UserInterface | null = null;

  @Input() isUserBadgeMenuOpen: boolean = false;
  @Input() isUserBadgeMenuAnimating: boolean = false;

  @Output() closeMenu = new EventEmitter<void>();
  @Output() openReportModal = new EventEmitter<void>();

  isProcessingFollow: boolean = false;

  constructor(
    public authService: AuthService,
    private apiService: ApiService,
  ) {}

  /**
   * Handle close event from parent component
   * triggered onAnimationEnd when animated out
   */
  onClose() {
    this.isUserBadgeMenuAnimating = false;
  }

  /**
   * Handle animation end events
   *
   * @param event
   */
  onAnimationEnd(event: AnimationEvent) {
    if (event.animationName.endsWith('animated-out')) {
      this.closeMenu.emit();
    }
  }

  /**
   * TODO: Implement navigation to user profile
   */
  userProfile() {
    console.log('User Profile clicked');
  }

  /**
   * Toggle follow/unfollow user and update the UI accordingly.
   */
  toggleFollowUser(user: UserInterface) {
    /**
     * Prevent multiple follow/unfollow requests and ensure user is logged in
     */
    if (this.isProcessingFollow || !this.authService.isLoggedIn()) {
      return;
    }

    this.isProcessingFollow = true;

    const url = user.is_following ? `${ApiEndpointEnums.UNFOLLOW_USER}${user.id}` : `${ApiEndpointEnums.FOLLOW_USER}${user.id}`;

    const method: 'delete' | 'post' = user.is_following ? 'delete' : 'post';

    user.is_following = !user.is_following;

    this.apiService[method](url).subscribe({
      next: (response) => {
        this.isProcessingFollow = false;
      },
      error: (error) => {
        user.is_following = !user.is_following;
        this.isProcessingFollow = false;
      },
    });
  }

  /**
   * Open the report user modal by emitting an event to the parent component.
   */
  reportUser() {
    this.openReportModal.emit();
  }

  /**
   * Check if the current logged-in user is the user of the badge
   *
   * @param user
   * @returns
   */
  isOwner(user: UserInterface | null): boolean {
    return this.authService.isOwner(user?.id ?? null);
  }

  /**
   * Check if the user is logged in
   *
   * @returns
   */
  isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
