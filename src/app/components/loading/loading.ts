import { Component, Input } from '@angular/core';

import { TranslatePipe } from '../../i18n/translate-pipe';

import type { ParamsInterface } from '../../interfaces/error-handling';

@Component({
  selector: 'app-loading',
  imports: [TranslatePipe],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class Loading {
  @Input() params: ParamsInterface | null = null;

  /**
   * Returns the aria-label key based on the provided params.
   *
   * @returns
   */
  ariaLabelKey(): string {
    if (this.params) {
      return 'loadingParams';
    } else {
      return 'loading';
    }
  }

  /**
   * Returns the aria-label parameters based on the provided params.
   *
   * @returns
   */
  ariaLabelParams(): ParamsInterface | null {
    return this.params ? this.params : null;
  }
}
