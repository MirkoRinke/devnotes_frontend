import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { LanguagesInterface } from '../../../interfaces/languages';
import type { TechnologiesInterface } from '../../../interfaces/technologies';

import { SvgIconsService } from '../../../services/svg.icons.service';

@Component({
  selector: 'app-post-tech-stack',
  imports: [RouterLink],
  templateUrl: './post-tech-stack.html',
  styleUrl: './post-tech-stack.scss',
})
export class PostTechStack {
  @Input() context: string | null = null;
  @Input() endPoint: string | null = null;

  @Input() selectedPostType: string | null = null;

  @Input() languages: LanguagesInterface[] = [];
  @Input() technologies: TechnologiesInterface[] = [];

  constructor(public svgIconsService: SvgIconsService) {}
}
