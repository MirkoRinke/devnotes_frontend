import { Component, Input } from '@angular/core';

import type { UserInterface } from '../../../interfaces/user';
import { UserControlMenu } from '../user-control-menu/user-control-menu';

import { ClickOutsideDirective } from '../../../directives/click-outside.directive';
import { AvatarLayer } from '../../avatar-layer/avatar-layer';

@Component({
  selector: 'app-control-user-badge',
  imports: [UserControlMenu, ClickOutsideDirective, AvatarLayer],
  templateUrl: './control-user-badge.html',
  styleUrl: './control-user-badge.scss',
})
export class ControlUserBadge {
  @Input() user: UserInterface | null = null;
  @Input() menuActive: boolean = false;

  menuOpen = false;
  menuAnimating = false;

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
}
