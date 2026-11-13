import { Component, inject, DestroyRef, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { ApiService } from '../../services/api.service';
import { AppSettingsService } from '../../services/app.settings.service';

import type { ApiResponseObjektInterface } from '../../interfaces/api-response';
import type { PostInterface } from '../../interfaces/post';
import type { PostParamsInterface } from '../../interfaces/post-params';
import type { Params } from '@angular/router';
import type { ResourceRefreshInterface } from '../../interfaces/post-form';
import type { PostMode } from '../../interfaces/post-mode';

import { ApiEndpointEnums } from '../../enums/api-endpoint';
import { PostView } from '../../components/post/post-view/post-view';
import { PostForm } from '../../components/post/post-form/post-form';
import { Loading } from '../../components/loading/loading';

@Component({
  selector: 'app-post',
  imports: [PostView, PostForm, Loading],
  templateUrl: './post.html',
  styleUrl: './post.scss',
})
export class Post implements OnInit {
  public context: PostParamsInterface['context'] = null;
  public endPoint: PostParamsInterface['endPoint'] = null;
  public selectedEntity: PostParamsInterface['selectedEntity'] = null;
  public selectedEntityValue: PostParamsInterface['selectedEntityValue'] = null;
  public selectedPostType: PostParamsInterface['selectedPostType'] = null;

  public post: PostInterface = {} as PostInterface;

  public postDataLoaded: boolean = false;
  public mode: PostMode = 'view';

  private readonly necessaryUserFields: string = 'display_name,avatar_items,is_following,avatar_mvp_id';

  private readonly destroyRef = inject(DestroyRef);

  private readonly appSettingsService = inject(AppSettingsService);
  public readonly isFluid = this.appSettingsService.isFluid;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly apiService: ApiService,
    private readonly router: Router,
  ) {}

  ngOnInit(): void {
    combineLatest([this.route.paramMap, this.route.queryParams])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(([path, params]) => {
        const parsed: PostParamsInterface = this.parseQueryParams(params);

        const paramId = path.get('id');
        const postId = Number(paramId);

        if (!paramId || isNaN(postId) || !Number.isInteger(postId)) {
          this.router.navigate(['/']);
          console.warn('Missing required query parameters');
          return;
        }

        if (!this.post || this.post.id !== postId) {
          this.setSelectedValues(parsed);
          this.getPost(postId);
        }
      });
  }

  /**
   * Update the current post with new data from the child component or reload it from the API
   */
  public updatePost(event?: ResourceRefreshInterface): void {
    if (event?.updatedPost) {
      this.post = { ...this.post, ...event.updatedPost };
      if (event.entity && event.entityValue) {
        this.router.navigate([], {
          relativeTo: this.route,
          queryParams: {
            selectedEntity: event.entity,
            selectedEntityValue: event.entityValue,
          },
          queryParamsHandling: 'merge',
          replaceUrl: true,
        });
      }
    } else if (this.post && this.post.id) {
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
      selectedPostType: params['selectedPostType'] ?? null,
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

    this.apiService.get<ApiResponseObjektInterface<PostInterface>>(url).subscribe({
      next: (response) => {
        this.post = response.data.data;
        if (this.checkAllowedEntityValue(response.data.data)) {
          console.warn('Invalid entity value');
          this.router.navigate(['/bad-gateway']);
        }
        this.postDataLoaded = true;
      },
      error: () => {
        console.error('Error fetching posts list');
        this.router.navigate(['/bad-gateway']);
      },
    });
  }

  /**
   * Check if selected entity value is allowed
   *
   * @returns boolean
   */
  private checkAllowedEntityValue(post: PostInterface): boolean {
    const postLanguages = post.languages?.map((language) => language.name) || [];
    const postTechnologies = post.technologies?.map((technology) => technology.name) || [];
    const postTags = post.tags?.map((tag) => tag.name) || [];

    const allowedEntityValues: string[] = postLanguages.concat(postTechnologies, postTags);

    return !allowedEntityValues.includes(this.selectedEntityValue!);
  }
}
