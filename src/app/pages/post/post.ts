import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DatePipe } from '@angular/common';

import { ApiService } from '../../services/api.service';

import type { ApiResponseObjektInterface } from '../../interfaces/api-response';
import type { PostInterface } from '../../interfaces/post';

import { ApiEndpointEnums } from '../../enums/api-endpoint';
import { AllowedPostTypesEnums } from '../../enums/allowed-post-types';
import { RegexEnums } from '../../enums/regex';

@Component({
  selector: 'app-post',
  imports: [DatePipe],
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class Post {
  post: PostInterface = {} as PostInterface;
  selectedEntityValue: string | null = null;
  selectedPostType: string | null = null;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const postId = parseInt(params['post_id']);
      const selectedEntityValue = params['selectedEntityValue'];
      const selectedPostType = params['selectedPostType'];

      if (!Number.isInteger(postId) || !new RegExp(RegexEnums.entityValue).test(selectedEntityValue) || !Object.values(AllowedPostTypesEnums).includes(selectedPostType)) {
        this.router.navigate(['/']);
        console.warn('Missing required query parameters');
        return;
      }

      this.getPost(postId);
      this.selectedEntityValue = selectedEntityValue;
      this.selectedPostType = selectedPostType;
    });
  }

  getPost(post_id: number): void {
    const url = `${ApiEndpointEnums.POSTS}${post_id}`;

    this.apiService.get<ApiResponseObjektInterface<PostInterface>>(url).subscribe({
      next: (response) => {
        this.post = response.data.data;
      },
      error: (error) => {
        this.router.navigate(['/']);
        console.error('Error fetching posts list:', error);
      },
    });
  }
}
