import { Component } from '@angular/core';

import { CreatorLinks } from '../contact/creator-links/creator-links';
import { Copyright } from '../copyright/copyright';
import { LegalLinks } from '../legal-links/legal-links';

@Component({
  selector: 'app-footer',
  imports: [CreatorLinks, Copyright, LegalLinks],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  constructor() {}
}
