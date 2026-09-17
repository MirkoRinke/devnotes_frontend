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
   * Handles the selection of a date in the datepicker. Updates the query parameter for the given key with the selected value.
   *
   * @param value The selected date value.
   * @param key The query parameter key associated with the datepicker.
   */
  public onSelect(value: string, key: string): void {
    const validYear = value.charAt(0) !== '0';
    this.updateDateParam(key, value && validYear ? value : null);
  }

  /**
   * Resets the datepicker for the given key, removing the associated query parameter from the URL.
   *
   * @param key
   */
  public resetDatePicker(key: string): void {
    this.updateDateParam(key, null);
  }

  /**
   * Updates the query parameter for the given key with the specified value. If the value is null, the parameter is removed from the URL.
   *
   * @param key
   * @param value
   */
  private updateDateParam(key: string, value: string | null): void {
    this.router.navigate([], {
      queryParams: { [key]: value || null, page: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
  }
}
