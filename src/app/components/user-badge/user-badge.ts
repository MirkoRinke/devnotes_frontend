import { Component, Input } from '@angular/core';
import { SimpleChanges } from '@angular/core';

import type { UserInterface } from '../../interfaces/user';
import { UserBadgeMenu } from './user-badge-menu/user-badge-menu';
import { ReportModal } from '../report-modal/report-modal';
import { UserControlMenu } from './user-control-menu/user-control-menu';

import { ClickOutsideDirective } from '../../directives/click-outside.directive';

@Component({
  selector: 'app-user-badge',
  imports: [UserBadgeMenu, ReportModal, UserControlMenu, ClickOutsideDirective],
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

  adminAvatarID: number = 1000;
  moderatorAvatarID: number = 1001;
  systemAvatarID: number = 1002;

  avatarMvpPath: string | null = null;

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['user']) {
      this.mvpAvatarPath();
    }
  }

  /**
   * Toggle Settings Dropdown
   */
  toggleBadgeMenu(): void {
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
  closeBadgeMenu(): void {
    this.isUserBadgeMenuOpen = false;
  }

  /**
   * Close Badge Menu from click outside directive
   * This method is called when a click outside the badge menu is detected
   */
  triggerCloseBadgeMenu(): void {
    this.isUserBadgeMenuAnimating = false;
  }

  /**
   * Open Report Modal
   */
  openReportModal(): void {
    this.isReportModalOpen = true;
    requestAnimationFrame(() => (this.isReportModalAnimating = true));
  }

  /**
   * Close Report Modal
   */
  closeReportModal(): void {
    this.isReportModalAnimating = false;
  }

  /**
   * Handle animation end events
   *
   * @param event
   */
  onAnimationEnd(event: AnimationEvent): void {
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
  mvpAvatarPath(): void {
    const avatarMvpId = this.validAvatarID();
    this.avatarMvpPath = `/avatar-mvp/mvp_${avatarMvpId}.webp`;
  }

  /**
   * Checks if the provided avatar ID is valid based on the defined standard and system avatar IDs.
   *
   * @returns The valid avatar ID, which is either the provided avatar ID if valid, or 1 if invalid.
   */
  validAvatarID(): number {
    const avatarMvpId = this.user?.avatar_mvp_id ?? 1;
    const isStandard = avatarMvpId && avatarMvpId >= 1 && avatarMvpId <= 20;
    const isSystem = avatarMvpId && (avatarMvpId === this.adminAvatarID || avatarMvpId === this.moderatorAvatarID || avatarMvpId === this.systemAvatarID);

    if (isStandard || isSystem) {
      return avatarMvpId;
    } else {
      return 1;
    }
  }
}
