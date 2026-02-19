import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private _searchValue = new BehaviorSubject<string | null>(null);
  private _showSearchResults = new BehaviorSubject<boolean>(false);
  private _dataLoaded = new BehaviorSubject<boolean>(false);
  private _enableSearch = new BehaviorSubject<boolean>(false);
  private _searchActive = new BehaviorSubject<boolean>(false);

  searchValue$ = this._searchValue.asObservable();
  showSearchResults$ = this._showSearchResults.asObservable();
  dataLoaded$ = this._dataLoaded.asObservable();
  enableSearch$ = this._enableSearch.asObservable();
  searchActive$ = this._searchActive.asObservable();

  /**
   * Enable or disable search functionality
   *
   * @param enable
   */
  enableSearch(enable: boolean) {
    this._enableSearch.next(enable);
  }

  /**
   * Get current enableSearch value
   *
   * @returns
   */
  get enableSearchValue(): boolean {
    return this._enableSearch.getValue();
  }

  /**
   * Set search value
   *
   * @param value
   */
  searchValueInput(value: string | null) {
    this._searchValue.next(value);
    this.setSearchActive(value !== null && value.length > 0);
  }

  /**
   * Set search active state
   *
   * @param state
   */
  private setSearchActive(state: boolean) {
    this._searchActive.next(state);
  }

  /**
   * Load search results
   *
   * @param state
   */
  showSearchResults(state: boolean = true) {
    this._showSearchResults.next(state);
  }

  /**
   * Set data loaded state
   *
   * @param state
   */
  dataLoaded(state: boolean = true) {
    this._dataLoaded.next(state);
  }

  /**
   * Clear search state
   */
  clear() {
    this.searchValueInput('');
    this.showSearchResults(false);
    this.setSearchActive(false);
    this.dataLoaded(false);
  }
}
