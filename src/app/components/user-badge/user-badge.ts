import { Component, Input } from '@angular/core';

import type { UserInterface } from '../../interfaces/user';
import { UserBadgeMenu } from './user-badge-menu/user-badge-menu';
import { ReportModal } from '../report-modal/report-modal';

import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { AvatarLayer } from '../avatar-layer/avatar-layer';

@Component({
  selector: 'app-user-badge',
  imports: [UserBadgeMenu, ReportModal, ClickOutsideDirective, AvatarLayer],
  templateUrl: './user-badge.html',
  styleUrl: './user-badge.scss',
})
export class UserBadge {
  @Input() user: UserInterface | null = null;
  @Input() menuActive: boolean = false;

  menuOpen = false;
  menuAnimating = false;

  reportModalOpen = false;
  reportModalAnimating = false;

  constructor() {}

  /**
   * Toggle Settings Dropdown
   */
  toggleBadgeMenu(): void {
    if (this.menuOpen) {
      this.menuAnimating = false;
    } else {
      this.menuOpen = true;
      requestAnimationFrame(() => (this.menuAnimating = true));
    }
  }

  /**
   * Close Badge Menu from menu component
   */
  closeBadgeMenu(): void {
    this.menuOpen = false;
  }

  /**
   * Close Badge Menu from click outside directive
   * This method is called when a click outside the badge menu is detected
   */
  triggerCloseBadgeMenu(): void {
    this.menuAnimating = false;
  }

  /**
   * Open Report Modal
   */
  openReportModal(): void {
    this.reportModalOpen = true;
    requestAnimationFrame(() => (this.reportModalAnimating = true));
  }

  /**
   * Close Report Modal
   */
  closeReportModal(): void {
    this.reportModalAnimating = false;
  }

  /**
   * Handle animation end events
   *
   * @param event
   */
  onAnimationEnd(event: AnimationEvent): void {
    if (event.animationName.endsWith('fade-out')) {
      if (this.reportModalOpen) {
        this.reportModalOpen = false;
      }
    }
  }
}
