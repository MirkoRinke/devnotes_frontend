import { Component } from '@angular/core';
import { SvgIconsService } from '../../services/svg.icons.service';

import { TranslatePipe } from '../../i18n/translate-pipe';

@Component({
  selector: 'app-copyright',
  imports: [TranslatePipe],
  templateUrl: './copyright.html',
  styleUrl: './copyright.scss',
})
export class Copyright {
  constructor(public readonly svgIconsService: SvgIconsService) {}

  public readonly currentYear = new Date().getFullYear();
}
