import { Component, Input, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AvailableValuesService } from '../../services/available-values.service';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-query-params-dropdown',
  imports: [],
  templateUrl: './query-params-dropdown.html',
  styleUrl: './query-params-dropdown.scss',
})
export class QueryParamsDropdown {
  @Input() label!: string;
  @Input() key!: string;
  @Input() defaultValueLabel!: string | null;
  @Input() defaultValue!: string | null;
  @Input() enableAllOption!: boolean;

  @Input() endPoint!: string;
  @Input() params!: Array<string>;

  @Input() valuesLabel!: string[];
  @Input() values!: string[];

  @Input() changeDetection!: string;

  dropdownValues: string[] = [];

  constructor(private router: Router, private availableValuesService: AvailableValuesService) {}

  /**
   * Detects changes in input properties and fetches available values if necessary
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if (this.changeDetection && changes['changeDetection']) {
      if (this.endPoint && this.params) {
        this.getAvailableValues();
      }
    } else if (this.values) {
      this.dropdownValues = this.values;
    }
  }

  /**
   * Fetches available values from the service based on provided params and endpoint
   */
  getAvailableValues() {
    console.log('Fetching available values for', this.key);
    this.availableValuesService
      .getAvailableValues(this.params, this.endPoint)
      .pipe(take(1))
      .subscribe((availableValues) => {
        this.dropdownValues = availableValues.map((value) => value.name);
      });
  }

  /**
   * Handles selection change in the dropdown component
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
