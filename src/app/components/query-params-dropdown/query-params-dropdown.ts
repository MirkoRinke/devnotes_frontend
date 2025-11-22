import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UsedTechnologiesService } from '../../services/used-technologies.service';
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

  dropdownValues: string[] = [];

  constructor(private router: Router, private usedTechnologiesService: UsedTechnologiesService) {}

  ngOnInit() {}

  ngOnChanges() {
    if (this.endPoint && this.params) {
      this.getUsedTechnologies();
    } else if (this.values) {
      this.dropdownValues = this.values;
    }
  }

  getUsedTechnologies() {
    this.usedTechnologiesService
      .getUsedTechnologies(this.params, this.endPoint)
      .pipe(take(1))
      .subscribe((technologies) => {
        this.dropdownValues = technologies.map((tech) => tech.name);
      });
  }

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
