import { Component } from '@angular/core';

import { TechBlock } from '../../components/tech-block/tech-block';
import { GuestTeaserPrompt } from '../../components/guest-teaser-prompt/guest-teaser-prompt';

import { AuthService } from '../../services/auth.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-community',
  imports: [TechBlock, GuestTeaserPrompt],
  templateUrl: './community.html',
  styleUrl: './community.scss',
})
export class Community {
  searchActive: boolean = false;
  searchResultsLoaded: boolean = false;

  constructor(
    public authService: AuthService,
    private searchService: SearchService,
  ) {}

  ngOnInit() {
    this.ngOnChanges();
  }

  ngOnChanges() {
    this.searchService.searchValue.subscribe((inputValue) => {
      this.searchActive = inputValue.length > 0;
      if (this.searchActive && !this.searchResultsLoaded) {
        this.searchResultsLoaded = true;
      }
    });
  }
}
