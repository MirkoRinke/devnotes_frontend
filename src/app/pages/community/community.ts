import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TechBlock } from '../../components/tech-block/tech-block';
import { ActionPlaceholder } from '../../components/action-placeholder/action-placeholder';

import { TranslatePipe } from '../../i18n/translate-pipe';

import { BaseTechListPage } from '../../utils/base-tech-list-page';

@Component({
  selector: 'app-community',
  imports: [TechBlock, ActionPlaceholder, CommonModule, TranslatePipe],
  templateUrl: './community.html',
  styleUrl: './community.scss',
})
export class Community extends BaseTechListPage {
  public override readonly endPoint = 'POSTS' as const;

  protected override buildParams(): { languages: Array<string>; technologies: Array<string> } {
    return {
      languages: ['?select=count:languages.name&filter[status]=eq:published'],
      technologies: ['?select=count:technologies.name&filter[status]=eq:published'],
    };
  }
}
