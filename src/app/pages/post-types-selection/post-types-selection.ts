import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { ApiService } from '../../services/api.service';

import type { PostTypes } from '../../interfaces/post-types.ts';
import type { ApiResponse } from '../../interfaces/api-response';

import { ApiEndpointName } from '../../enums/api-endpoint';

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

      console.log('Query Params:', params);

      if (!tech || !endPoint || !entity) {
        this.router.navigate(['/']);
        return;
      }

      this.selectedTech = tech;
      this.getPostTypes(tech, endPoint, entity);
    });
  }

  getPostTypes(tech: string, endPoint: string, entity: string) {
    const options = {
      params: new HttpParams()
        .set('filter[post_type]', 'tutorial,snippet,feedback,showcase,question,resources')
        .set(`filter[${entity}.name]`, `eq:${tech}`)
        .set('select', 'count:post_type'),
    };

    const url =
      ApiEndpointName[endPoint as keyof typeof ApiEndpointName] + '?' + options.params.toString();

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
