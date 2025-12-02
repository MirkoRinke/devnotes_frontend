import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { ApiService } from '../../services/api.service';

import type { PostTypesInterface } from '../../interfaces/post-types.ts';
import type { ApiResponseArrayInterface } from '../../interfaces/api-response';
import type { PostTypesParamsInterface } from '../../interfaces/post-types-params';
import type { Params } from '@angular/router';

import { ApiEndpointEnums } from '../../enums/api-endpoint';
import { PostListAllowedEntitiesEnums } from '../../enums/post-list-allowed-entities';
import { RegexEnums } from '../../enums/regex';

@Component({
  selector: 'app-post-types-selection',
  imports: [RouterLink],
  templateUrl: './post-types-selection.html',
  styleUrl: './post-types-selection.scss',
})
export class PostTypesSelection {
  context: string | null = null;
  selectedEntityValue: string | null = null;
  selectedEntity: string | null = null;
  postTypes: PostTypesInterface[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const parsed = this.parseQueryParams(params);
      if (this.areParamsInvalid(parsed)) {
        this.router.navigate(['/']);
        return;
      }

      this.setSelectedValues(parsed);
      this.getPostTypesForEntity(parsed);
    });
  }

  /**
   * Parse query params
   *
   * @param params
   * @returns
   */
  private parseQueryParams(params: Params) {
    return {
      context: params['context'] ?? null,
      entityValue: params['entityValue'] ?? null,
      endPoint: params['endPoint'] ?? null,
      entity: params['entity'] ?? null,
    };
  }

  /**
   * Check if parsed params are valid
   *
   * @param param0
   * @returns
   */
  private areParamsInvalid(parsed: PostTypesParamsInterface): boolean {
    return (
      !parsed.entityValue ||
      !parsed.endPoint ||
      !new RegExp(RegexEnums.entityValue).test(parsed.entityValue) ||
      !Object.values(PostListAllowedEntitiesEnums).includes(parsed.entity as PostListAllowedEntitiesEnums) ||
      !(parsed.endPoint in ApiEndpointEnums)
    );
  }

  /**
   * Set selected values from parsed query params
   *
   * @param parsed
   */
  private setSelectedValues(parsed: PostTypesParamsInterface) {
    this.selectedEntityValue = parsed.entityValue;
    this.selectedEntity = parsed.entity;
    this.context = parsed.context;
  }

  /**
   * Get the post types for the selected Entity
   *
   * @param tech
   * @param endPoint
   * @param entity
   * @param allowedPostTypes
   */
  getPostTypesForEntity(parsed: PostTypesParamsInterface) {
    const options = {
      params: new HttpParams().set(`filter[${parsed.entity}.name]`, `eq:${parsed.entityValue}`).set('select', 'count:post_type'),
    };

    const url = ApiEndpointEnums[parsed.endPoint as keyof typeof ApiEndpointEnums] + '?' + options.params.toString();

    this.apiService.get<ApiResponseArrayInterface<PostTypesInterface>>(url).subscribe({
      next: (response) => {
        this.postTypes = this.sortAvailablePostTypes(response.data.data);

        if (this.postTypes.length === 0) {
          this.router.navigate(['/']);
          console.warn('No post types found for the selected entity and tech.');
        }
      },
      error: (error) => {
        console.error('Error fetching post types:', error);
      },
    });
  }

  /**
   * Sort available post types alphabetically
   *
   * @param postTypes
   * @returns
   */
  sortAvailablePostTypes(postTypes: PostTypesInterface[]): PostTypesInterface[] {
    return postTypes.sort((a, b) => a.name.localeCompare(b.name));
  }
}
