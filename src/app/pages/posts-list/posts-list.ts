import { Component, HostListener, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { Subject, Subscription } from 'rxjs';
import { take, takeUntil, debounceTime } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { environment } from '../../../environments/environment';

import { PagePagination } from '../../components/page-pagination/page-pagination';
import { QueryParamsDropdown } from '../../components/query-params-dropdown/query-params-dropdown';
import { QueryParamsDatepicker } from '../../components/query-params-datepicker/query-params-datepicker';

import { ApiService } from '../../services/api.service';
import { AvailableValuesService } from '../../services/available-values.service';
import { SearchService } from '../../services/search.service';
import { AuthService } from '../../services/auth.service';

import { getCssVariableValue, getHeightById, getElementPositionFrom } from '../../utils/css-helper';
import { blurActiveElementInside } from '../../utils/dom-helper';

import type { ApiResponseArrayInterface } from '../../interfaces/api-response';
import type { PostInterface } from '../../interfaces/post';
import type { PaginationInfoInterface } from '../../interfaces/pagination-info';
import type { PostListParamsInterface } from '../../interfaces/post-list-params';
import type { Params } from '@angular/router';

import { ApiEndpointEnums } from '../../enums/api-endpoint';
import { PostListAllowedEntitiesEnums } from '../../enums/post-list-allowed-entities';
import { RegexEnums } from '../../enums/regex';

import { PostListElement } from '../../components/post-list-element/post-list-element';

@Component({
  selector: 'app-posts-list',
  imports: [PagePagination, QueryParamsDropdown, QueryParamsDatepicker, PostListElement],
  templateUrl: './posts-list.html',
  styleUrl: './posts-list.scss',
})
export class PostsList {
  context: PostListParamsInterface['context'] = null;
  endPoint: PostListParamsInterface['endPoint'] = null;
  selectedEntity: PostListParamsInterface['selectedEntity'] = null;
  selectedEntityValue: PostListParamsInterface['selectedEntityValue'] = null;
  selectedPostType: PostListParamsInterface['selectedPostType'] = null;

  selectedCategory: PostListParamsInterface['category'] = null;
  selectedDateFrom: PostListParamsInterface['dateFrom'] = null;
  selectedDateTo: PostListParamsInterface['dateTo'] = null;
  selectedSort: PostListParamsInterface['sort'] = null;

  today = new Date();
  minDate: string = environment.RELEASE_DATE;
  maxDate: string = this.today.getFullYear() + '-' + String(this.today.getMonth() + 1).padStart(2, '0') + '-' + String(this.today.getDate()).padStart(2, '0');

  selectedFields: string = 'id,title,category,likes_count,comments_count,created_at';

  entityValueParams: string[] = [];
  postTypeParams: string[] = [];
  categoryParams: string[] = [];

  postsList: PostInterface[] = [];
  paginationInfo: PaginationInfoInterface<PostInterface> = {} as PaginationInfoInterface<PostInterface>;

  perPage: number | null = null;
  postListContainer: ElementRef | null = null;

  currentUserId: number | null = null;

  @ViewChild('paginationRef', { read: ElementRef }) paginationRef!: ElementRef;

  private initialLoad = true;
  private resizeSub: Subscription | null = null;

  statusMessage: string | null = null;

  private resize$ = new Subject<void>();
  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private availableValuesService: AvailableValuesService,
    private searchService: SearchService,
    private cdr: ChangeDetectorRef,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.currentUserId = this.authService.getCurrentUserId();
    this.route.queryParams.subscribe((params) => {
      const parsed = this.parseQueryParams(params);

      if (!this.areParamsValid(parsed)) {
        this.router.navigate(['/']);
        console.warn('Missing or invalid query parameters. Redirecting to home page.');
        return;
      }

      const restrictedEndpoints = ['USER_POSTS', 'FAVORITE_POSTS'];
      if (parsed.endPoint && restrictedEndpoints.includes(parsed.endPoint) && this.currentUserId === null) {
        this.router.navigate(['/']);
        console.warn('User ID is not available. Redirecting to home page.');
        return;
      }

      this.setSelectedValues(parsed);
      this.setParams(parsed);

      this.initResizeSubscription(parsed);
      this.listElementsPerPage(parsed, true);

      this.searchService.syncFromParameters(params);
      this.searchService.cageIcon(parsed.selectedEntityValue);
    });
    this.searchService.searchMode('posts-list');
    this.searchService.enableSearch(true);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Parse query params
   *
   * @param params
   * @returns
   */
  private parseQueryParams(params: Params): PostListParamsInterface {
    return {
      context: params['context'] ?? null,
      endPoint: params['endPoint'] ?? null,
      selectedEntity: params['selectedEntity'] ?? null,
      selectedEntityValue: params['selectedEntityValue'] ?? null,
      selectedPostType: params['selectedPostType'] ?? null,
      category: params['category'] ?? null,
      dateFrom: params['dateFrom'] ?? null,
      dateTo: params['dateTo'] ?? null,
      status: params['status'] ?? null,
      sort: params['sort'] ?? '-created_at',
      searchTerm: params['searchTerm'] ?? null,
      page: Number.isInteger(parseInt(params['page'])) ? parseInt(params['page']) : 1,
      perPage: Number.isInteger(parseInt(params['per_page'])) ? parseInt(params['per_page']) : 5,
    };
  }

  /**
   * Check if parsed params are valid
   *
   * @param param0
   * @returns
   */
  private areParamsValid(parsed: PostListParamsInterface): boolean {
    return (
      (parsed.context === null || typeof parsed.context === 'string') &&
      parsed.endPoint !== null &&
      parsed.endPoint in ApiEndpointEnums &&
      parsed.selectedEntityValue !== null &&
      new RegExp(RegexEnums.entityValue).test(parsed.selectedEntityValue) &&
      Object.values(PostListAllowedEntitiesEnums).includes(parsed.selectedEntity as PostListAllowedEntitiesEnums) &&
      Number.isInteger(parsed.page) &&
      Number.isInteger(parsed.perPage) &&
      (parsed.selectedPostType === null || typeof parsed.selectedPostType === 'string') &&
      (parsed.category === null || typeof parsed.category === 'string') &&
      (parsed.dateFrom === null || new RegExp(RegexEnums.datepicker).test(parsed.dateFrom)) &&
      (parsed.dateTo === null || new RegExp(RegexEnums.datepicker).test(parsed.dateTo)) &&
      (parsed.status === null || typeof parsed.status === 'string') &&
      (parsed.sort === null || typeof parsed.sort === 'string') &&
      (parsed.searchTerm === null || typeof parsed.searchTerm === 'string')
    );
  }

  /**
   * Set selected values from parsed query params
   *
   * @param parsed
   */
  private setSelectedValues(parsed: PostListParamsInterface): void {
    this.context = parsed.context;
    this.endPoint = parsed.endPoint;
    this.selectedEntity = parsed.selectedEntity;
    this.selectedEntityValue = parsed.selectedEntityValue;
    this.selectedPostType = parsed.selectedPostType;
    this.selectedCategory = parsed.category;
    this.selectedSort = parsed.sort;
    this.selectedDateFrom = parsed.dateFrom;
    this.selectedDateTo = parsed.dateTo;
  }

  /**
   * Change detection value for dropdowns
   *
   * @returns
   */
  public changeDetectionValue(): string {
    return 'changeDetectionValues' + this.endPoint + this.selectedEntity + this.selectedEntityValue + this.selectedPostType + this.selectedCategory + this.selectedSort;
  }

  /**
   * Sets the reference to the container element and calculates the page size based on its width.
   *
   * @param element
   */
  @ViewChild('postListContainer') set postListContainerRef(element: ElementRef) {
    if (element) {
      this.postListContainer = element;
      requestAnimationFrame(() => {
        this.resize$.next();
      });
    }
  }

  /**
   * Handles window resize events.
   */
  @HostListener('window:resize')
  public onResize(): void {
    this.resize$.next();
  }

  /**
   * Initializes the resize subscription to handle window resize events.
   */
  private initResizeSubscription(parsed: PostListParamsInterface): void {
    if (this.resizeSub) {
      this.resizeSub.unsubscribe();
    }

    this.resizeSub = this.resize$.pipe(debounceTime(200), takeUntil(this.destroy$)).subscribe(() => {
      this.listElementsPerPage(parsed, false);
    });
  }

  /**
   * Calculates the number of list elements that can fit on the page based on the container size and updates the pagination accordingly.
   *
   * @param parsed The parsed query parameters
   * @param isNavigation Indicates if the calculation is triggered by navigation
   * @returns void
   */
  private listElementsPerPage(parsed: PostListParamsInterface, isNavigation: boolean = false): void {
    if (!this.postListContainer?.nativeElement) return;
    const container = this.postListContainer.nativeElement;

    /**
     * Window and Position
     */
    const windowHeight = window.innerHeight;
    const containerTop = getElementPositionFrom(container, 'top');

    /**
     * CSS Values (Single Source of Truth)
     */
    const style = getComputedStyle(container);

    const listElementSize = getCssVariableValue(style, '--list-element-max-height');
    const listGap = getCssVariableValue(style, '--posts-list-gap');
    const paginationHeight = getCssVariableValue(style, '--pagination-height');
    const footerHeight = getHeightById('app-footer');
    const buffer = getCssVariableValue(style, '--list-element-max-height');

    /**
     * Available height for the list: We take the window height and subtract the container's
     * distance from the top, the pagination height, the footer height and a buffer for safety.
     */
    const availableHeight = windowHeight - containerTop - paginationHeight - footerHeight - buffer;
    const targetHeight = Math.max(availableHeight, 1);

    /**
     *  The calculation: (Available Height + Gap) / (List Element Size + Gap)
     */
    const listElements = Math.max(1, Math.floor((targetHeight + listGap) / (listElementSize + listGap)));

    /**
     * snap PageSize is the value of perPage before the resize.
     */
    const snapPageSize = this.perPage;

    /**
     * Reset pagination to page 1 only if a resize actually changes the number of list elements,
     * to prevent invalid page states. This must not run during navigation or initial load.
     */
    if (!this.initialLoad && !isNavigation && snapPageSize !== listElements && parsed.page > 1) {
      this.router.navigate([], {
        queryParams: { page: 1 },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
      return;
    }

    this.perPage = listElements;

    if (snapPageSize !== listElements || this.initialLoad || isNavigation) {
      this.validateDropdownParams(parsed);
      this.initialLoad = false;
      this.cdr.detectChanges();
    }

    if (snapPageSize !== this.perPage) {
      blurActiveElementInside(container);
    }
  }

  /**
   * Fetch posts list from API
   *
   * @param entityValue The value of the entity
   * @param postType The type of the post
   * @param entity The entity type
   * @param page The page number
   * @param perPage The number of items per page
   * @param category The category filter
   * @param dateFrom The start date filter
   * @param dateTo The end date filter
   * @param sort The sort order
   */
  private getPostsList(parsed: PostListParamsInterface): void {
    if (!parsed.endPoint) return;

    const perPage = this.perPage ?? parsed.perPage;

    let params = new HttpParams().set('select', this.selectedFields).set('page', parsed.page.toString()).set('per_page', perPage.toString());
    if (parsed.selectedPostType) params = params.set('filter[post_type]', parsed.selectedPostType);
    if (parsed.selectedEntityValue) params = params.set(`filter[${parsed.selectedEntity}.name]`, `eq:${parsed.selectedEntityValue}`);
    if (parsed.category) params = params.set('filter[category]', `eq:${parsed.category}`);
    if (parsed.dateFrom || parsed.dateTo) params = params.set('filter[created_at]', `between:[${parsed.dateFrom ? parsed.dateFrom : this.minDate},${parsed.dateTo ? parsed.dateTo : this.maxDate}]`);
    if (parsed.sort) params = params.set('sort', `${parsed.sort}`);

    params = this.appendEndpointSpecificParams(params, parsed);

    const splitSearchData = this.searchService.splitSearchValueInputValue;
    if (splitSearchData?.text) params = params.set('filter[title]', splitSearchData.text);
    if (splitSearchData?.tags) params = params.set('filter[tags.name]', `eq:[${splitSearchData.tags.join(',')}]`);

    const options = { params };

    const url = ApiEndpointEnums[parsed.endPoint as keyof typeof ApiEndpointEnums] + '?' + options.params.toString();

    this.apiService.get<ApiResponseArrayInterface<PostInterface>>(url).subscribe({
      next: (response) => {
        this.postsList = response.data.data;
        this.paginationInfo = response.data as PaginationInfoInterface<PostInterface>;
        if (this.postsList.length === 0) {
          console.warn('No posts found for the selected criteria');
          this.statusMessage = 'Keine Beiträge gefunden.';
        }
        this.searchService.dataLoaded(true);
      },
      error: (error) => {
        console.error('Error fetching posts list:', error);
        this.statusMessage = 'Wir haben grade Probleme. Bitte versuche es später noch einmal.';
      },
    });
  }

  /**
   * Append endpoint specific filters to the query parameters based on the selected endpoint and other parameters.
   *
   * @param params
   * @param parsed
   * @returns
   */
  private appendEndpointSpecificParams(params: HttpParams, parsed: PostListParamsInterface): HttpParams {
    if (parsed.endPoint === 'POSTS') {
      return params.set('filter[status]', 'eq:published');
    }

    if (parsed.endPoint === 'USER_POSTS') {
      if (parsed.status) params = params.set('filter[status]', `eq:${parsed.status}`);
      if (this.currentUserId !== null) params = params.set('filter[user_id]', `eq:${this.currentUserId}`);
    }

    return params;
  }

  /**
   * Constructs the query strings for fetching available values for the dropdowns based on the selected entity, entity value, post type and endpoint.
   * These queries are used to validate the selected dropdown values against the available values from the API.
   *
   * @param parsed
   */
  private setParams(parsed: PostListParamsInterface): void {
    if (parsed.selectedEntity) {
      this.entityValueParams = [this.getEntityValueQuery(parsed.selectedEntity, parsed)];
      if (parsed.selectedEntityValue) {
        this.postTypeParams = [this.getPostTypeQuery(parsed.selectedEntity, parsed.selectedEntityValue, parsed)];
        this.categoryParams = [this.getCategoryQuery(parsed.selectedEntity, parsed.selectedEntityValue, parsed)];
      }
    }
  }

  /**
   * Construct the query for fetching available values for the entity value dropdown based on the selected entity and endpoint.
   *
   * @param entity The entity type
   * @param parsed The parsed parameters for the post list
   * @returns The query string for the entity value dropdown
   */
  private getEntityValueQuery(entity: PostListAllowedEntitiesEnums, parsed: PostListParamsInterface): string {
    let query = `?select=count:${encodeURIComponent(entity)}.name`;
    return query + this.getEndpointSpecificFilterQuery(parsed);
  }

  /**
   * Construct the query for fetching available values for the post type dropdown based on the selected entity, entity value and endpoint.
   *
   * @param entity The entity type
   * @param entityValue The value of the entity
   * @param parsed The parsed parameters for the post list
   * @returns The query string for the post type dropdown
   */
  private getPostTypeQuery(entity: PostListAllowedEntitiesEnums, entityValue: string, parsed: PostListParamsInterface): string {
    let query = `?filter[${encodeURIComponent(entity)}.name]=eq:${encodeURIComponent(entityValue)}&select=count:post_type`;
    return query + this.getEndpointSpecificFilterQuery(parsed);
  }

  /**
   * Construct the query for fetching available values for the category dropdown based on the selected entity, entity value and endpoint.
   *
   * @param entity The entity type
   * @param entityValue The value of the entity
   * @param parsed The parsed parameters for the post list
   * @returns The query string for the category dropdown
   */
  private getCategoryQuery(entity: PostListAllowedEntitiesEnums, entityValue: string, parsed: PostListParamsInterface): string {
    let query = `?filter[${encodeURIComponent(entity)}.name]=eq:${encodeURIComponent(entityValue)}&select=count:category`;
    if (parsed.selectedPostType) {
      query += `&filter[post_type]=${encodeURIComponent(parsed.selectedPostType)}`;
    }
    return query + this.getEndpointSpecificFilterQuery(parsed);
  }

  /**
   * Returns common filter query string based on endpoint
   */
  private getEndpointSpecificFilterQuery(parsed: PostListParamsInterface): string {
    let query = '';

    if (parsed.endPoint === 'POSTS') {
      query += '&filter[status]=eq:published';
    } else if (parsed.endPoint === 'USER_POSTS') {
      if (parsed.status) query += `&filter[status]=eq:${parsed.status}`;
      if (this.currentUserId !== null) query += `&filter[user_id]=eq:${this.currentUserId}`;
    }

    return query;
  }

  /**
   * Validate selected dropdown params against valid values from API
   *
   * @param dropdowns Array of dropdowns to validate
   */
  private validateDropdownParams(parsed: PostListParamsInterface): void {
    // This is only for your TypeScript compiler :)
    if (!parsed.endPoint) return;

    const dropdowns = [{ key: 'selectedEntityValue', params: this.entityValueParams, endPoint: parsed.endPoint, selected: parsed.selectedEntityValue }];

    if (parsed.category !== null) dropdowns.push({ key: 'category', params: this.categoryParams, endPoint: parsed.endPoint, selected: parsed.category });
    if (parsed.selectedPostType !== null && parsed.selectedPostType !== undefined)
      dropdowns.push({ key: 'selectedPostType', params: this.postTypeParams, endPoint: parsed.endPoint, selected: parsed.selectedPostType });

    const requests = dropdowns.map((dropdown) => this.availableValuesService.getAvailableValues(dropdown.params, dropdown.endPoint).pipe(take(1)));

    forkJoin(requests).subscribe({
      next: (results) => {
        let fallbackTriggered = false;

        results.forEach((availableValues, dropdownIndex) => {
          /**
           * If a fallback has already been triggered, skip further checks.
           * Other checks will be made on the next initialization after the page reload.
           */
          if (fallbackTriggered) return;

          const dropdown = dropdowns[dropdownIndex];
          const dropdownValues = availableValues.map((value) => value.name);
          if ((dropdown.selected && !dropdownValues.includes(dropdown.selected)) || dropdown.selected === null) {
            fallbackTriggered = true;
            if (dropdown.key === 'selectedEntityValue') {
              this.router.navigate([], {
                queryParams: { [dropdown.key]: dropdownValues[0] },
                queryParamsHandling: 'merge',
                replaceUrl: true,
              });
            } else {
              this.router.navigate([], {
                queryParams: { [dropdown.key]: null },
                queryParamsHandling: 'merge',
                replaceUrl: true,
              });
            }
          }
        });

        if (!fallbackTriggered) {
          this.getPostsList(parsed);
        }
      },
      error: (error) => {
        console.error('Error validating dropdown parameters:', error);
        this.statusMessage = 'Wir haben grade Probleme. Bitte versuche es später noch einmal.';
      },
    });
  }
}
