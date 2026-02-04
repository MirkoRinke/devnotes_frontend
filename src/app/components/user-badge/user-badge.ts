import { Component, Input } from '@angular/core';

import type { UserInterface } from '../../interfaces/user';
import { UserBadgeMenu } from './user-badge-menu/user-badge-menu';

@Component({
  selector: 'app-user-badge',
  imports: [UserBadgeMenu],
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
   * Close Badge Menu from menu component
   */
  closeBadgeMenu() {
    this.isUserBadgeMenuOpen = false;
    this.isUserBadgeMenuAnimating = false;
  }
}
