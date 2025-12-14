import { Component } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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

  private destroy$ = new Subject<void>();

  constructor(
    public authService: AuthService,
    private searchService: SearchService,
  ) {}

  ngOnInit() {
    this.searchResult();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  searchResult() {
    this.searchService.searchValue.pipe(takeUntil(this.destroy$)).subscribe((inputValue) => {
      this.searchActive = inputValue.length > 0;
      if (this.searchActive && !this.searchResultsLoaded) {
        this.searchResultsLoaded = true;
      }
    });
  }
}
