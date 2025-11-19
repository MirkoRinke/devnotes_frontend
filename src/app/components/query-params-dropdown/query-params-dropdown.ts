import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-query-params-dropdown',
  imports: [],
  templateUrl: './query-params-dropdown.html',
  styleUrl: './query-params-dropdown.scss',
})
export class QueryParamsDropdown {
  @Input() dropdownValues!: string[];
  @Input() key!: string;
  @Input() label!: string;
  @Input() placeholder!: string;

  constructor(private router: Router) {}

  onSelect(value: string) {
    if (value) {
      this.router.navigate([], {
        queryParams: { [this.key]: value },
        queryParamsHandling: 'merge',
      });
    } else {
      this.router.navigate([], {
        queryParams: { [this.key]: null },
        queryParamsHandling: 'merge',
      });
    }
  }
}
