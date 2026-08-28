import { Component, Input, OnInit, OnDestroy } from '@angular/core';

import { TranslatePipe } from '../../i18n/translate-pipe';

import type { ParamsInterface } from '../../interfaces/error-handling';

@Component({
  selector: 'app-loading',
  imports: [TranslatePipe],
  templateUrl: './loading.html',
  styleUrl: './loading.scss',
})
export class Loading implements OnInit, OnDestroy {
  @Input() params: ParamsInterface | null = null;

  public showLoadingIndicator = false;

  private readonly defaultTimeout = 1000;
  private showTimeout?: ReturnType<typeof setTimeout>;

  ngOnInit(): void {
    this.showLoading();
  }

  ngOnDestroy(): void {
    clearTimeout(this.showTimeout);
  }

  private showLoading(): void {
    this.showTimeout = setTimeout(() => {
      this.showLoadingIndicator = true;
    }, this.defaultTimeout);
  }

  /**
   * Returns the aria-label key based on the provided params.
   *
   * @returns
   */
  public ariaLabelKey(): string {
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
  public ariaLabelParams(): ParamsInterface | null {
    return this.params ? this.params : null;
  }
}
