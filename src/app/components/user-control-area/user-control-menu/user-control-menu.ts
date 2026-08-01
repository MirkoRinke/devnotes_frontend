import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../../services/auth.service';
import { LogoutService } from '../../../services/logout.service';
import { SvgIconsService } from '../../../services/svg.icons.service';

import type { UserInterface } from '../../../interfaces/user';

@Component({
  selector: 'app-user-control-menu',
  imports: [RouterModule],
  templateUrl: './user-control-menu.html',
  styleUrl: './user-control-menu.scss',
})
export class UserControlMenu {
  @Input() user: UserInterface | null = null;

  @Input() isUserBadgeMenuOpen: boolean = false;
  @Input() isUserBadgeMenuAnimating: boolean = false;

  @Output() closeMenu = new EventEmitter<void>();
  @Output() openReportModal = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    public logoutService: LogoutService,
    public svgIconsService: SvgIconsService,
  ) {}

  /**
   * Handle close event from parent component
   * triggered onAnimationEnd when animated out
   */
  onClose() {
    this.isUserBadgeMenuAnimating = false;
  }

  /**
   * Handle animation end events
   *
   * @param event
   */
  onAnimationEnd(event: AnimationEvent) {
    if (event.animationName.endsWith('animated-out')) {
      this.closeMenu.emit();
    }
  }
}
