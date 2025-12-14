import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  searchValue = new BehaviorSubject<string>('');
  loadSearchResults = new BehaviorSubject<boolean>(false);
  dataLoaded = new BehaviorSubject<boolean>(false);

  /**
   * Set search value
   *
   * @param value
   */
  searchValueInput(value: string) {
    this.searchValue.next(value);
  }

  /**
   * Clear search data and enable loading of search results
   */
  clear() {
    this.searchValue.next('');
    this.loadSearchResults.next(false);
  }

  /**
   * Enable loading of search results
   */
  enableLoad() {
    this.loadSearchResults.next(true);
  }

  /**
   * Clear data loaded state
   */
  clearDataLoaded() {
    this.dataLoaded.next(false);
  }

  /**
   * Mark data as loaded
   */
  dataLoadedComplete() {
    this.dataLoaded.next(true);
  }
}
