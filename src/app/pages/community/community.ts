import { Component } from '@angular/core';
import { TechBlock } from '../../components/tech-block/tech-block';

import { AuthService } from '../../services/auth.service';
import { GuestTeaserPrompt } from '../../components/guest-teaser-prompt/guest-teaser-prompt';

@Component({
  selector: 'app-community',
  imports: [TechBlock, GuestTeaserPrompt],
  templateUrl: './community.html',
  styleUrl: './community.scss',
})
export class Community {
  constructor(public authService: AuthService) {}
}
