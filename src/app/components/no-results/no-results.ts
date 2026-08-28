import { Component, Input } from '@angular/core';

import { TranslatePipe } from '../../i18n/translate-pipe';

import type { ParamsInterface } from '../../interfaces/error-handling';

@Component({
  selector: 'app-no-results',
  imports: [TranslatePipe],
  templateUrl: './no-results.html',
  styleUrl: './no-results.scss',
})
export class NoResults {
  @Input() params: ParamsInterface | null = null;

  /**
   * Returns the aria-label key based on the provided params.
   *
   * @returns
   */
  public ariaLabelKey(): string {
    if (this.params) {
      return 'noResultsParams';
    } else {
      return 'noResults';
    }
  }

  /**
   * Returns the aria-label parameters based on the provided params.
   *
   * @returns
   */
  public ariaLabelParams(): ParamsInterface | null {
    return this.params ? this.params : null;
  }
}
