import { Component, Input } from '@angular/core';

import type { UserInterface } from '../../interfaces/user';
import { UserBadgeMenu } from './user-badge-menu/user-badge-menu';
import { ReportModal } from '../report-modal/report-modal';

@Component({
  selector: 'app-user-badge',
  imports: [UserBadgeMenu, ReportModal],
  templateUrl: './user-badge.html',
  styleUrl: './user-badge.scss',
})
export class UserBadge {
  @Input() user: UserInterface | null = null;
  @Input() userBadgeContext: 'post' | 'comment' | 'profile' | null = null;
  @Input() menuActive: boolean = false;

  isUserBadgeMenuOpen = false;
  isUserBadgeMenuAnimating = false;

  isReportModalOpen = false;
  isReportModalAnimating = false;

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

  /**
   * Open Report Modal
   */
  openReportModal() {
    this.isReportModalOpen = true;
    requestAnimationFrame(() => (this.isReportModalAnimating = true));
  }

  /**
   * Close Report Modal
   */
  closeReportModal() {
    this.isReportModalAnimating = false;
  }

  /**
   * Handle animation end events
   *
   * @param event
   */
  onAnimationEnd(event: AnimationEvent) {
    if (event.animationName.endsWith('fade-out')) {
      if (this.isReportModalOpen) {
        this.isReportModalOpen = false;
      }
    }
  }
}
