import { Component, Input } from '@angular/core';

import type { LanguagesInterface } from '../../../../interfaces/languages';
import type { TechnologiesInterface } from '../../../../interfaces/technologies';

import { SvgIconsService } from '../../../../services/svg.icons.service';

@Component({
  selector: 'app-post-tech-stack',
  imports: [],
  templateUrl: './post-tech-stack.html',
  styleUrl: './post-tech-stack.scss',
})
export class PostTechStack {
  @Input() languages: LanguagesInterface[] = [];
  @Input() technologies: TechnologiesInterface[] = [];

  constructor(public svgIconsService: SvgIconsService) {}

  /**
   * TODO: Implement search function for languages and technologies
   */
  searchPlaceholderFunction(item: LanguagesInterface | TechnologiesInterface) {
    console.log('Search function not implemented yet for item:', item);
  }
}
