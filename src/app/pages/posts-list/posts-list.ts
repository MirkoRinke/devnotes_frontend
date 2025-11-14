import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { DatePipe } from '@angular/common';

import { ApiService } from '../../services/api.service';

import type { ApiResponseArrayInterface } from '../../interfaces/api-response';
import type { PostInterface } from '../../interfaces/post';
import type { PaginationInfoInterface } from '../../interfaces/pagination-info';

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
      const tech = params['tech'];
      const entity = params['entity'];
      const postType = params['postType'];

      console.log('PostsList params:', params);

      if (!tech || !postType || !entity) {
        this.router.navigate(['/']);
        return;
      }

      this.selectedTech = tech;
      this.selectedPostType = postType;
      this.getPostsList(tech, postType, entity);
    });
  }

  getPostsList(tech: string, postType: string, entity: string) {
    const options = {
      params: new HttpParams()
        .set(`filter[${entity}.name]`, `eq:${tech}`)
        .set('filter[post_type]', postType)
        .set('select', 'id,title,category,likes_count,comments_count,created_at'),
    };

    const url = `/posts/` + '?' + options.params.toString();

    this.apiService.get<ApiResponseArrayInterface<PostInterface>>(url).subscribe({
      next: (response) => {
        this.postsList = response.data.data;
        this.paginationInfo = response.data as PaginationInfoInterface<PostInterface>;
        console.log('PostsList response:', response.data);
        console.log('Pagination info:', response.data);
      },
      error: (error) => {
        console.error('Error fetching posts list:', error);
      },
    });
  }
}
