import { Component } from '@angular/core';

import { UserFavoriteTechnologiesService } from '../../../services/user-favorite-technologies.service';
import { SvgIconsService } from '../../../services/svg.icons.service';

import { TranslatePipe } from '../../../i18n/translate-pipe';

@Component({
  selector: 'app-favorites-refresh-button',
  imports: [TranslatePipe],
  templateUrl: './favorites-refresh-button.html',
  styleUrl: './favorites-refresh-button.scss',
})
export class FavoritesRefreshButton {
  constructor(
    private readonly userFavoriteTechnologiesService: UserFavoriteTechnologiesService,
    public readonly svgIconsService: SvgIconsService,
  ) {}

  public refreshFeedbackAnimation: boolean = false;

  /**
   * Clears the favorite update stack and triggers the refresh animation for visual feedback.
   */
  public clearFavoriteUpdate(): void {
    this.userFavoriteTechnologiesService.clearFavoriteUpdate();
    this.refreshFeedbackAnimation = true;
  }

  /**
   * Handle animation end events
   *
   * @param event
   */
  public onAnimationEnd(event: AnimationEvent): void {
    if (event.animationName.endsWith('spin-refresh')) {
      this.refreshFeedbackAnimation = false;
    }
  }
}
