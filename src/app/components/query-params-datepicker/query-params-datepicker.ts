import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SvgIconsService } from '../../services/svg.icons.service';

import { TranslatePipe } from '../../i18n/translate-pipe';
import { DatepickerConfigInterface } from '../../interfaces/query-params-datepicker';

@Component({
  selector: 'app-query-params-datepicker',
  imports: [TranslatePipe],
  templateUrl: './query-params-datepicker.html',
  styleUrl: './query-params-datepicker.scss',
})
export class QueryParamsDatepicker {
  @Input() config: DatepickerConfigInterface | null = null;

  constructor(
    private readonly router: Router,
    public readonly svgIconsService: SvgIconsService,
  ) {}

  /**
   * Handles selection change in the datepicker component
   * Set or removes the query param in the URL based on selection
   *
   * @param value
   */
  public onSelect(value: string, key: string): void {
    const validYear = value.charAt(0) !== '0';

    if (value && validYear) {
      this.router.navigate([], {
        queryParams: { [key]: value, page: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    } else {
      this.router.navigate([], {
        queryParams: { [key]: null, page: null },
        queryParamsHandling: 'merge',
        replaceUrl: true,
      });
    }
  }
}
