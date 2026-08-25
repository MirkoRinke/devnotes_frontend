import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthService } from '../../../../services/auth.service';
import { LogoutService } from '../../../../services/logout.service';
import { SvgIconsService } from '../../../../services/svg.icons.service';

import { TranslatePipe } from '../../../../i18n/translate-pipe';

import type { UserInterface } from '../../../../interfaces/user';
import type { NavigationLinksInterface } from '../../../../interfaces/navigation-links';

@Component({
  selector: 'app-control-user-menu',
  imports: [RouterModule, TranslatePipe],
  templateUrl: './control-user-menu.html',
  styleUrl: './control-user-menu.scss',
})
export class ControlUserMenu {
  @Input() user: UserInterface | null = null;

  @Input() isUserBadgeMenuOpen: boolean = false;
  @Input() isUserBadgeMenuAnimating: boolean = false;

  @Output() closeMenu = new EventEmitter<void>();

  readonly userNavigationLinks: NavigationLinksInterface[] = [
    { label: 'userProfile', path: '/user-profile', icon: 'user_profile' },
    { label: 'accountSettings', path: '/account-settings', icon: 'account_settings' },
    { label: 'avatarSettings', path: '/avatar-settings', icon: 'avatar_settings' },
    { label: 'appSettings', path: '/app-settings', icon: 'app_settings' },
  ];

  constructor(
    public readonly authService: AuthService,
    public readonly logoutService: LogoutService,
    public readonly svgIconsService: SvgIconsService,
  ) {}

  /**
   * Get the link path for a given navigation link and user
   *
   * @param link
   * @param user
   * @returns
   */
  getLinkPath(link: { path: string }, user: UserInterface): (string | number)[] {
    return link.path === '/user-profile' ? [link.path, user.id] : [link.path];
  }

  /**
   * Handle close event from parent component
   * triggered onAnimationEnd when animated out
   */
  onClose(): void {
    this.isUserBadgeMenuAnimating = false;
  }

  /**
   * Handle animation end events
   *
   * @param event
   */
  onAnimationEnd(event: AnimationEvent): void {
    if (event.animationName.endsWith('animated-out')) {
      this.closeMenu.emit();
    }
  }
}
