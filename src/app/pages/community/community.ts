import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { TechBlock } from '../../components/tech-block/tech-block';
import { GuestTeaserPrompt } from '../../components/guest-teaser-prompt/guest-teaser-prompt';

import { AuthService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';
import { UserFavoriteTechnologiesService } from '../../services/user-favorite-technologies.service';

import { ApiEndpointEnums } from '../../enums/api-endpoint';
import { PageContextEnums } from '../../enums/context';

@Component({
  selector: 'app-community',
  imports: [TechBlock, GuestTeaserPrompt, CommonModule],
  templateUrl: './community.html',
  styleUrl: './community.scss',
})
export class Community {
  favoriteTechStack: Array<string> = [];

  readonly PageContextEnums = PageContextEnums;

  private destroy$ = new Subject<void>();

  endPoint: keyof typeof ApiEndpointEnums = 'POSTS';

  languagesTechnologies: Array<string> = [];
  languages: Array<string> = [];
  technologies: Array<string> = [];

  constructor(
    public authService: AuthService,
    public searchService: SearchService,
    private userFavoriteTechnologiesService: UserFavoriteTechnologiesService,
  ) {}

  ngOnInit() {
    this.setParams();
    this.searchService.cageIcon('tiles');
    this.searchService.enableSearch(true);

    this.getUserFavoriteTechStack();
    this.userFavoriteTechnologiesService.clearFavoriteUpdate();
  }

  ngOnDestroy() {
    this.searchService.enableSearch(false);
    this.destroy$.next();
    this.destroy$.complete();
  }

  setParams() {
    this.languagesTechnologies = ['?select=count:languages.name&filter[status]=eq:published', '?select=count:technologies.name&filter[status]=eq:published'];
    this.languages = ['?select=count:languages.name&filter[status]=eq:published'];
    this.technologies = ['?select=count:technologies.name&filter[status]=eq:published'];
  }

  /**
   * Fetches the user's favorite tech stack from the service.
   */
  private getUserFavoriteTechStack() {
    this.userFavoriteTechnologiesService.favoriteTechStack$.pipe(takeUntil(this.destroy$)).subscribe((stack) => {
      this.favoriteTechStack = stack;
    });
    this.userFavoriteTechnologiesService.loadFavoriteTechStack();
  }
}
