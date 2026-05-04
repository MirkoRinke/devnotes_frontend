import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { LanguagesInterface } from '../../../interfaces/languages';
import type { TechnologiesInterface } from '../../../interfaces/technologies';

import { SvgIconsService } from '../../../services/svg.icons.service';

import type { PostParamsInterface } from '../../../interfaces/post-params';

@Component({
  selector: 'app-post-tech-stack',
  imports: [RouterLink],
  templateUrl: './post-tech-stack.html',
  styleUrl: './post-tech-stack.scss',
})
export class PostTechStack {
  @Input() context: PostParamsInterface['context'] = null;
  @Input() endPoint: PostParamsInterface['endPoint'] = null;
  @Input() selectedPostType: PostParamsInterface['selectedPostType'] = null;

  @Input() languages: LanguagesInterface[] = [];
  @Input() technologies: TechnologiesInterface[] = [];

  @Input() isViewMode = true;

  constructor(public svgIconsService: SvgIconsService) {}
}
