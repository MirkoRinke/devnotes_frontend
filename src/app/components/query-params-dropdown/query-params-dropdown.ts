import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { AvailableValuesService } from '../../services/available-values.service';
import { SvgIconsService } from '../../services/svg.icons.service';

import type { AvailableValuesInterface } from '../../interfaces/available-values';

@Component({
  selector: 'app-query-params-dropdown',
  imports: [],
  templateUrl: './query-params-dropdown.html',
  styleUrl: './query-params-dropdown.scss',
})
export class QueryParamsDropdown {
  @Input() label: string | null = null;
  @Input() key: string | null = null;
  @Input() defaultValueLabel: string | null = null;
  @Input() defaultValue: string | null = null;
  @Input() enableAllOption: boolean = false;
  @Input() enableSearch: boolean = false;

  @Input() endPoint: string | null = null;
  @Input() params: Array<string> | null = null;

  @Input() values: { [key: string]: string } | null = null;

  @Input() changeDetectionToken: string | null = null;

  availableValues: AvailableValuesInterface[] = [];
  filteredValues: AvailableValuesInterface[] = [];
  totalCount: number = 0;

  showDropdownValues = false;
  showAnimation = false;

  constructor(
    private router: Router,
    private availableValuesService: AvailableValuesService,
    public svgIconsService: SvgIconsService,
  ) {}

  /**
   * Detects changes in input properties and fetches available values if necessary
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this.changeDetectionToken && changes['changeDetectionToken']) {
      if (this.endPoint && this.params) {
        this.getAvailableValues(this.params, this.endPoint);
      }
    } else if (this.values) {
      this.availableValues = Object.keys(this.values).map((key) => ({ name: key, total_counts: 0, entity: '' }));
      this.setShowValuesLimit();
    }
  }

  /**
   * Fetches available values from the service based on provided params and endpoint
   */
  getAvailableValues(params: Array<string>, endPoint: string) {
    this.availableValuesService
      .getAvailableValues(params, endPoint)
      .pipe(take(1))
      .subscribe((availableValues) => {
        this.availableValues = availableValues.sort((a, b) => b.total_counts - a.total_counts);
        this.calculateTotalCount();
        this.setShowValuesLimit();
      });
  }

  /**
   * Calculates the total count of all available values
   */
  calculateTotalCount() {
    this.totalCount = this.availableValues.reduce((sum, current) => sum + current.total_counts, 0);
  }

  /**
   * Sets the limit of displayed values based on the enableSearch flag
   */
  setShowValuesLimit() {
    if (this.enableSearch) {
      this.filteredValues = this.availableValues.slice(0, 10);
    } else {
      this.filteredValues = this.availableValues;
    }
  }

  /**
   * Filters the dropdown values based on user input
   *
   * @param inputValue
   */
  filterFunction(inputValue: string) {
    const input = (inputValue || '').toLowerCase().trim();
    if (input.length > 0) {
      this.filteredValues = this.availableValues.filter((value) => value.name.toLowerCase().includes(input));
    } else {
      this.setShowValuesLimit();
    }
  }

  /**
   * Toggles the visibility of the dropdown values
   */
  toggleDropdown() {
    if (this.showDropdownValues) {
      this.showAnimation = false;
    } else {
      this.showDropdownValues = true;
      requestAnimationFrame(() => (this.showAnimation = true));
    }
  }

  /**
   * Handles the end of the animation to hide the dropdown values
   *
   * @param event
   */
  onAnimationEnd(event: AnimationEvent) {
    if (event.animationName.endsWith('animated-out')) {
      this.showDropdownValues = false;
    }
  }

  /**
   * Handles selection change in the dropdown component
   * Set or removes the query param in the URL based on selection
   *
   * @param value
   */
  onSelect(value: string, key: string) {
    if (value) {
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
    this.showDropdownValues = false;
  }
}
