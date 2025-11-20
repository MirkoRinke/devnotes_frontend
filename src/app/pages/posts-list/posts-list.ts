import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { DatePipe } from '@angular/common';

import { PagePagination } from '../../components/page-pagination/page-pagination';
import { QueryParamsDropdown } from '../../components/query-params-dropdown/query-params-dropdown';

import { ApiService } from '../../services/api.service';

import type { ApiResponseArrayInterface } from '../../interfaces/api-response';
import type { PostInterface } from '../../interfaces/post';
import type { PaginationInfoInterface } from '../../interfaces/pagination-info';

import { ApiEndpointEnums } from '../../enums/api-endpoint';
import { AllowedPostTypesEnums } from '../../enums/allowed-post-types';
import { PostListAllowedEntitiesEnums } from '../../enums/post-list-allowed-entities';
import { RegesEnums } from '../../enums/regex';

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
  selectedFields: string = 'id,title,category,likes_count,comments_count,created_at';

  allowedPostTypes: string = AllowedPostTypesEnums.ALL;

  postsList: PostInterface[] = [];
  paginationInfo: PaginationInfoInterface<PostInterface> =
    {} as PaginationInfoInterface<PostInterface>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const entityValue = params['entityValue'];
      const entity = params['entity'];
      const postType = params['postType'] ? params['postType'] : AllowedPostTypesEnums.ALL;
      const page = parseInt(params['page']) ? parseInt(params['page']) : 1;
      // TODO: per_page set to 2 for testing, change to a higher value later ( Default: 5)
      const perPage = parseInt(params['per_page']) ? parseInt(params['per_page']) : 2;

      const category = params['category'] ? params['category'] : null;
      const dateFrom = params['dateFrom'] ? params['dateFrom'] : null; // 2025-11-25
      const dateTo = params['dateTo'] ? params['dateTo'] : null; // 2025-11-25
      const sort = params['sort'] ? params['sort'] : null;

      if (
        !entityValue ||
        !new RegExp(RegesEnums.entityValue).test(entityValue) ||
        !Object.values(PostListAllowedEntitiesEnums).includes(entity) ||
        !Object.values(AllowedPostTypesEnums).includes(postType) ||
        !Number.isInteger(page) ||
        !Number.isInteger(perPage)
      ) {
        this.router.navigate(['/']);
        console.warn('Missing required query parameters');
        return;
      }

      this.selectedEntityValue = entityValue;
      this.selectedEntity = entity;
      this.selectedPostType = postType;
      this.getPostsList(
        entityValue,
        postType,
        entity,
        page,
        perPage,
        category,
        dateFrom,
        dateTo,
        sort
      );
    });
  }

  getPostsList(
    entityValue: string,
    postType: string,
    entity: string,
    page: number,
    perPage: number,
    category: string | null,
    dateFrom: string | null,
    dateTo: string | null,
    sort: string | null
  ) {
    let params = new HttpParams()
      .set(`filter[${entity}.name]`, `eq:${entityValue}`)
      .set('filter[post_type]', postType)
      .set('select', this.selectedFields)
      .set('page', page.toString())
      .set('per_page', perPage.toString());

    if (category) params = params.set('filter[category]', `eq:${category}`);
    if (dateFrom && dateTo) {
      params = params.set('filter[created_at]', `between:[${dateFrom},${dateTo}]`);
    }
    if (sort) params = params.set('sort', `${sort}`);

    const options = { params };

    const url = ApiEndpointEnums.POSTS + '?' + options.params.toString();

    this.apiService.get<ApiResponseArrayInterface<PostInterface>>(url).subscribe({
      next: (response) => {
        this.postsList = response.data.data;
        this.paginationInfo = response.data as PaginationInfoInterface<PostInterface>;
        // console.log('PostsList response:', this.postsList);
        // console.log('Pagination info:', this.paginationInfo);

        if (this.postsList.length === 0) {
          this.router.navigate(['/']);
          console.warn('No posts found for the selected criteria.');
        }
      },
      error: (error) => {
        console.error('Error fetching posts list:', error);
      },
    });
  }
}
