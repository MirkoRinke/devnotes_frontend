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

  /**
   * User Profile Clicked (Placeholder)
   */
  userProfile() {
    alert('User Profile clicked');
  }

  /**
   * Toggle Follow User (Placeholder)
   */
  toggleFollowUser() {
    alert('Toggle Follow User clicked');
  }

  /**
   * Report User (Placeholder)
   */
  reportUser() {
    alert('Report User clicked');
  }
}
