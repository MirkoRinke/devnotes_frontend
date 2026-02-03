import { Component, Input } from '@angular/core';

import type { UserInterface } from '../../interfaces/user';

@Component({
  selector: 'app-user-badge',
  imports: [],
  templateUrl: './user-badge.html',
  styleUrl: './user-badge.scss',
})
export class UserBadge {
  @Input() user!: UserInterface | null;
  @Input() userBadgeContext!: 'post' | 'comment' | 'profile';
  @Input() menuActive: boolean = false;

  isUserBadgeMenuOpen = false;
  isUserBadgeMenuAnimating = false;

  constructor() {}

  /**
   * Toggle Settings Dropdown
   */
  toggleBadgeMenu() {
    if (this.isUserBadgeMenuOpen) {
      this.isUserBadgeMenuAnimating = false;
    } else {
      this.isUserBadgeMenuOpen = true;
      requestAnimationFrame(() => (this.isUserBadgeMenuAnimating = true));
    }
  }

  /**
   * Handle animation end events
   *
   * @param event
   */
  onAnimationEnd(event: AnimationEvent) {
    //TODO Refactoring this later to 'fade-out'
    if (event.animationName.endsWith('animated-out') && this.isUserBadgeMenuOpen) {
      this.isUserBadgeMenuOpen = false;
    }
  }

  userProfile() {
    // Implement user profile logic here
    alert('User Profile clicked');
  }

  toggleFollowUser() {
    // Implement follow/unfollow logic here
    alert('Toggle Follow User clicked');
  }

  reportUser() {
    // Implement report user logic here
    alert('Report User clicked');
  }
}
