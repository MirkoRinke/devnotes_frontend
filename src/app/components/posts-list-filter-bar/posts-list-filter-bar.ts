import { Component, Input } from '@angular/core';

import { QueryParamsDropdown } from '../../components/query-params-dropdown/query-params-dropdown';
import { QueryParamsDatepicker } from '../../components/query-params-datepicker/query-params-datepicker';

import type { FilterValuesInterface, EntityLabelsInterface } from '../../interfaces/posts-list-filter-bar';

@Component({
  selector: 'app-posts-list-filter-bar',
  imports: [QueryParamsDropdown, QueryParamsDatepicker],
  templateUrl: './posts-list-filter-bar.html',
  styleUrl: './posts-list-filter-bar.scss',
})
export class PostsListFilterBar {
  @Input() filterValues: FilterValuesInterface | null = null;

  public changeDetectionValue(): string {
    return 'changeDetectionValues' + JSON.stringify(this.filterValues);
  }

  /**
   * Returns the label for the given entity key.
   * If the label key is not found, it returns a default value 'Entität'.
   *
   * @param labelKey The key of the entity for which to retrieve the label.
   * @returns The label corresponding to the given entity key, or 'Entität' if the key is not found.
   */
  selectedEntityLabel(labelKey: string): string {
    const entityLabels: EntityLabelsInterface = {
      entity: this.filterValues?.selectedEntity === 'languages' ? 'languages' : 'technologies',
      postTypes: 'postTypes',
      category: 'category',
      status: 'status',
      dateFrom: 'dateFrom',
      dateTo: 'dateTo',
      sort: 'sort',
    };

    return entityLabels[labelKey as keyof EntityLabelsInterface];
  }
}
