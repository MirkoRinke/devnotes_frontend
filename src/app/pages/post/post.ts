import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';

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
  context: string | null = null;
  endPoint: string | null = null;

  selectedEntity: string | null = null;
  selectedEntityValue: string | null = null;

  selectedPostType: string | null = null;

  post: PostInterface = {} as PostInterface;

  postDataLoaded: boolean = false;
  mode = 'view';

  necessaryUserFields: string = 'display_name,avatar_items,is_following';

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParams]).subscribe(([path, params]) => {
      const parsed: PostParamsInterface = this.parseQueryParams(params);

      const paramId = path.get('id');
      const postId = Number(paramId);

      if (!paramId || isNaN(postId) || !Number.isInteger(postId)) {
        this.router.navigate(['/']);
        console.warn('Missing required query parameters');
        return;
      }

      this.setSelectedValues(parsed);
      this.getPost(postId);
    });
  }

  /**
   * Update the current post with new data from the child component or reload it from the API
   */
  updatePost(updatedPost?: PostInterface): void {
    if (updatedPost) {
      console.log('Updating post with new data from child component:', updatedPost);
      this.post = updatedPost;
    } else if (this.post && this.post.id) {
      console.log('Reloading post data from API for post ID:', this.post.id);
      this.getPost(this.post.id);
    }
  }

  /**
   * Parse query params
   *
   * @param params
   * @returns
   */
  private parseQueryParams(params: Params): PostParamsInterface {
    return {
      context: params['context'] ?? null,
      endPoint: params['endPoint'] ?? null,
      selectedEntity: params['selectedEntity'] ?? null,
      selectedEntityValue: params['selectedEntityValue'] ?? null,
    };
  }

  /**
   * Set selected values
   *
   * @param selectedEntityValue
   * @param selectedPostType
   * @param selectedEntity
   */
  private setSelectedValues(parsed: PostParamsInterface): void {
    this.context = parsed.context;
    this.endPoint = parsed.endPoint;
    this.selectedEntity = parsed.selectedEntity;
    this.selectedEntityValue = parsed.selectedEntityValue;
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
        if (this.checkAllowedEntityValue()) {
          this.router.navigate(['/']);
          console.warn('Invalid entity value');
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
}
