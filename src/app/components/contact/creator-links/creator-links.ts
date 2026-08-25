import { Component } from '@angular/core';
import { SvgIconsService } from '../../../services/svg.icons.service';

import { TranslatePipe } from '../../../i18n/translate-pipe';

import type { NavigationLinksInterface } from '../../../interfaces/navigation-links';

@Component({
  selector: 'app-creator-links',
  imports: [TranslatePipe],
  templateUrl: './creator-links.html',
  styleUrl: './creator-links.scss',
})
export class CreatorLinks {
  constructor(public readonly svgIconsService: SvgIconsService) {}

  public readonly creatorLinks: NavigationLinksInterface[] = [
    { label: 'portfolio', path: 'https://mirkorinke.dev/', icon: 'portfolio' },
    { label: 'github', path: 'https://github.com/MirkoRinke', icon: 'github' },
    { label: 'contact', path: 'mailto:contact@mirkorinke.dev', icon: 'contact' },
  ];
}
