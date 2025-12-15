import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TechBlock } from '../../components/tech-block/tech-block';
import { GuestTeaserPrompt } from '../../components/guest-teaser-prompt/guest-teaser-prompt';

import { AuthService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-community',
  imports: [TechBlock, GuestTeaserPrompt, CommonModule],
  templateUrl: './community.html',
  styleUrl: './community.scss',
})
export class Community {
  constructor(
    public authService: AuthService,
    public searchService: SearchService,
  ) {}

  ngOnInit() {
    this.searchService.enableSearch(true);
  }

  ngOnDestroy() {
    this.searchService.enableSearch(false);
  }
}
