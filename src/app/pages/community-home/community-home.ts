import { Component } from '@angular/core';
import { TechBlock } from '../../components/tech-block/tech-block';

import { AuthService } from '../../services/auth.service';
import { GuestTeaserPrompt } from '../../components/guest-teaser-prompt/guest-teaser-prompt';

@Component({
  selector: 'app-community-home',
  imports: [TechBlock, GuestTeaserPrompt],
  templateUrl: './community-home.html',
  styleUrl: './community-home.scss',
})
export class CommunityHome {
  constructor(public authService: AuthService) {}
}
