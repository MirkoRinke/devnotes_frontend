import { Component, Input, ViewChild, ElementRef } from '@angular/core';

import { TranslatePipe } from '../../i18n/translate-pipe';

import type { UserInterface } from '../../interfaces/user';
import { ReportModal } from '../report/report-modal/report-modal';

import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { EscapeCloseDirective } from '../../directives/escape-close.directive';

import { AvatarLayer } from '../avatar-layer/avatar-layer';
import { ContentUserMenu } from './content-user-menu/content-user-menu';

@Component({
  selector: 'app-content-user-badge',
  imports: [ReportModal, ClickOutsideDirective, EscapeCloseDirective, AvatarLayer, ContentUserMenu, TranslatePipe],
  templateUrl: './content-user-badge.html',
  styleUrl: './content-user-badge.scss',
})
export class ContentUserBadge {
  @Input() user: UserInterface | null = null;
  @Input() menuActive: boolean = false;

  private static nextId = 0;
  public readonly menuId = `content-user-menu-${ContentUserBadge.nextId++}`;

  public menuOpen = false;
  public menuAnimating = false;

  public reportModalOpen = false;
  public reportModalAnimating = false;

  /**
   * Toggle Settings Dropdown
   */
  public toggleBadgeMenu(): void {
    if (!this.menuActive) return;

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
  public closeBadgeMenu(): void {
    this.menuOpen = false;
  }

  /**
   * Close Badge Menu from click outside directive
   * This method is called when a click outside the badge menu is detected
   */
  public triggerCloseBadgeMenu(): void {
    this.menuAnimating = false;
  }

  /**
   * Open Report Modal
   */
  public openReportModal(): void {
    this.reportModalOpen = true;
    requestAnimationFrame(() => (this.reportModalAnimating = true));
  }

  /**
   * Close Report Modal
   */
  public closeReportModal(): void {
    this.reportModalAnimating = false;
  }

  /**
   * Reference to the toggle button element for focus management after closing the report modal.
   */
  @ViewChild('toggleButton') private toggleButton?: ElementRef<HTMLButtonElement>;

  /**
   * Handle animation end events
   *
   * @param event
   */
  public onAnimationEnd(event: AnimationEvent): void {
    if (event.animationName.endsWith('fade-out')) {
      if (this.reportModalOpen) {
        this.reportModalOpen = false;
        this.toggleButton?.nativeElement.focus();
      }
    }
  }
}
