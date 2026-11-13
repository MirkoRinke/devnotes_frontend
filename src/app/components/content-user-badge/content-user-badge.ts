import { Component, Input, ViewChild, ElementRef, inject, DestroyRef, OnInit } from '@angular/core';

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
export class ContentUserBadge implements OnInit {
  @Input() user: UserInterface | null = null;
  @Input() menuActive: boolean = false;

  private static nextId = 0;
  public readonly menuId = `content-user-menu-${ContentUserBadge.nextId++}`;

  public menuOpen = false;
  public menuAnimating = false;

  private closeMenuTimer?: ReturnType<typeof setTimeout>;
  private closeModalTimer?: ReturnType<typeof setTimeout>;

  private readonly destroyRef = inject(DestroyRef);

  public reportModalOpen = false;
  public reportModalAnimating = false;

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => {
      clearTimeout(this.closeMenuTimer);
      clearTimeout(this.closeModalTimer);
    });
  }

  /**
   * Toggle Settings Dropdown
   */
  public toggleBadgeMenu(): void {
    if (!this.menuActive) return;

    if (this.menuOpen) {
      this.menuAnimating = false;
    } else {
      this.menuOpen = true;
      this.menuAnimating = true;
    }
  }

  /**
   * Close Badge Menu from menu component
   */
  public closeBadgeMenu(): void {
    clearTimeout(this.closeMenuTimer);
    this.menuOpen = false;
    this.menuAnimating = false;
  }

  /**
   * Close Badge Menu from click outside directive
   * This method is called when a click outside the badge menu is detected
   */
  public triggerCloseBadgeMenu(): void {
    if (!this.menuOpen) return;
    this.menuAnimating = false;
    /**
     * Fallback to close the menu after animation duration
     */
    clearTimeout(this.closeMenuTimer);
    this.closeMenuTimer = setTimeout(() => this.closeBadgeMenu(), 1000);
  }

  /**
   * Open Report Modal
   */
  public openReportModal(): void {
    this.reportModalOpen = true;
    this.reportModalAnimating = true;
  }

  /**
   * Close Report Modal
   */
  private closeModal(): void {
    clearTimeout(this.closeModalTimer);
    this.reportModalOpen = false;
    this.toggleButton?.nativeElement.focus();
  }

  /**
   * Close Report Modal
   */
  public closeReportModal(): void {
    if (!this.reportModalOpen) return;

    this.reportModalAnimating = false;
    clearTimeout(this.closeModalTimer);
    this.closeModalTimer = setTimeout(() => this.closeModal(), 1000);
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
        this.closeModal();
      }
    }
  }
}
