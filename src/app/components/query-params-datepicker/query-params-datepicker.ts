import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SvgIconsService } from '../../services/svg.icons.service';

@Component({
  selector: 'app-query-params-datepicker',
  imports: [],
  templateUrl: './query-params-datepicker.html',
  styleUrl: './query-params-datepicker.scss',
})
export class QueryParamsDatepicker {
  @Input() label!: string;
  @Input() key!: string;

  @Input() value!: string | null;
  @Input() min!: string | null;
  @Input() max!: string | null;

  constructor(
    private router: Router,
    public svgIconsService: SvgIconsService,
  ) {}

  ngOnInit() {}

  /**
   * Handles selection change in the datepicker component
   * Set or removes the query param in the URL based on selection
   *
   * @param value
   */
  onSelect(value: string) {
    if (value) {
      this.router.navigate([], {
        queryParams: { [this.key]: value, page: null },
        queryParamsHandling: 'merge',
      });
    } else {
      this.router.navigate([], {
        queryParams: { [this.key]: null, page: null },
        queryParamsHandling: 'merge',
      });
    }
  }
}
