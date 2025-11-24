import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { DatePipe } from '@angular/common';

import { ApiService } from '../../services/api.service';

import type { ApiResponseObjektInterface } from '../../interfaces/api-response';
import type { PostInterface } from '../../interfaces/post';
import type { PostParamsInterface } from '../../interfaces/post-params';
import type { Params } from '@angular/router';

import { ApiEndpointEnums } from '../../enums/api-endpoint';

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
      const parsed: PostParamsInterface = this.parseQueryParams(params);

      if (parsed.postId === null || !Number.isInteger(parsed.postId)) {
        this.router.navigate(['/']);
        console.warn('Missing required query parameters');
        return;
      }

      this.setSelectedValues(parsed);
      this.getPost(parsed.postId);
    });
  }

  /**
   * Parse query params
   *
   * @param params
   * @returns
   */
  private parseQueryParams(params: Params): PostParamsInterface {
    return {
      postId: parseInt(params['post_id']) ?? null,
      selectedEntityValue: params['selectedEntityValue'] ?? null,
      selectedPostType: params['selectedPostType'] ?? null,
    };
  }

  /**
   * Set selected values
   *
   * @param selectedEntityValue
   * @param selectedPostType
   */
  private setSelectedValues(parsed: PostParamsInterface): void {
    this.selectedEntityValue = parsed.selectedEntityValue;
    this.selectedPostType = parsed.selectedPostType;
  }

  /**
   * Get post by id from API
   *
   * @param postId
   */
  private getPost(post_id: number): void {
    const url = `${ApiEndpointEnums.POSTS}${post_id}`;

    this.apiService.get<ApiResponseObjektInterface<PostInterface>>(url).subscribe({
      next: (response) => {
        this.post = response.data.data;

        if (this.checkAllowedEntityValue() || this.checkAllowedPostTypes()) {
          this.router.navigate(['/']);
          console.warn('Invalid entity value or post type');
          return;
        }
      },
      error: (error) => {
        this.router.navigate(['/']);
        console.error('Error fetching posts list:', error);
      },
    });
  }

  /**
   * Check if selected entity value is allowed
   *
   * @returns boolean
   */
  private checkAllowedEntityValue(): boolean {
    const postLanguages = this.post.languages?.map((language) => language.name) || [];
    const postTechnologies = this.post.technologies?.map((technology) => technology.name) || [];
    const postTags = this.post.tags?.map((tag) => tag.name) || [];

    const allowedEntityValues: string[] = postLanguages.concat(postTechnologies, postTags);

    return !allowedEntityValues.includes(this.selectedEntityValue!);
  }

  /**
   * Check if selected post type is allowed
   *
   * @returns boolean
   */
  private checkAllowedPostTypes(): boolean {
    return this.post.post_type !== this.selectedPostType;
  }
}
