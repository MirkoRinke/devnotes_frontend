import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SvgIconsService } from '../../services/svg.icons.service';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  constructor(public svgIconsService: SvgIconsService) {}

  currentYear = new Date().getFullYear();
}
