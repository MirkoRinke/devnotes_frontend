import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { DatePipe } from '@angular/common';
import { take } from 'rxjs/operators';
import { forkJoin } from 'rxjs';

import { PagePagination } from '../../components/page-pagination/page-pagination';
import { QueryParamsDropdown } from '../../components/query-params-dropdown/query-params-dropdown';

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

@Component({
  selector: 'app-posts-list',
  imports: [DatePipe, PagePagination, RouterLink, QueryParamsDropdown],
  templateUrl: './posts-list.html',
  styleUrl: './posts-list.scss',
})
export class PostsList {
  selectedEntityValue: string | null = null;
  selectedEntity: string | null = null;
  selectedPostType: string | null = null;
  selectedCategory: string | null = null;

  selectedFields: string = 'id,title,category,likes_count,comments_count,created_at';
  endPoint: string = 'POSTS';

  entityValueParams: string[] = [];
  postTypeParams: string[] = [];
  categoryParams: string[] = [];

  postsList: PostInterface[] = [];
  paginationInfo: PaginationInfoInterface<PostInterface> = {} as PaginationInfoInterface<PostInterface>;

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService, private availableValuesService: AvailableValuesService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const parsed = this.parseQueryParams(params);
      if (!this.areParamsValid(parsed)) {
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
      entityValue: params['entityValue'] ?? null,
      entity: params['entity'] ?? null,
      postType: params['postType'] ?? null,
      category: params['category'] ?? null,
      dateFrom: params['dateFrom'] ?? null,
      dateTo: params['dateTo'] ?? null,
      sort: params['sort'] ?? null,
      page: Number.isInteger(parseInt(params['page'])) ? parseInt(params['page']) : 1,
      perPage: Number.isInteger(parseInt(params['per_page'])) ? parseInt(params['per_page']) : 2, // TODO: per_page set to 2 for testing, change to a higher value later ( Default: 5)
    };
  }

  /**
   * Validate query params
   *
   * @param param0
   * @returns
   */
  private areParamsValid(parsed: PostListParamsInterface): boolean {
    return (
      parsed.entityValue !== null &&
      new RegExp(RegexEnums.entityValue).test(parsed.entityValue) &&
      Object.values(PostListAllowedEntitiesEnums).includes(parsed.entity as PostListAllowedEntitiesEnums) &&
      Number.isInteger(parsed.page) &&
      Number.isInteger(parsed.perPage)
    );
  }

  /**
   * Set selected values from parsed query params
   *
   * @param parsed
   */
  private setSelectedValues(parsed: PostListParamsInterface) {
    this.selectedEntityValue = parsed.entityValue;
    this.selectedEntity = parsed.entity;
    this.selectedPostType = parsed.postType;
    this.selectedCategory = parsed.category;
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
  getPostsList(parsed: PostListParamsInterface) {
    let params = new HttpParams().set('select', this.selectedFields).set('page', parsed.page.toString()).set('per_page', parsed.perPage.toString());
    if (parsed.postType) params = params.set('filter[post_type]', parsed.postType);
    if (parsed.entityValue) params = params.set(`filter[${parsed.entity}.name]`, `eq:${parsed.entityValue}`);
    if (parsed.category) params = params.set('filter[category]', `eq:${parsed.category}`);
    if (parsed.dateFrom && parsed.dateTo) params = params.set('filter[created_at]', `between:[${parsed.dateFrom},${parsed.dateTo}]`);
    if (parsed.sort) params = params.set('sort', `${parsed.sort}`);

    const options = { params };
    const url = ApiEndpointEnums.POSTS + '?' + options.params.toString();

    this.apiService.get<ApiResponseArrayInterface<PostInterface>>(url).subscribe({
      next: (response) => {
        console.log('API-Response:', response.data.data);
        this.postsList = response.data.data;
        this.paginationInfo = response.data as PaginationInfoInterface<PostInterface>;
        if (this.postsList.length === 0) {
          console.log('Fetching posts with URL:', url, this.postsList);
          console.warn('No posts found for the selected criteria');
        }
      },
      error: (error) => {
        console.error('Error fetching posts list:', error);
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
  setParams(parsed: PostListParamsInterface) {
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
  validateDropdownParams(parsed: PostListParamsInterface) {
    const dropdowns = [
      { key: 'entityValue', params: this.entityValueParams, endPoint: this.endPoint, selected: parsed.entityValue },
      { key: 'postType', params: this.postTypeParams, endPoint: this.endPoint, selected: parsed.postType },
    ];
    if (parsed.category !== null) {
      dropdowns.push({ key: 'category', params: this.categoryParams, endPoint: this.endPoint, selected: parsed.category });
    }

    const requests = dropdowns.map((dropdown) => this.availableValuesService.getAvailableValues(dropdown.params, dropdown.endPoint).pipe(take(1)));

    forkJoin(requests).subscribe((results) => {
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
          console.log(`Fallback für "${dropdown.key}"! Ungültiger Wert:`, dropdown.selected, 'Gültige Werte:', dropdownValues);
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
        console.log('Lade Posts mit Parametern:', parsed);
        this.getPostsList(parsed);
      }
    });
  }
}
