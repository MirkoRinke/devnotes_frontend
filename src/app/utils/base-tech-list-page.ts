import { Directive, OnDestroy, OnInit, inject } from '@angular/core';

import { UserFavoriteTechnologiesService } from '../services/user-favorite-technologies.service';
import { SearchService } from '../services/search.service';
import { AuthService } from '../services/auth.service';

import { ApiEndpointEnums } from '../enums/api-endpoint';
import { PageContextEnums } from '../enums/context';

@Directive()
export abstract class BaseTechListPage implements OnInit, OnDestroy {
  public readonly PageContextEnums = PageContextEnums;
  public abstract readonly endPoint: keyof typeof ApiEndpointEnums;

  public languages: Array<string> = [];
  public technologies: Array<string> = [];
  public languagesTechnologies: Array<string> = [];

  public hasAvailableData: boolean | null = null;
  private hasLanguages: boolean | null = null;
  private hasTechnologies: boolean | null = null;

  public readonly authService = inject(AuthService);
  public readonly searchService = inject(SearchService);
  protected readonly userFavoriteTechnologiesService = inject(UserFavoriteTechnologiesService);

  /**
   * Provides the API params for the languages and technologies blocks.
   * Called once in ngOnInit, so injected services are safe to use here.
   */
  protected abstract buildParams(): { languages: Array<string>; technologies: Array<string> };

  public ngOnInit(): void {
    this.setParams();
    this.searchService.cageIcon('tiles');
    this.enableSearch();
    this.userFavoriteTechnologiesService.clearFavoriteUpdate();
  }

  public ngOnDestroy(): void {
    this.searchService.enableSearch(false);
  }

  /**
   * Stores the params from buildParams() and combines them for the shared blocks (favorites / search results).
   */
  private setParams(): void {
    const { languages, technologies } = this.buildParams();
    this.languages = languages;
    this.technologies = technologies;
    this.languagesTechnologies = [...languages, ...technologies];
  }

  /**
   * Enables or disables the search functionality based on the availability of data.
   * Default: Search is enabled when the user loads the page for the first time,
   * and will be disabled only if the TechBlock component explicitly emits
   * an event indicating that no data is available.
   */
  private enableSearch(): void {
    this.searchService.enableSearch(this.hasAvailableData !== false);
  }

  /**
   * Handles the availability of data for languages or technologies.
   *
   * @param hasData Indicates whether there is available data.
   * @param dataType Specifies the type of data ('languages' or 'technologies').
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
}
