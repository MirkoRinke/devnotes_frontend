import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { DatePipe } from '@angular/common';

import { ApiService } from '../../services/api.service';

import type { ApiResponseArrayInterface } from '../../interfaces/api-response';
import type { PostInterface } from '../../interfaces/post';
import type { PaginationInfoInterface } from '../../interfaces/pagination-info';

import { ApiEndpointEnums } from '../../enums/api-endpoint';
import { AllowedPostTypesEnums } from '../../enums/allowed-post-types';
import { PostListAllowedEntitiesEnums } from '../../enums/post-list-allowed-entities';

@Component({
  selector: 'app-posts-list',
  imports: [DatePipe],
  templateUrl: './posts-list.html',
  styleUrl: './posts-list.scss',
})
export class PostsList {
  selectedTech: string | null = null;
  selectedPostType: string | null = null;
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
      const page = params['page'] ? params['page'] : '1';
      const perPage = params['per_page'] ? params['per_page'] : '5';

      console.log('PostsList params:', params);

      if (
        !entityValue ||
        !Object.values(PostListAllowedEntitiesEnums).includes(entity) ||
        !Object.values(AllowedPostTypesEnums).includes(postType)
      ) {
        this.router.navigate(['/']);
        return;
      }

      this.selectedTech = entityValue;
      this.selectedPostType = postType;
      this.getPostsList(entityValue, postType, entity, page, perPage);
    });
  }

  getPostsList(
    entityValue: string,
    postType: string,
    entity: string,
    page: string,
    perPage: string
  ) {
    const options = {
      params: new HttpParams()
        .set(`filter[${entity}.name]`, `eq:${entityValue}`)
        .set('filter[post_type]', postType)
        .set('select', 'id,title,category,likes_count,comments_count,created_at')
        .set('page', page.toString())
        .set('per_page', perPage.toString()),
    };

    const url = ApiEndpointEnums.POSTS + '?' + options.params.toString();

    console.log('Fetching PostsList with URL:', url);

    this.apiService.get<ApiResponseArrayInterface<PostInterface>>(url).subscribe({
      next: (response) => {
        this.postsList = response.data.data;
        this.paginationInfo = response.data as PaginationInfoInterface<PostInterface>;
        console.log('PostsList response:', this.postsList);
        console.log('Pagination info:', this.paginationInfo);

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
