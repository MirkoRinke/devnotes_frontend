import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SvgIconsService } from '../../services/svg.icons.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  imports: [CommonModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  @Input() active: boolean = false;

  constructor(
    public svgIconsService: SvgIconsService,
    public searchService: SearchService,
  ) {}
}
