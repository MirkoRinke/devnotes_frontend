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

  avatarMvpPath: string | null = null;

  constructor() {}

  ngOnInit() {
    this.mvpAvatarPath(this.user);
  }

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

  /**
   * Get the path for the user's MVP avatar
   *
   * @param user
   */
  mvpAvatarPath(user: UserInterface | null): void {
    const avatarMvpId = user?.avatar_mvp_id ?? null;
    const isStandard = avatarMvpId && avatarMvpId >= 1 && avatarMvpId <= 20;
    const isSystem = avatarMvpId && avatarMvpId >= 997 && avatarMvpId <= 999;

    if (isStandard || isSystem) {
      this.avatarMvpPath = `/avatar-mvp/mvp_${avatarMvpId}.webp`;
    } else {
      this.avatarMvpPath = '/avatar-mvp/mvp_1.webp';
    }
  }
}
