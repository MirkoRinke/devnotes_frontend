import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SvgIconsService } from '../../services/svg.icons.service';

import { TranslatePipe } from '../../i18n/translate-pipe';

import type { ActionPlaceholderFeaturesInterface } from '../../interfaces/action-placeholder';
@Component({
  selector: 'app-action-placeholder',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './action-placeholder.html',
  styleUrl: './action-placeholder.scss',
})
export class ActionPlaceholder {
  @Input({ required: true }) parentTranslatePathInput: string | null = null;
  @Input({ required: true }) features: ActionPlaceholderFeaturesInterface | null = null;

  @Input() returnIcon: string | null = null;
  @Input() buttonLink: string | null = null;

  constructor(public readonly svgIconsService: SvgIconsService) {}
}
