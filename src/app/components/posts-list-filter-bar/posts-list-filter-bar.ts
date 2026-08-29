import { Component, Input } from '@angular/core';

import { QueryParamsDropdown } from '../../components/query-params-dropdown/query-params-dropdown';
import { QueryParamsDatepicker } from '../../components/query-params-datepicker/query-params-datepicker';

import type { FilterValuesInterface } from '../../interfaces/posts-list-filter-bar';

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
}
