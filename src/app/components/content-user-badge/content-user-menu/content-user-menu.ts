import { Component, Input, Output, EventEmitter } from '@angular/core';
import { RouterModule } from '@angular/router';

import { RovingFocusDirective } from '../../../directives/roving-focus.directive';

import { TranslatePipe } from '../../../i18n/translate-pipe';

import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

import type { UserInterface } from '../../../interfaces/user';

import { ApiEndpointEnums } from '../../../enums/api-endpoint';

@Component({
  selector: 'app-content-user-menu',
  imports: [RouterModule, TranslatePipe, RovingFocusDirective],
  templateUrl: './content-user-menu.html',
  styleUrl: './content-user-menu.scss',
})
export class ContentUserMenu {
  @Input() user: UserInterface | null = null;
  @Input() menuId: string = '';

  @Input() menuOpen: boolean = false;
  @Input() menuAnimating: boolean = false;

  @Output() closeMenu = new EventEmitter<void>();
  @Output() openReportModal = new EventEmitter<void>();

  public isProcessingFollow: boolean = false;

  constructor(
    public readonly authService: AuthService,
    private readonly apiService: ApiService,
  ) {}

  /**
   * Handle close event from parent component
   * triggered onAnimationEnd when animated out
   */
  public onClose(): void {
    this.menuAnimating = false;
  }

  /**
   * Handle animation end events
   *
   * @param event
   */
  public onAnimationEnd(event: AnimationEvent): void {
    if (event.animationName.endsWith('animated-out')) {
      this.closeMenu.emit();
    }
  }

  /**
   * Toggle follow/unfollow user and update the UI accordingly.
   */
  public toggleFollowUser(user: UserInterface): void {
    /**
     * Prevent multiple follow/unfollow requests and ensure user is logged in
     */
    if (this.isProcessingFollow || !this.authService.isLoggedIn()) {
      return;
    }

    this.isProcessingFollow = true;

    const url = user.is_following ? `${ApiEndpointEnums.UNFOLLOW_USER}${user.id}` : `${ApiEndpointEnums.FOLLOW_USER}${user.id}`;

    const method: 'delete' | 'post' = user.is_following ? 'delete' : 'post';

    user.is_following = !user.is_following;

    this.apiService[method](url).subscribe({
      next: () => {
        this.isProcessingFollow = false;
      },
      error: () => {
        user.is_following = !user.is_following;
        this.isProcessingFollow = false;
      },
    });
  }

  /**
   * Open the report user modal by emitting an event to the parent component.
   */
  public reportUser(): void {
    this.openReportModal.emit();
  }

  /**
   * Check if the current logged-in user is the user of the badge
   *
   * @param user
   * @returns
   */
  public isOwner(user: UserInterface | null): boolean {
    return this.authService.isOwner(user?.id ?? null);
  }

  /**
   * Check if the user is logged in
   *
   * @returns
   */
  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }
}
