import { Component, OnInit, HostListener, ElementRef, ViewChild, ChangeDetectorRef, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { Subject, Subscription } from 'rxjs';
import { take, debounceTime } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { environment } from '../../../environments/environment';

import { ApiService } from '../../services/api.service';
import { AvailableValuesService } from '../../services/available-values.service';
import { SearchService } from '../../services/search.service';
import { AuthService } from '../../services/auth.service';

import { TranslatePipe } from '../../i18n/translate-pipe';

import { getCssVariableValue, getHeightById, getElementPositionFrom } from '../../utils/css-helper';
import { blurActiveElementInside } from '../../utils/dom-helper';

import type { ApiResponseArrayInterface } from '../../interfaces/api-response';
import type { PostInterface } from '../../interfaces/post';
import type { PaginationInfoInterface } from '../../interfaces/pagination-info';
import type { PostListParamsInterface } from '../../interfaces/post-list-params';
import type { FilterValuesInterface } from '../../interfaces/posts-list-filter-bar';

import type { Params } from '@angular/router';

import { ApiEndpointEnums } from '../../enums/api-endpoint';
import { PostListAllowedEntitiesEnums } from '../../enums/post-list-allowed-entities';
import { RegexEnums } from '../../enums/regex';

import { PostListElement } from '../../components/post-list-element/post-list-element';
import { SectionPagination } from '../../components/section-pagination/section-pagination';
import { PostsListFilterBar } from '../../components/posts-list-filter-bar/posts-list-filter-bar';
import { Loading } from '../../components/loading/loading';
import { NoResults } from '../../components/no-results/no-results';

@Component({
  selector: 'app-posts-list',
  imports: [PostListElement, SectionPagination, PostsListFilterBar, Loading, NoResults, TranslatePipe],
  templateUrl: './posts-list.html',
  styleUrl: './posts-list.scss',
})
export class PostsList implements OnInit {
  public context: PostListParamsInterface['context'] = null;
  public endPoint: PostListParamsInterface['endPoint'] = null;
  public selectedEntity: PostListParamsInterface['selectedEntity'] = null;
  public selectedEntityValue: PostListParamsInterface['selectedEntityValue'] = null;
  public selectedPostType: PostListParamsInterface['selectedPostType'] = null;

  private selectedCategory: PostListParamsInterface['category'] = null;
  private selectedDateFrom: PostListParamsInterface['dateFrom'] = null;
  private selectedDateTo: PostListParamsInterface['dateTo'] = null;
  private selectedSort: PostListParamsInterface['sort'] = null;
  private selectedStatus: PostListParamsInterface['status'] = null;

  private readonly today = new Date();
  private readonly minDate: string = environment.RELEASE_DATE;
  private readonly maxDate: string = this.today.toISOString().slice(0, 10);

  private readonly selectedFields: string = 'id,title,category,likes_count,comments_count,status,updated_at';

  private entityValueParams: string[] = [];
  private postTypeParams: string[] = [];
  private categoryParams: string[] = [];

  public filterValues: FilterValuesInterface | null = null;

  public isLoading = true;

  public postsList: PostInterface[] = [];
  public paginationInfo: PaginationInfoInterface<PostInterface> = {} as PaginationInfoInterface<PostInterface>;

  private perPage: number | null = null;
  private postListContainer: ElementRef | null = null;

  private currentUserId: number | null = null;

  private initialLoad = true;
  private resizeSub: Subscription | null = null;

  private readonly destroyRef = inject(DestroyRef);

  private resize$ = new Subject<void>();

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly apiService: ApiService,
    private readonly availableValuesService: AvailableValuesService,
    private readonly searchService: SearchService,
    private readonly cdr: ChangeDetectorRef,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    this.processQueryParams();
    this.searchService.searchMode('posts-list');
    this.searchService.enableSearch(true);
  }

  /**
   * Process query parameters from the route and handle validation, setting selected values, and fetching posts list.
   * If the parameters are invalid or access is restricted, navigate to the "bad-gateway" page.
   */
  private processQueryParams(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const parsed = this.parseQueryParams(params);

      if (!this.areParamsValid(parsed)) {
        console.warn('Invalid query parameters');
        this.router.navigate(['/bad-gateway']);
        return;
      }

      const restrictedEndpoints = ['USER_POSTS', 'FAVORITE_POSTS'];
      if (parsed.endPoint && restrictedEndpoints.includes(parsed.endPoint) && this.currentUserId === null) {
        console.warn('Invalid access attempt to restricted endpoint without authentication');
        this.router.navigate(['/bad-gateway']);
        return;
      }

      this.setSelectedValues(parsed);
      this.setParams(parsed);
      this.createFilterValues();

      this.initResizeSubscription(parsed);
      this.listElementsPerPage(parsed, true);

      this.searchService.syncFromParameters(params);
      this.searchService.cageIcon(parsed.selectedEntityValue);
    });
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
      sort: params['sort'] ?? '-updated_at',
      searchTerm: params['searchTerm'] ?? null,
      page: Number.isInteger(parseInt(params['page'])) ? parseInt(params['page']) : 1,
      perPage: Number.isInteger(parseInt(params['per_page'])) ? parseInt(params['per_page']) : 5,
    };
  }

  /**
   * Check if parsed params are valid
   *
   * @param parsed
   * @returns
   */
  private areParamsValid(parsed: PostListParamsInterface): boolean {
    const isContextValid = parsed.context === null || typeof parsed.context === 'string';
    const isEndPointValid = parsed.endPoint !== null && parsed.endPoint in ApiEndpointEnums;
    const isEntityValueValid = parsed.selectedEntityValue !== null && new RegExp(RegexEnums.entityValue).test(parsed.selectedEntityValue);
    const isEntityValid = Object.values(PostListAllowedEntitiesEnums).includes(parsed.selectedEntity as PostListAllowedEntitiesEnums);
    const isPageValid = Number.isInteger(parsed.page);
    const isPerPageValid = Number.isInteger(parsed.perPage);
    const isPostTypeValid = parsed.selectedPostType === null || typeof parsed.selectedPostType === 'string';
    const isCategoryValid = parsed.category === null || typeof parsed.category === 'string';
    const isDateFromValid = parsed.dateFrom === null || new RegExp(RegexEnums.datepicker).test(parsed.dateFrom);
    const isDateToValid = parsed.dateTo === null || new RegExp(RegexEnums.datepicker).test(parsed.dateTo);
    const isStatusValid = parsed.status === null || typeof parsed.status === 'string';
    const isSortValid = parsed.sort === null || typeof parsed.sort === 'string';
    const isSearchTermValid = parsed.searchTerm === null || typeof parsed.searchTerm === 'string';

    return (
      isContextValid &&
      isEndPointValid &&
      isEntityValueValid &&
      isEntityValid &&
      isPageValid &&
      isPerPageValid &&
      isPostTypeValid &&
      isCategoryValid &&
      isDateFromValid &&
      isDateToValid &&
      isStatusValid &&
      isSortValid &&
      isSearchTermValid
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
    this.selectedStatus = parsed.status;
  }

  /**
   * Creates the filter values object based on the current selected values and available parameters. This object is used to manage the state of the filter bar and to pass the necessary data to child components.
   */
  private createFilterValues(): void {
    this.filterValues = {
      endPoint: this.endPoint,
      selectedEntity: this.selectedEntity,
      selectedEntityValue: this.selectedEntityValue,
      selectedPostType: this.selectedPostType,
      selectedCategory: this.selectedCategory,
      selectedStatus: this.selectedStatus,
      selectedDateFrom: this.selectedDateFrom,
      selectedDateTo: this.selectedDateTo,
      selectedSort: this.selectedSort,
      minDate: this.minDate,
      maxDate: this.maxDate,
      entityValueParams: [...this.entityValueParams],
      postTypeParams: [...this.postTypeParams],
      categoryParams: [...this.categoryParams],
    };
  }

  /**
   * Sets the reference to the container element and calculates the page size based on its width.
   *
   * @param element
   */
  @ViewChild('postListContainer') public set postListContainerRef(element: ElementRef) {
    if (element && element !== this.postListContainer) {
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

    this.resizeSub = this.resize$.pipe(debounceTime(200), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
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
    const paginationHeight = getHeightById('pagination-container');
    const footerHeight = getHeightById('footer-container');
    const buffer = listElementSize;

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
    if (parsed.dateFrom || parsed.dateTo) {
      const from = parsed.dateFrom ? parsed.dateFrom : this.minDate;
      const to = parsed.dateTo ? parsed.dateTo : this.maxDate;
      params = params.set('filter[updated_at]', `between:[${from},${to}T23:59:59]`);
    }
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
        this.searchService.dataLoaded(true);
        this.isLoading = false;
      },
      error: () => {
        console.warn('Error fetching posts list from API');
        this.router.navigate(['/bad-gateway']);
      },
    });
  }

  /**
   * Single source of truth for the endpoint specific filter rules, shared by the HttpParams and query-string variants.
   *
   * @param parsed
   * @returns
   */
  private getEndpointSpecificFilters(parsed: PostListParamsInterface): Record<string, string> {
    const filters: Record<string, string> = {};

    if (parsed.endPoint === 'POSTS') {
      filters['filter[status]'] = 'eq:published';
    } else if (parsed.endPoint === 'USER_POSTS') {
      if (parsed.status) filters['filter[status]'] = `eq:${parsed.status}`;
      if (this.currentUserId !== null) filters['filter[user_id]'] = `eq:${this.currentUserId}`;
    }

    return filters;
  }

  /**
   * Append endpoint specific filters to the query parameters based on the selected endpoint and other parameters.
   *
   * @param params
   * @param parsed
   * @returns
   */
  private appendEndpointSpecificParams(params: HttpParams, parsed: PostListParamsInterface): HttpParams {
    const filters = this.getEndpointSpecificFilters(parsed);
    const updatedParams = Object.entries(filters).reduce((accParams, [key, value]) => accParams.set(key, value), params);

    return updatedParams;
  }

  /**
   * Returns common filter query string based on endpoint
   */
  private getEndpointSpecificFilterQuery(parsed: PostListParamsInterface): string {
    const filters = this.getEndpointSpecificFilters(parsed);
    const filterQuery = Object.entries(filters)
      .map(([key, value]) => `&${key}=${value}`)
      .join('');

    return filterQuery;
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
      error: () => {
        console.warn('Error fetching available values for dropdown validation');
        this.router.navigate(['/bad-gateway']);
      },
    });
  }
}
