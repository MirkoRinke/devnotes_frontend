import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { ApiService } from '../../services/api.service';

import type { PostTypes } from '../../interfaces/post-types.ts';
import type { ApiResponse } from '../../interfaces/api-response';

import { ApiEndpointEnums } from '../../enums/api-endpoint';
import { AllowedPostTypesEnums } from '../../enums/allowed-post-types';

@Component({
  selector: 'app-post-types-selection',
  imports: [],
  templateUrl: './post-types-selection.html',
  styleUrl: './post-types-selection.scss',
})
export class PostTypesSelection {
  selectedTech: string | null = null;
  postTypes: PostTypes[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe((params) => {
      const tech = params['tech'];
      const endPoint = params['endPoint'];
      const entity = params['entity'];

      if (!tech || !(endPoint in ApiEndpointEnums) || !entity) {
        this.router.navigate(['/']);
        return;
      }

      this.selectedTech = tech;

      this.getPostTypesForEntity(tech, endPoint, entity);
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
  getPostTypesForEntity(tech: string, endPoint: string, entity: string) {
    const options = {
      params: new HttpParams()
        .set('filter[post_type]', AllowedPostTypesEnums.ALL)
        .set(`filter[${entity}.name]`, `eq:${tech}`)
        .set('select', 'count:post_type'),
    };

    const url =
      ApiEndpointEnums[endPoint as keyof typeof ApiEndpointEnums] + '?' + options.params.toString();

    this.apiService.get<ApiResponse<PostTypes>>(url).subscribe({
      next: (response) => {
        this.postTypes = response.data.data;
        console.log(this.postTypes);
      },
      error: (error) => {
        console.error('Error fetching post types:', error);
      },
    });
  }
}
