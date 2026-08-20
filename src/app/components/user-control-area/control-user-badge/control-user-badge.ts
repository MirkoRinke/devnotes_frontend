import { Component, Input } from '@angular/core';

import { AuthService } from '../../../services/auth.service';

import { TranslatePipe } from '../../../i18n/translate-pipe';

import { ClickOutsideDirective } from '../../../directives/click-outside.directive';

import type { UserInterface } from '../../../interfaces/user';

import { AvatarLayer } from '../../avatar-layer/avatar-layer';
import { ControlUserMenu } from './control-user-menu/control-user-menu';

@Component({
  selector: 'app-control-user-badge',
  imports: [ClickOutsideDirective, AvatarLayer, ControlUserMenu, TranslatePipe],
  templateUrl: './control-user-badge.html',
  styleUrl: './control-user-badge.scss',
})
export class ControlUserBadge {
  @Input() user: UserInterface | null = null;
  @Input() menuActive: boolean = false;

  public menuOpen = false;
  public menuAnimating = false;

  constructor(public authService: AuthService) {}

  /**
   * Toggle Settings Dropdown
   */
  public toggleBadgeMenu(): void {
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
}
