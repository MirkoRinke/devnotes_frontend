import { Component, Input, Output, EventEmitter } from '@angular/core';

import type { UserInterface } from '../../../interfaces/user';

@Component({
  selector: 'app-user-badge-menu',
  imports: [],
  templateUrl: './user-badge-menu.html',
  styleUrl: './user-badge-menu.scss',
})
export class UserBadgeMenu {
  @Input() user!: UserInterface | null;

  @Input() isUserBadgeMenuOpen: boolean = false;
  @Input() isUserBadgeMenuAnimating: boolean = false;

  @Output() closeMenu = new EventEmitter<void>();

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
   * TODO: Implement follow/unfollow user functionality
   */
  toggleFollowUser() {
    console.log('Toggle Follow User clicked');
  }

  /**
   * TODO: Implement report user functionality
   */
  reportUser() {
    console.log('Report User clicked');
  }
}
