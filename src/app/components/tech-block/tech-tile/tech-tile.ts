import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { AvailableValuesInterface } from '../../../interfaces/available-values';

import { UserFavoriteTechnologiesService } from '../../../services/user-favorite-technologies.service';
import { SvgIconsService } from '../../../services/svg.icons.service';
import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

import { TranslatePipe } from '../../../i18n/translate-pipe';

import { ApiEndpointEnums } from '../../../enums/api-endpoint';
import { PageContextEnums } from '../../../enums/context';

@Component({
  selector: 'app-tech-tile',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './tech-tile.html',
  styleUrl: './tech-tile.scss',
})
export class TechTile {
  @Input() context: PageContextEnums | null = null;
  @Input() endPoint: keyof typeof ApiEndpointEnums | null = null;

  @Input() tile: AvailableValuesInterface | null = null;

  private favoriteTechStack: Array<string> = [];

  private isProcessingFavorites = false;
  public isFavorite: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    public readonly svgIconsService: SvgIconsService,
    private readonly userFavoriteTechnologiesService: UserFavoriteTechnologiesService,
    private readonly apiService: ApiService,
    public readonly authService: AuthService,
  ) {}

  ngOnInit() {
    this.getUserFavoriteTechStack();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Checks if the current tile is in the user's favorite tech stack.
   *
   * @returns
   */
  private isFavoriteTech(): boolean {
    return this.favoriteTechStack.includes(this.tile?.name ?? '');
  }

  public toggleFavorite(event: MouseEvent, tile: AvailableValuesInterface): void {
    event.preventDefault();
    /**
     * Prevent multiple favorite/unfavorite requests and ensure user is logged in
     */
    if (this.isProcessingFavorites || !this.authService.isLoggedIn()) {
      return;
    }

    this.isProcessingFavorites = true;

    const url = `${ApiEndpointEnums.FAVORITE_TECH_STACK}${this.authService.getCurrentUserId()}`;

    const wasFavorite = this.isFavorite;

    let data = {
      /**
       * If the tile is currently not a favorite, we add it to the stack. If it is already a favorite, we remove it from the stack.
       */
      favorite_techs: wasFavorite ? this.favoriteTechStack.filter((name) => name !== tile.name) : [...this.favoriteTechStack, tile.name],
    };

    this.updateLocalState(tile.name, wasFavorite);

    this.apiService.patch(url, data).subscribe({
      next: (response) => {
        this.isProcessingFavorites = false;
      },
      error: (error) => {
        this.updateLocalState(tile.name, !wasFavorite);
        this.isProcessingFavorites = false;
      },
    });
  }

  /**
   * Updates the favorite state in the service and triggers the UI update.
   * Used for optimistic updates and rollbacks.
   *
   * @param techName The name of the technology being updated
   * @param isCurrentlyFavorite Whether the technology is currently a favorite (before the update)
   */
  private updateLocalState(techName: string, isCurrentlyFavorite: boolean): void {
    if (isCurrentlyFavorite) {
      this.userFavoriteTechnologiesService.removeTechFromFavoriteStack(techName);
    } else {
      this.userFavoriteTechnologiesService.addTechToFavoriteStack(techName);
    }
    this.userFavoriteTechnologiesService.favoriteUpdate(techName);
  }

  /**
   * Fetches the user's favorite tech stack from the service.
   */
  private getUserFavoriteTechStack(): void {
    this.userFavoriteTechnologiesService.favoriteTechStack$.pipe(takeUntil(this.destroy$)).subscribe((stack) => {
      this.favoriteTechStack = stack;
      this.isFavorite = this.isFavoriteTech();
    });
  }
}
