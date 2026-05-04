import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpParams } from '@angular/common/http';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { ApiService } from '../../services/api.service';
import { SvgIconsService } from '../../services/svg.icons.service';
import { SearchService } from '../../services/search.service';
import { AuthService } from '../../services/auth.service';

import { TranslationService } from '../../i18n/translation.service';

import type { PostTypesInterface } from '../../interfaces/post-types.ts';
import type { ApiResponseArrayInterface } from '../../interfaces/api-response';
import type { PostTypesParamsInterface } from '../../interfaces/post-types-params';
import type { Params } from '@angular/router';

import { ApiEndpointEnums } from '../../enums/api-endpoint';
import { PostListAllowedEntitiesEnums } from '../../enums/post-list-allowed-entities';
import { RegexEnums } from '../../enums/regex';

import { TranslatePipe } from '../../i18n/translate-pipe';

@Component({
  selector: 'app-post-types-selection',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './post-types-selection.html',
  styleUrl: './post-types-selection.scss',
})
export class PostTypesSelection {
  context: PostTypesParamsInterface['context'] = null;
  endPoint: PostTypesParamsInterface['endPoint'] = null;
  selectedEntity: PostTypesParamsInterface['entity'] = null;
  selectedEntityValue: PostTypesParamsInterface['entityValue'] = null;

  postTypes: PostTypesInterface[] = [];
  filteredPostTypes: PostTypesInterface[] = [];

  totalCount: number = 0;
  allTypesOption: PostTypesInterface[] = [];

  currentUserId: number | null = null;

  private destroy$ = new Subject<void>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    public svgIconsService: SvgIconsService,
    public searchService: SearchService,
    private translationService: TranslationService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.currentUserId = this.authService.getCurrentUserId();
    this.route.queryParams.subscribe((params) => {
      const parsed = this.parseQueryParams(params);
      if (!this.areParamsValid(parsed)) {
        this.router.navigate(['/']);
        return;
      }

      const restrictedEndpoints = ['USER_POSTS', 'FAVORITE_POSTS'];
      if (parsed.endPoint && restrictedEndpoints.includes(parsed.endPoint) && this.currentUserId === null) {
        this.router.navigate(['/']);
        console.warn('User ID is not available. Redirecting to home page.');
        return;
      }

      this.setSelectedValues(parsed);
      this.getPostTypesForEntity(parsed);
      this.searchValueInput();

      this.searchService.cageIcon('tiles');
      this.searchService.enableSearch(true);
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();

    this.searchService.clear();
    this.searchService.enableSearch(false);
  }

  /**
   * Subscribe to search input changes
   */
  private searchValueInput(): void {
    this.searchService.searchValue$.pipe(takeUntil(this.destroy$)).subscribe((inputValue) => {
      this.filterFunction(inputValue || '');
    });
  }

  /**
   * Filter post types based on search input
   *
   * @param inputValue
   */
  private filterFunction(inputValue: string): void {
    const searchTerm = inputValue.toLowerCase().trim();
    this.filteredPostTypes = [...this.allTypesOption, ...this.postTypes];

    if (searchTerm.length > 0) {
      this.filteredPostTypes = this.filteredPostTypes.filter((postType) => {
        const matchOriginal = postType.name.toLowerCase().startsWith(searchTerm);

        const translationKey = `PostTypes.${postType.name}.title`;
        const translatedName = this.translationService.getTranslation(translationKey).toLowerCase();
        const matchTranslated = translatedName.startsWith(searchTerm);

        return matchOriginal || matchTranslated;
      });
    } else {
      this.filteredPostTypes = [...this.allTypesOption, ...this.postTypes];
    }
  }

  /**
   * Parse query params
   *
   * @param params
   * @returns
   */
  private parseQueryParams(params: Params): PostTypesParamsInterface {
    return {
      context: params['context'] ?? null,
      entity: params['entity'] ?? null,
      entityValue: params['entityValue'] ?? null,
      endPoint: params['endPoint'] ?? null,
    };
  }

  /**
   * Check if parsed params are valid
   *
   * @param parsed
   * @returns
   */
  private areParamsValid(parsed: PostTypesParamsInterface): boolean {
    return (
      (parsed.context === null || typeof parsed.context === 'string') &&
      parsed.endPoint !== null &&
      parsed.endPoint in ApiEndpointEnums &&
      parsed.entityValue !== null &&
      new RegExp(RegexEnums.entityValue).test(parsed.entityValue) &&
      Object.values(PostListAllowedEntitiesEnums).includes(parsed.entity as PostListAllowedEntitiesEnums)
    );
  }

  /**
   * Set selected values from parsed query params
   *
   * @param parsed
   */
  private setSelectedValues(parsed: PostTypesParamsInterface): void {
    this.context = parsed.context;
    this.endPoint = parsed.endPoint;
    this.selectedEntity = parsed.entity;
    this.selectedEntityValue = parsed.entityValue;
  }

  /**
   * Get the post types for the selected Entity
   *
   * @param parsed
   */
  private getPostTypesForEntity(parsed: PostTypesParamsInterface): void {
    let params = new HttpParams().set(`filter[${parsed.entity}.name]`, `eq:${parsed.entityValue}`).set('select', 'count:post_type');

    params = this.appendEndpointSpecificParams(params, parsed);

    const options = { params };

    const url = ApiEndpointEnums[parsed.endPoint as keyof typeof ApiEndpointEnums] + '?' + options.params.toString();

    this.apiService.get<ApiResponseArrayInterface<PostTypesInterface>>(url).subscribe({
      next: (response) => {
        this.postTypes = this.sortAvailablePostTypes(response.data.data);

        this.allTypesOption = this.createAllTypesOption();
        this.filteredPostTypes = [...this.allTypesOption, ...this.postTypes];

        this.searchService.dataLoaded(true);

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
   * Append endpoint specific filters to the query parameters based on the selected endpoint and other parameters.
   *
   * @param params
   * @param parsed
   * @returns
   */
  private appendEndpointSpecificParams(params: HttpParams, parsed: PostTypesParamsInterface): HttpParams {
    if (parsed.endPoint === 'POSTS') {
      return params.set('filter[status]', 'eq:published');
    }

    if (parsed.endPoint === 'USER_POSTS' && this.currentUserId !== null) {
      return params.set('filter[user_id]', `eq:${this.currentUserId}`);
    }

    return params;
  }

  /**
   * Sort available post types alphabetically
   *
   * @param postTypes
   * @returns
   */
  private sortAvailablePostTypes(postTypes: PostTypesInterface[]): PostTypesInterface[] {
    return postTypes.sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Create an option for "all_types" with the total count of all post types
   *
   * @returns
   */
  private createAllTypesOption(): PostTypesInterface[] {
    this.totalCount = this.calculateTotalCount();
    return [{ name: 'all_types', total_counts: this.totalCount, entity: 'post_type' }];
  }

  /**
   * Calculates the total count of all post types to be displayed in the "all_types" option
   */
  private calculateTotalCount(): number {
    return this.postTypes.reduce((sum, current) => sum + current.total_counts, 0);
  }

  /**
   * Get the query parameter value for the given name, returning null if the name is "all_types" or undefined.
   *
   * @param name
   * @returns
   */
  getQueryParam(name: string | undefined): string | null {
    if (!name || name === 'all_types') {
      return null;
    }
    return name;
  }
}
