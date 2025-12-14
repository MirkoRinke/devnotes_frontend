import { Component } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

import { SvgIconsService } from '../../services/svg.icons.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  imports: [],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search {
  inputFeldVisible: boolean = false;
  dataLoaded: boolean = false;

  private destroy$ = new Subject<void>();

  constructor(
    public svgIconsService: SvgIconsService,
    public searchService: SearchService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationStart),
        takeUntil(this.destroy$),
      )
      .subscribe(() => {
        this.inputFeldVisible = false;
        this.searchService.clear();
      });
    this.dataLoadedComplete();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Toggle the visibility of the search input field
   */
  toggleInputFeld() {
    this.inputFeldVisible = !this.inputFeldVisible;
    this.searchService.enableLoad();
    if (!this.inputFeldVisible) {
      this.searchService.clear();
    }
  }

  /**
   * Handle search input changes
   *
   * @param inputValue
   */
  handelSearch(inputValue: string) {
    this.searchService.searchValueInput(inputValue);
  }

  /**
   * Subscribe to dataLoaded observable to update local dataLoaded state
   */
  dataLoadedComplete() {
    this.searchService.dataLoaded.pipe(takeUntil(this.destroy$)).subscribe((loaded) => {
      this.dataLoaded = loaded;
    });
  }
}
