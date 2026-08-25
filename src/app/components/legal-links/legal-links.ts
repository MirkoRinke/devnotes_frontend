import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { TranslatePipe } from '../../i18n/translate-pipe';

import type { NavigationLinksInterface } from '../../interfaces/navigation-links';

@Component({
  selector: 'app-legal-links',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './legal-links.html',
  styleUrl: './legal-links.scss',
})
export class LegalLinks {
  public readonly navigationLinks: NavigationLinksInterface[] = [
    { label: 'terms', path: '/legal/terms' },
    { label: 'privacy', path: '/legal/privacy' },
    { label: 'imprint', path: '/legal/imprint' },
  ];
}
