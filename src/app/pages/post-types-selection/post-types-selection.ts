import { Component, inject, DestroyRef, OnInit, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpParams } from '@angular/common/http';

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
import { NoResults } from '../../components/no-results/no-results';
import { Loading } from '../../components/loading/loading';

@Component({
  selector: 'app-post-types-selection',
  imports: [RouterLink, TranslatePipe, NoResults, Loading],
  templateUrl: './post-types-selection.html',
  styleUrl: './post-types-selection.scss',
})
export class PostTypesSelection implements OnInit, OnDestroy {
  public context: PostTypesParamsInterface['context'] = null;
  public endPoint: PostTypesParamsInterface['endPoint'] = null;
  public selectedEntity: PostTypesParamsInterface['entity'] = null;
  public selectedEntityValue: PostTypesParamsInterface['entityValue'] = null;

  public isLoading: boolean = true;
  public postTypes: PostTypesInterface[] = [];
  public filteredPostTypes: PostTypesInterface[] = [];

  private totalCount: number = 0;
  private allTypesOption: PostTypesInterface[] = [];

  private currentUserId: number | null = null;

  private readonly destroyRef = inject(DestroyRef);

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly apiService: ApiService,
    public readonly svgIconsService: SvgIconsService,
    public readonly searchService: SearchService,
    private readonly translationService: TranslationService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.currentUserId = this.authService.getCurrentUserId();
    this.processQueryParams();
  }

  ngOnDestroy(): void {
    this.searchService.clear();
    this.searchService.enableSearch(false);
  }

  private processQueryParams(): void {
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((params) => {
      const parsed = this.parseQueryParams(params);
      if (!this.areParamsValid(parsed)) {
        console.warn('Invalid query parameters');
        this.router.navigate(['/bad-gateway']);
        return;
      }

      const restrictedEndpoints = ['USER_POSTS', 'FAVORITE_POSTS'];
      if (parsed.endPoint && restrictedEndpoints.includes(parsed.endPoint) && this.currentUserId === null) {
        console.warn('Invalid access attempt to restricted endpoint without authentication');
        this.router.navigate(['/bad-gateway']);
        return;
      }

      this.setSelectedValues(parsed);
      this.getPostTypesForEntity(parsed);
      this.searchValueInput();

      this.searchService.cageIcon('tiles');
      this.searchService.enableSearch(true);
    });
  }

  /**
   * Subscribe to search input changes
   */
  private searchValueInput(): void {
    this.searchService.searchValue$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((inputValue) => {
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

        const translationKey = `PostTypes.tile.${postType.name}.title`;
        const translatedName = this.translationService.getTranslation(translationKey).toLowerCase();
        const matchTranslated = translatedName.startsWith(searchTerm);

        return matchOriginal || matchTranslated;
      });
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
    const isContextValid = parsed.context === null || typeof parsed.context === 'string';
    const isEndPointValid = parsed.endPoint !== null && parsed.endPoint in ApiEndpointEnums;
    const isEntityValueValid = parsed.entityValue !== null && new RegExp(RegexEnums.entityValue).test(parsed.entityValue);
    const isEntityValid = Object.values(PostListAllowedEntitiesEnums).includes(parsed.entity as PostListAllowedEntitiesEnums);

    return isContextValid && isEndPointValid && isEntityValueValid && isEntityValid;
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

        this.isLoading = false;
      },
      error: () => {
        this.router.navigate(['/bad-gateway']);
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
  public getQueryParam(name: string | undefined): string | null {
    if (!name || name === 'all_types') {
      return null;
    }
    return name;
  }
}
