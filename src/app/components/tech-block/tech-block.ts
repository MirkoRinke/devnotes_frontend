import { Component, Input } from '@angular/core';
import { take } from 'rxjs/operators';

import { TechTile } from '../tech-tile/tech-tile';

import type { AvailableValuesInterface } from '../../interfaces/available-values';

import { ApiEndpointEnums } from '../../enums/api-endpoint';

import { UserFavoriteTechnologiesService } from '../../services/user-favorite-technologies.service';
import { AvailableValuesService } from '../../services/available-values.service';

@Component({
  selector: 'app-tech-block',
  imports: [TechTile],
  templateUrl: './tech-block.html',
  styleUrl: './tech-block.scss',
})
export class TechBlock {
  @Input() heading!: string;
  @Input() endPoint!: string;
  @Input() params!: Array<string>;
  @Input() context?: string;

  constructor(private userFavoriteTechnologiesService: UserFavoriteTechnologiesService, private availableValuesService: AvailableValuesService) {}

  tiles: AvailableValuesInterface[] = [];
  favoriteTechStack: Array<string> = [];

  ngOnInit() {
    if (!this.params || this.params.length === 0) {
      console.error(`URL input is required for TechBlock component ${this.heading}`);
      return;
    }

    if (!(this.endPoint in ApiEndpointEnums)) {
      console.error(`Invalid endPoint provided to TechBlock component ${this.heading}`);
      return;
    }

    this.getAvailableValues();
    this.getUserFavoriteTechStack();
  }

  /**
   * Fetches available values from the service and sorts them before assigning to tiles.
   */
  private getAvailableValues() {
    this.availableValuesService
      .getAvailableValues(this.params, this.endPoint)
      .pipe(take(1))
      .subscribe((availableValues) => {
        this.tiles = this.sortAvailableValues(availableValues);
      });
  }

  /**
   * Sorts available values by total_counts descending and then by name ascending.
   *
   * @param availableValues
   * @returns
   */
  private sortAvailableValues(availableValues: AvailableValuesInterface[]): AvailableValuesInterface[] {
    return availableValues.sort((a, b) => {
      if (b.total_counts !== a.total_counts) {
        return b.total_counts - a.total_counts;
      }
      return a.name.localeCompare(b.name);
    });
  }

  /**
   * Fetches the user's favorite tech stack from the service.
   */
  private getUserFavoriteTechStack() {
    this.userFavoriteTechnologiesService.favoriteTechStack$.subscribe((stack) => {
      this.favoriteTechStack = stack;
    });
    this.userFavoriteTechnologiesService.loadFavoriteTechStack();
  }
}
