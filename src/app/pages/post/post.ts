import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { ApiService } from '../../services/api.service';

import type { ApiResponseObjektInterface } from '../../interfaces/api-response';
import type { PostInterface } from '../../interfaces/post';
import type { PostParamsInterface } from '../../interfaces/post-params';
import type { Params } from '@angular/router';

import { ApiEndpointEnums } from '../../enums/api-endpoint';
import { PostView } from '../../components/post/post-view/post-view';
import { HttpParams } from '@angular/common/http';
import { PostDelete } from '../../components/post/post-delete/post-delete';
import { PostForm } from '../../components/post/post-form/post-form';

@Component({
  selector: 'app-post',
  imports: [PostView, PostDelete, PostForm],
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class Post {
  post: PostInterface = {} as PostInterface;
  selectedEntityValue: string | null = null;
  selectedPostType: string | null = null;

  postDataLoaded: boolean = false;
  mode = 'view';

  necessaryUserFields: string = 'display_name,avatar_items';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
  ) {}

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
    const options = {
      params: new HttpParams().set('include', 'user').set('user_fields', this.necessaryUserFields),
    };

    const url = `${ApiEndpointEnums.POSTS}${post_id}` + '?' + options.params.toString();

    console.log('Fetching post with URL:', url);

    this.apiService.get<ApiResponseObjektInterface<PostInterface>>(url).subscribe({
      next: (response) => {
        this.post = response.data.data;
        this.postDataLoaded = true;
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
