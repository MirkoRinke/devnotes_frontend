import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { ApiService } from '../../services/api.service';

import type { PostTypesInterface } from '../../interfaces/post-types.ts';
import type { ApiResponseArrayInterface } from '../../interfaces/api-response';

import { ApiEndpointEnums } from '../../enums/api-endpoint';
import { AllowedPostTypesEnums } from '../../enums/allowed-post-types';
import { PostListAllowedEntitiesEnums } from '../../enums/post-list-allowed-entities';
import { RegexEnums } from '../../enums/regex';

@Component({
  selector: 'app-post-types-selection',
  imports: [RouterLink],
  templateUrl: './post-types-selection.html',
  styleUrl: './post-types-selection.scss',
})
export class PostTypesSelection {
  selectedEntityValue: string | null = null;
  selectedEntity: string | null = null;
  postTypes: PostTypesInterface[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const entityValue = params['entityValue'];
      const endPoint = params['endPoint'];
      const entity = params['entity'];

      if (!entityValue || !new RegExp(RegexEnums.entityValue).test(entityValue) || !Object.values(PostListAllowedEntitiesEnums).includes(entity) || !(endPoint in ApiEndpointEnums)) {
        this.router.navigate(['/']);
        return;
      }

      this.selectedEntityValue = entityValue;
      this.selectedEntity = entity;

      this.getPostTypesForEntity(entityValue, endPoint, entity);
    });
  }

  /**
   * Get the post types for the selected Entity
   *
   * @param tech
   * @param endPoint
   * @param entity
   * @param allowedPostTypes
   */
  getPostTypesForEntity(entityValue: string, endPoint: string, entity: string) {
    const options = {
      params: new HttpParams().set('filter[post_type]', AllowedPostTypesEnums.ALL).set(`filter[${entity}.name]`, `eq:${entityValue}`).set('select', 'count:post_type'),
    };

    const url = ApiEndpointEnums[endPoint as keyof typeof ApiEndpointEnums] + '?' + options.params.toString();

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
