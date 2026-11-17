import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TechBlock } from '../../components/tech-block/tech-block';
import { ActionPlaceholder } from '../../components/action-placeholder/action-placeholder';

import { TranslatePipe } from '../../i18n/translate-pipe';

import { BaseTechListPage } from '../../utils/base-tech-list-page';

@Component({
  selector: 'app-favorites',
  imports: [TechBlock, ActionPlaceholder, CommonModule, TranslatePipe],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class Favorites extends BaseTechListPage {
  public override readonly endPoint = 'FAVORITE_POSTS' as const;

  private readonly cacheTTL = 10;

  protected override buildParams(): { languages: Array<string>; technologies: Array<string> } {
    return {
      languages: [`?select=count:languages.name&cacheTTL=${this.cacheTTL}`],
      technologies: [`?select=count:technologies.name&cacheTTL=${this.cacheTTL}`],
    };
  }
}
