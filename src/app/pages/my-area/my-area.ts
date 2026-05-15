import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TechBlock } from '../../components/tech-block/tech-block';
import { ActionPlaceholder } from '../../components/action-placeholder/action-placeholder';

import { AuthService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
import { UserFavoriteTechnologiesService } from '../../services/user-favorite-technologies.service';

import { ApiEndpointEnums } from '../../enums/api-endpoint';
import { PageContextEnums } from '../../enums/context';

@Component({
  selector: 'app-my-area',
  imports: [TechBlock, ActionPlaceholder, CommonModule],
  templateUrl: './my-area.html',
  styleUrl: './my-area.scss',
})
export class MyArea {
  readonly PageContextEnums = PageContextEnums;

  endPoint: keyof typeof ApiEndpointEnums = 'USER_POSTS';

  languagesTechnologies: Array<string> = [];
  languages: Array<string> = [];
  technologies: Array<string> = [];
  cacheTTL = 10;

  hasAvailableData: boolean | null = null;
  hasLanguages: boolean | null = null;
  hasTechnologies: boolean | null = null;

  constructor(
    public authService: AuthService,
    public searchService: SearchService,
    private userFavoriteTechnologiesService: UserFavoriteTechnologiesService,
  ) {}

  ngOnInit() {
    this.setParams();
    this.searchService.cageIcon('tiles');
    this.enableSearch();
    this.userFavoriteTechnologiesService.clearFavoriteUpdate();
  }

  ngOnDestroy() {
    this.searchService.enableSearch(false);
  }

  /**
   * Enables or disables the search functionality based on the availability of data.
   * Default: Search is enabled when the user loads the page for the first time,
   * and will be disabled only if the TechBlock component explicitly emits
   * an event indicating that no data is available.
   */
  enableSearch() {
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
  handleHasAvailableData(hasData: boolean, dataType: 'languages' | 'technologies') {
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
  setParams() {
    const userId = this.authService.getCurrentUserId();
    this.languages = [`?select=count:languages.name&filter[user_id]=eq:${userId}&cacheTTL=${this.cacheTTL}`];
    this.technologies = [`?select=count:technologies.name&filter[user_id]=eq:${userId}&cacheTTL=${this.cacheTTL}`];
    this.languagesTechnologies = [...this.languages, ...this.technologies];
  }
}
