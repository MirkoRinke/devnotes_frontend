import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SvgIconsService } from '../../services/svg.icons.service';

@Component({
  selector: 'app-action-placeholder',
  imports: [RouterModule],
  templateUrl: './action-placeholder.html',
  styleUrl: './action-placeholder.scss',
})
export class ActionPlaceholder {
  @Input() title: string | null = null;
  @Input() message: string[] | null = null;
  @Input() buttonText: string | null = null;
  @Input() buttonLink: string | null = null;
  @Input() returnIcon: string | null = null;

  constructor(public svgIconsService: SvgIconsService) {}
}
