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
  context: string | null = null;
  endPoint: string | null = null;

  selectedEntity: string | null = null;
  selectedEntityValue: string | null = null;

  selectedPostType: string | null = null;
  selectedCategory: string | null = null;
  selectedDateFrom: string | null = null;
  selectedDateTo: string | null = null;
  selectedSort: string | null = null;

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
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const parsed = this.parseQueryParams(params);

      if (!this.areParamsValid(parsed)) {
        this.router.navigate(['/']);
        console.warn('Missing or invalid query parameters. Redirecting to home page.');
        return;
      }

      this.setSelectedValues(parsed);
      this.setParams(parsed);

      this.initResizeSubscription(parsed);
      this.listElementsPerPage(parsed, true);

      this.searchService.syncFromParameters(params);
      this.searchService.cageIcon(parsed.entityValue);
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
      entity: params['entity'] ?? null,
      entityValue: params['entityValue'] ?? null,
      postType: params['postType'] ?? null,
      category: params['category'] ?? null,
      dateFrom: params['dateFrom'] ?? null,
      dateTo: params['dateTo'] ?? null,
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
      parsed.endPoint !== null &&
      parsed.endPoint in ApiEndpointEnums &&
      parsed.entityValue !== null &&
      new RegExp(RegexEnums.entityValue).test(parsed.entityValue) &&
      Object.values(PostListAllowedEntitiesEnums).includes(parsed.entity as PostListAllowedEntitiesEnums) &&
      Number.isInteger(parsed.page) &&
      Number.isInteger(parsed.perPage) &&
      (parsed.dateFrom === null || new RegExp(RegexEnums.datepicker).test(parsed.dateFrom)) &&
      (parsed.dateTo === null || new RegExp(RegexEnums.datepicker).test(parsed.dateTo))
    );
  }

  /**
   * Set selected values from parsed query params
   *
   * @param parsed
   */
  private setSelectedValues(parsed: PostListParamsInterface) {
    this.context = parsed.context;
    this.endPoint = parsed.endPoint;
    this.selectedEntity = parsed.entity;
    this.selectedEntityValue = parsed.entityValue;
    this.selectedPostType = parsed.postType;
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
  changeDetectionValue(): string {
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
  onResize() {
    this.resize$.next();
  }

  /**
   * Initializes the resize subscription to handle window resize events.
   */
  private initResizeSubscription(parsed: PostListParamsInterface) {
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
  private listElementsPerPage(parsed: PostListParamsInterface, isNavigation: boolean = false) {
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
  private getPostsList(parsed: PostListParamsInterface) {
    if (!parsed.endPoint) return;

    const perPage = this.perPage ?? parsed.perPage;

    let params = new HttpParams().set('select', this.selectedFields).set('page', parsed.page.toString()).set('per_page', perPage.toString());
    if (parsed.postType) params = params.set('filter[post_type]', parsed.postType);
    if (parsed.entityValue) params = params.set(`filter[${parsed.entity}.name]`, `eq:${parsed.entityValue}`);
    if (parsed.category) params = params.set('filter[category]', `eq:${parsed.category}`);
    if (parsed.dateFrom || parsed.dateTo) params = params.set('filter[created_at]', `between:[${parsed.dateFrom ? parsed.dateFrom : this.minDate},${parsed.dateTo ? parsed.dateTo : this.maxDate}]`);
    if (parsed.sort) params = params.set('sort', `${parsed.sort}`);

    const splitSearchData = this.searchService.splitSearchValueInputValue;
    if (splitSearchData?.text) params = params.set('filter[title]', splitSearchData.text);
    if (splitSearchData?.tags) params = params.set('filter[tags.name]', `eq:[${splitSearchData.tags.join(',')}]`);

    const options = { params };

    const url = ApiEndpointEnums[parsed.endPoint as keyof typeof ApiEndpointEnums] + '?' + options.params.toString();

    // console.log('Fetching posts with URL:', url, Math.random()); // Add random number to ensure log is printed every time

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
   * Set query params for dropdowns
   *
   * @param entityValue The value of the entity
   * @param entity  The entity type
   * @param postType The type of the post
   */
  private setParams(parsed: PostListParamsInterface) {
    this.entityValueParams = [`?select=count:${encodeURIComponent(parsed.entity)}.name`];
    this.postTypeParams = [`?filter[${encodeURIComponent(parsed.entity)}.name]=eq:${encodeURIComponent(parsed.entityValue!)}&select=count:post_type`];
    this.categoryParams = [`?filter[${encodeURIComponent(parsed.entity)}.name]=eq:${encodeURIComponent(parsed.entityValue!)}&select=count:category`];

    let categoryQuery = `?filter[${encodeURIComponent(parsed.entity!)}.name]=eq:${encodeURIComponent(parsed.entityValue!)}`;
    if (parsed.postType !== null) categoryQuery += `&filter[post_type]=${encodeURIComponent(parsed.postType)}`;
    categoryQuery += '&select=count:category';

    this.categoryParams = [categoryQuery];
  }

  /**
   * Validate selected dropdown params against valid values from API
   *
   * @param dropdowns Array of dropdowns to validate
   */
  /**
   * Validate selected dropdown params against valid values from API
   *
   * @param dropdowns Array of dropdowns to validate
   */
  private validateDropdownParams(parsed: PostListParamsInterface) {
    // This is only for your TypeScript compiler :)
    if (!parsed.endPoint) return;

    const dropdowns = [{ key: 'entityValue', params: this.entityValueParams, endPoint: parsed.endPoint, selected: parsed.entityValue }];

    if (parsed.category !== null) dropdowns.push({ key: 'category', params: this.categoryParams, endPoint: parsed.endPoint, selected: parsed.category });
    if (parsed.postType !== null) dropdowns.push({ key: 'postType', params: this.postTypeParams, endPoint: parsed.endPoint, selected: parsed.postType });

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
            if (dropdown.key === 'entityValue') {
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
