import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TechBlock } from '../../components/tech-block/tech-block';
import { ActionPlaceholder } from '../../components/action-placeholder/action-placeholder';

import { TranslatePipe } from '../../i18n/translate-pipe';

import { BaseTechListPage } from '../../utils/base-tech-list-page';

@Component({
  selector: 'app-my-area',
  imports: [TechBlock, ActionPlaceholder, CommonModule, TranslatePipe],
  templateUrl: './my-area.html',
  styleUrl: './my-area.scss',
})
export class MyArea extends BaseTechListPage {
  public override readonly endPoint = 'USER_POSTS' as const;

  private readonly cacheTTL = 10;

  protected override buildParams(): { languages: Array<string>; technologies: Array<string> } {
    const userId = this.authService.getCurrentUserId();
    return {
      languages: [`?select=count:languages.name&filter[user_id]=eq:${userId}&cacheTTL=${this.cacheTTL}`],
      technologies: [`?select=count:technologies.name&filter[user_id]=eq:${userId}&cacheTTL=${this.cacheTTL}`],
    };
  }
}
