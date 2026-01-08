import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { take } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { environment } from '../../../environments/environment';

import { PagePagination } from '../../components/page-pagination/page-pagination';
import { QueryParamsDropdown } from '../../components/query-params-dropdown/query-params-dropdown';
import { QueryParamsDatepicker } from '../../components/query-params-datepicker/query-params-datepicker';

import { ApiService } from '../../services/api.service';
import { AvailableValuesService } from '../../services/available-values.service';

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
  selectedEntityValue: string | null = null;
  selectedEntity: string | null = null;
  selectedPostType: string | null = null;
  selectedCategory: string | null = null;
  selectedSort: string | null = null;
  selectedDateFrom: string | null = null;
  selectedDateTo: string | null = null;

  today = new Date();
  minDate: string = environment.RELEASE_DATE;
  maxDate: string = this.today.getFullYear() + '-' + String(this.today.getMonth() + 1).padStart(2, '0') + '-' + String(this.today.getDate()).padStart(2, '0');

  selectedFields: string = 'id,title,category,likes_count,comments_count,created_at';
  endPoint: string = 'POSTS';

  entityValueParams: string[] = [];
  postTypeParams: string[] = [];
  categoryParams: string[] = [];

  postsList: PostInterface[] = [];
  paginationInfo: PaginationInfoInterface<PostInterface> = {} as PaginationInfoInterface<PostInterface>;

  statusMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private availableValuesService: AvailableValuesService,
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const parsed = this.parseQueryParams(params);

      if (!this.areParamsInvalid(parsed)) {
        this.router.navigate(['/']);
        console.warn('Missing required query parameters.');
        return;
      }

      this.setSelectedValues(parsed);
      this.setParams(parsed);
      this.validateDropdownParams(parsed);
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
      entityValue: params['entityValue'] ?? null,
      entity: params['entity'] ?? null,
      postType: params['postType'] ?? null,
      category: params['category'] ?? null,
      dateFrom: params['dateFrom'] ?? null,
      dateTo: params['dateTo'] ?? null,
      sort: params['sort'] ?? null,
      page: Number.isInteger(parseInt(params['page'])) ? parseInt(params['page']) : 1,
      perPage: Number.isInteger(parseInt(params['per_page'])) ? parseInt(params['per_page']) : 5, // TODO: per_page set to 2 for testing, change to a higher value later ( Default: 5)
    };
  }

  /**
   * Check if parsed params are valid
   *
   * @param param0
   * @returns
   */
  private areParamsInvalid(parsed: PostListParamsInterface): boolean {
    return (
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
    this.selectedEntityValue = parsed.entityValue;
    this.selectedEntity = parsed.entity;
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
    return 'changeDetectionValues' + this.selectedEntityValue + this.selectedPostType + this.selectedCategory + this.selectedSort;
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
    let params = new HttpParams().set('select', this.selectedFields).set('page', parsed.page.toString()).set('per_page', parsed.perPage.toString());
    if (parsed.postType) params = params.set('filter[post_type]', parsed.postType);
    if (parsed.entityValue) params = params.set(`filter[${parsed.entity}.name]`, `eq:${parsed.entityValue}`);
    if (parsed.category) params = params.set('filter[category]', `eq:${parsed.category}`);
    if (parsed.dateFrom || parsed.dateTo) params = params.set('filter[created_at]', `between:[${parsed.dateFrom ? parsed.dateFrom : this.minDate},${parsed.dateTo ? parsed.dateTo : this.maxDate}]`);
    if (parsed.sort) params = params.set('sort', `${parsed.sort}`);

    const options = { params };
    const url = ApiEndpointEnums.POSTS + '?' + options.params.toString();

    this.apiService.get<ApiResponseArrayInterface<PostInterface>>(url).subscribe({
      next: (response) => {
        this.postsList = response.data.data;
        this.paginationInfo = response.data as PaginationInfoInterface<PostInterface>;
        if (this.postsList.length === 0) {
          console.warn('No posts found for the selected criteria');
          this.statusMessage = 'Keine Beiträge gefunden.';
        }
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
    this.categoryParams = [
      `?filter[${encodeURIComponent(parsed.entity)}.name]=eq:${encodeURIComponent(parsed.entityValue!)}&filter[post_type]=${encodeURIComponent(parsed.postType!)}&select=count:category`,
    ];
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
    const dropdowns = [
      { key: 'entityValue', params: this.entityValueParams, endPoint: this.endPoint, selected: parsed.entityValue },
      { key: 'postType', params: this.postTypeParams, endPoint: this.endPoint, selected: parsed.postType },
    ];
    if (parsed.category !== null) {
      dropdowns.push({ key: 'category', params: this.categoryParams, endPoint: this.endPoint, selected: parsed.category });
    }

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
            if (dropdown.key === 'entityValue' || dropdown.key === 'postType') {
              this.router.navigate([], {
                queryParams: { [dropdown.key]: dropdownValues[0] },
                queryParamsHandling: 'merge',
              });
            } else {
              this.router.navigate([], {
                queryParams: { [dropdown.key]: null },
                queryParamsHandling: 'merge',
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
