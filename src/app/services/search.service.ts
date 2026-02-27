import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import type { Params } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class SearchService {
  private _searchValue = new BehaviorSubject<string | null>(null);
  private _showSearchResults = new BehaviorSubject<boolean>(false);
  private _dataLoaded = new BehaviorSubject<boolean>(false);
  private _enableSearch = new BehaviorSubject<boolean>(false);
  private _searchActive = new BehaviorSubject<boolean>(false);

  private _searchMode = new BehaviorSubject<string | null>(null);
  private _cageIcon = new BehaviorSubject<string | null>(null);

  private _splitSearchValueInput = new BehaviorSubject<{ tags: string[] | null; text: string } | null>(null);

  searchValue$ = this._searchValue.asObservable();
  showSearchResults$ = this._showSearchResults.asObservable();
  dataLoaded$ = this._dataLoaded.asObservable();
  enableSearch$ = this._enableSearch.asObservable();
  searchActive$ = this._searchActive.asObservable();

  searchMode$ = this._searchMode.asObservable();
  cageIcon$ = this._cageIcon.asObservable();
  splitSearchValueInput$ = this._splitSearchValueInput.asObservable();

  constructor(private router: Router) {}

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
    if (this._searchValue.getValue() === value) return;
    this._searchValue.next(value);
    this.splitSearchValueInput(value);
    this.setSearchActive(value !== null && value.length > 0);
    this.updateUrlParameters(value);
  }

  /**
   * Split search value into tags and text
   *
   * @param value
   */
  splitSearchValueInput(value: string | null) {
    const tags = value?.match(/#[\w-]+/g)?.map((t) => t.substring(1)) || null;
    const text = value?.replace(/#[\w-]+/g, '').trim() || '';
    this._splitSearchValueInput.next({ tags, text });
  }

  /**
   * Initialize search value from URL parameters
   *
   * @param params
   */
  syncFromParameters(params: Params) {
    const term = params['searchTerm'] || null;
    this.searchValueInput(term);
  }

  /**
   * Update URL parameters with current search value
   *
   * @param inputValue
   * @returns
   */
  updateUrlParameters(inputValue: string | null) {
    if (this._searchMode.getValue() === null) return;

    const currentUrlTree = this.router.parseUrl(this.router.url);
    const currentUrlValue = currentUrlTree.queryParams['searchTerm'] || null;

    const newValue = inputValue && inputValue.length > 0 ? inputValue : null;

    if (newValue !== currentUrlValue) {
      this.router.navigate([], {
        queryParams: { searchTerm: newValue, page: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  }

  /**
   * Get current search value
   */
  get splitSearchValueInputValue(): { tags: string[] | null; text: string } | null {
    return this._splitSearchValueInput.getValue();
  }

  /**
   * Set search mode
   *
   * @param mode
   */
  searchMode(mode: string | null) {
    this._searchMode.next(mode);
  }

  /**
   * Set Cage icon
   *
   * @param icon
   */
  cageIcon(icon: string | null) {
    this._cageIcon.next(icon);
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
    this.searchValueInput(null);
    this.showSearchResults(false);
    this.setSearchActive(false);
    this.dataLoaded(false);

    this.searchMode(null);
    this.cageIcon(null);
  }
}
