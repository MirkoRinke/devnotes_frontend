import { Component, Input } from '@angular/core';

import type { UserInterface } from '../../interfaces/user';
import { ReportModal } from '../report-modal/report-modal';

import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { AvatarLayer } from '../avatar-layer/avatar-layer';
import { ContentUserMenu } from './content-user-menu/content-user-menu';

@Component({
  selector: 'app-content-user-badge',
  imports: [ReportModal, ClickOutsideDirective, AvatarLayer, ContentUserMenu],
  templateUrl: './content-user-badge.html',
  styleUrl: './content-user-badge.scss',
})
export class ContentUserBadge {
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
