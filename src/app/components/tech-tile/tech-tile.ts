import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { AvailableValuesInterface } from '../../interfaces/available-values';

import { SvgIconsService } from '../../services/svg.icons.service';

@Component({
  selector: 'app-tech-tile',
  imports: [RouterLink],
  templateUrl: './tech-tile.html',
  styleUrl: './tech-tile.scss',
})
export class TechTile {
  @Input() tile!: AvailableValuesInterface;
  @Input() endPoint!: string;
  @Input() context?: string;

  constructor(public svgIconsService: SvgIconsService) {}
}
