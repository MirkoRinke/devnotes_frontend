import { Component, Input, OnInit, inject, DestroyRef } from '@angular/core';

import { AuthService } from '../../../services/auth.service';

import { TranslatePipe } from '../../../i18n/translate-pipe';

import { ClickOutsideDirective } from '../../../directives/click-outside.directive';
import { EscapeCloseDirective } from '../../../directives/escape-close.directive';

import type { UserInterface } from '../../../interfaces/user';

import { AvatarLayer } from '../../avatar-layer/avatar-layer';
import { ControlUserMenu } from './control-user-menu/control-user-menu';

@Component({
  selector: 'app-control-user-badge',
  imports: [ClickOutsideDirective, EscapeCloseDirective, AvatarLayer, ControlUserMenu, TranslatePipe],
  templateUrl: './control-user-badge.html',
  styleUrl: './control-user-badge.scss',
})
export class ControlUserBadge implements OnInit {
  @Input() user: UserInterface | null = null;
  @Input() menuActive: boolean = false;

  private static nextId = 0;
  public readonly menuId = `control-user-menu-${ControlUserBadge.nextId++}`;

  public menuOpen = false;
  public menuAnimating = false;

  private readonly destroyRef = inject(DestroyRef);

  private closeTimer?: ReturnType<typeof setTimeout>;

  constructor(public readonly authService: AuthService) {}

  ngOnInit(): void {
    this.destroyRef.onDestroy(() => clearTimeout(this.closeTimer));
  }

  /**
   * Toggle Badge Menu from user badge button click
   * This method is called when the user badge button is clicked
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
    clearTimeout(this.closeTimer);
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
    clearTimeout(this.closeTimer);
    this.closeTimer = setTimeout(() => this.closeBadgeMenu(), 1000);
  }
}
