import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TechBlock } from '../../components/tech-block/tech-block';
import { ActionPlaceholder } from '../../components/action-placeholder/action-placeholder';

import { AuthService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
import { UserFavoriteTechnologiesService } from '../../services/user-favorite-technologies.service';

import { TranslatePipe } from '../../i18n/translate-pipe';

import { ApiEndpointEnums } from '../../enums/api-endpoint';
import { PageContextEnums } from '../../enums/context';

@Component({
  selector: 'app-my-area',
  imports: [TechBlock, ActionPlaceholder, CommonModule, TranslatePipe],
  templateUrl: './my-area.html',
  styleUrl: './my-area.scss',
})
export class MyArea implements OnInit, OnDestroy {
  public readonly PageContextEnums = PageContextEnums;

  public readonly endPoint: keyof typeof ApiEndpointEnums = 'USER_POSTS';

  public languagesTechnologies: Array<string> = [];
  public languages: Array<string> = [];
  public technologies: Array<string> = [];
  private readonly cacheTTL = 10;

  public hasAvailableData: boolean | null = null;
  private hasLanguages: boolean | null = null;
  private hasTechnologies: boolean | null = null;

  constructor(
    public readonly authService: AuthService,
    public readonly searchService: SearchService,
    private readonly userFavoriteTechnologiesService: UserFavoriteTechnologiesService,
  ) {}

  ngOnInit(): void {
    this.setParams();
    this.searchService.cageIcon('tiles');
    this.enableSearch();
    this.userFavoriteTechnologiesService.clearFavoriteUpdate();
  }

  ngOnDestroy(): void {
    this.searchService.enableSearch(false);
  }

  /**
   * Enables or disables the search functionality based on the availability of data.
   * Default: Search is enabled when the user loads the page for the first time,
   * and will be disabled only if the TechBlock component explicitly emits
   * an event indicating that no data is available.
   */
  private enableSearch(): void {
    if (this.hasAvailableData !== false) {
      this.searchService.enableSearch(true);
    } else {
      this.searchService.enableSearch(false);
    }
  }

  /**
   * Handles the event emitted by the TechBlock component to update the hasAvailableData property, which
   * determines whether to display the user's posts or a message indicating that no posts are available.
   *
   * @param hasData
   * @param dataType
   */
  public handleHasAvailableData(hasData: boolean, dataType: 'languages' | 'technologies'): void {
    if (dataType === 'languages') {
      this.hasLanguages = hasData;
    } else if (dataType === 'technologies') {
      this.hasTechnologies = hasData;
    }

    this.hasAvailableData = this.hasLanguages || this.hasTechnologies;

    this.enableSearch();
  }

  /**
   * Set the parameters for the API calls to fetch the user's languages and technologies, including a cache TTL to optimize performance.
   */
  private setParams(): void {
    const userId = this.authService.getCurrentUserId();
    this.languages = [`?select=count:languages.name&filter[user_id]=eq:${userId}&cacheTTL=${this.cacheTTL}`];
    this.technologies = [`?select=count:technologies.name&filter[user_id]=eq:${userId}&cacheTTL=${this.cacheTTL}`];
    this.languagesTechnologies = [...this.languages, ...this.technologies];
  }
}
