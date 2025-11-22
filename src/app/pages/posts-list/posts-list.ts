import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { DatePipe } from '@angular/common';
import { take } from 'rxjs/operators';

import { PagePagination } from '../../components/page-pagination/page-pagination';
import { QueryParamsDropdown } from '../../components/query-params-dropdown/query-params-dropdown';

import { ApiService } from '../../services/api.service';
import { UsedTechnologiesService } from '../../services/used-technologies.service';

import type { ApiResponseArrayInterface } from '../../interfaces/api-response';
import type { PostInterface } from '../../interfaces/post';
import type { PaginationInfoInterface } from '../../interfaces/pagination-info';

import { ApiEndpointEnums } from '../../enums/api-endpoint';
import { AllowedPostTypesEnums } from '../../enums/allowed-post-types';
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

  allowedPostTypes: string = AllowedPostTypesEnums.ALL;

  postsList: PostInterface[] = [];
  paginationInfo: PaginationInfoInterface<PostInterface> = {} as PaginationInfoInterface<PostInterface>;

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService, private usedTechnologiesService: UsedTechnologiesService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const parsed = this.parseQueryParams(params);

      if (!this.areParamsValid(parsed)) {
        this.router.navigate(['/']);
        console.warn('Missing required query parameters.');
        return;
      }

      this.setSelectedValues(parsed);

      this.setParams(parsed.entityValue, parsed.entity, parsed.postType);
      this.validateDropdownParams();

      this.getPostsList(parsed.entityValue, parsed.postType, parsed.entity, parsed.page, parsed.perPage, parsed.category, parsed.dateFrom, parsed.dateTo, parsed.sort);
    });
  }

  /**
   * Parse query params
   *
   * @param params
   * @returns
   */
  private parseQueryParams(params: any) {
    return {
      entityValue: params['entityValue'] ?? null,
      entity: params['entity'],
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
  private areParamsValid({ entityValue, entity, page, perPage }: { entityValue: string; entity: string; page: number; perPage: number }) {
    return (
      new RegExp(RegexEnums.entityValue).test(entityValue) &&
      Object.values(PostListAllowedEntitiesEnums).includes(entity as PostListAllowedEntitiesEnums) &&
      Number.isInteger(page) &&
      Number.isInteger(perPage)
    );
  }

  private setSelectedValues(parsed: any) {
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
  getPostsList(entityValue: string, postType: string, entity: string, page: number, perPage: number, category: string | null, dateFrom: string | null, dateTo: string | null, sort: string | null) {
    let params = new HttpParams().set('filter[post_type]', postType).set('select', this.selectedFields).set('page', page.toString()).set('per_page', perPage.toString());
    if (entityValue) params = params.set(`filter[${entity}.name]`, `eq:${entityValue}`);
    if (category) params = params.set('filter[category]', `eq:${category}`);
    if (dateFrom && dateTo) params = params.set('filter[created_at]', `between:[${dateFrom},${dateTo}]`);
    if (sort) params = params.set('sort', `${sort}`);

    const options = { params };
    const url = ApiEndpointEnums.POSTS + '?' + options.params.toString();

    this.apiService.get<ApiResponseArrayInterface<PostInterface>>(url).subscribe({
      next: (response) => {
        this.postsList = response.data.data;
        this.paginationInfo = response.data as PaginationInfoInterface<PostInterface>;
        if (this.postsList.length === 0) {
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
  setParams(entityValue: string, entity: string, postType: string) {
    this.entityValueParams = [`?select=count:${encodeURIComponent(entity)}.name`];
    this.categoryParams = [`?filter[${encodeURIComponent(entity)}.name]=eq:${encodeURIComponent(entityValue)}&filter[post_type]=${encodeURIComponent(postType)}&select=count:category`];
    this.postTypeParams = [`?filter[${encodeURIComponent(entity)}.name]=eq:${encodeURIComponent(entityValue)}&select=count:post_type`];
  }

  /**
   * Validate selected dropdown params against valid values from API
   *
   * @param dropdowns Array of dropdowns to validate
   */
  validateDropdownParams() {
    const dropdowns = [
      { key: 'entityValue', params: this.entityValueParams, endPoint: this.endPoint, selected: this.selectedEntityValue },
      { key: 'postType', params: this.postTypeParams, endPoint: this.endPoint, selected: this.selectedPostType },
    ];

    if (this.selectedCategory !== null) {
      dropdowns.push({ key: 'category', params: this.categoryParams, endPoint: this.endPoint, selected: this.selectedCategory });
    }

    dropdowns.forEach((dropdown) => {
      this.usedTechnologiesService
        .getUsedTechnologies(dropdown.params, dropdown.endPoint)
        .pipe(take(1))
        .subscribe((technologies) => {
          const dropdownValues = technologies.map((tech) => tech.name);
          if ((dropdown.selected && !dropdownValues.includes(dropdown.selected)) || dropdown.selected === null) {
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
    });
  }
}
