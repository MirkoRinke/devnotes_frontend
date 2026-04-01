import { Component, Input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { skip, take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

import { AvailableValuesService } from '../../../services/available-values.service';
import { UserFavoriteTechnologiesService } from '../../../services/user-favorite-technologies.service';
import { SvgIconsService } from '../../../services/svg.icons.service';

import type { AvailableValuesInterface } from '../../../interfaces/available-values';

@Component({
  selector: 'app-post-tech-stack-selector',
  imports: [ReactiveFormsModule],
  templateUrl: './post-tech-stack-selector.html',
  styleUrl: './post-tech-stack-selector.scss',
})
export class PostTechStackSelector {
  @Input() controlLanguages: FormControl | null = null;
  @Input() controlTechnologies: FormControl | null = null;

  availableValues: AvailableValuesInterface[] = [];
  filteredValues: AvailableValuesInterface[] = [];

  favoriteValues: AvailableValuesInterface[] = [];

  enableSearch = false;

  favoriteTechStack: Array<string> = [];

  params = ['?filter[type]=technology,language&select=count:name'];
  endPoint = 'POST_ALLOWED_VALUES';

  constructor(
    private availableValuesService: AvailableValuesService,
    private userFavoriteTechnologiesService: UserFavoriteTechnologiesService,
    public svgIconsService: SvgIconsService,
  ) {}

  ngOnInit() {
    // console.log('controlLanguages', this.controlLanguages?.value);
    // console.log('controlTechnologies', this.controlTechnologies?.value);
    this.initDataStreams();
  }

  ngOnDestroy() {
    // For testing purposes, we log when the component is destroyed.
    console.log('PostTechStackSelector component destroyed');
  }

  /**
   * Initializes the data streams for available values and the user's favorite tech stack.
   * It uses combineLatest to wait for both the available values and the favorite tech stack to be loaded before processing the data.
   * The available values are sorted by total counts, and then execute the filtering logic to separate favorite values from available values based on the user's favorite tech stack.
   */
  private initDataStreams() {
    const availableValues$ = this.availableValuesService.getAvailableValues(this.params, this.endPoint).pipe(take(1));
    const favoriteTechStack$ = this.userFavoriteTechnologiesService.favoriteTechStack$.pipe(skip(1), take(1));

    combineLatest([availableValues$, favoriteTechStack$])
      .pipe(take(1))
      .subscribe(([allValues, favStack]) => {
        const sortedValues = allValues.sort((a, b) => b.total_counts - a.total_counts);

        this.filterValuesBasedOnFavorite(sortedValues, favStack);
      });
    this.userFavoriteTechnologiesService.loadFavoriteTechStack();
  }

  /**
   * Filters the available values based on the user's favorite tech stack. It separates the values into two arrays:
   * - `favoriteValues`: Contains values that are part of the user's favorite tech stack.
   * - `availableValues`: Contains values that are not part of the user's favorite tech stack.
   *
   * @param sortedValues - The sorted list of available values.
   * @param favStack - The user's favorite tech stack.
   */
  filterValuesBasedOnFavorite(sortedValues: AvailableValuesInterface[], favStack: Array<string>) {
    this.favoriteValues = sortedValues.filter((value) => favStack.includes(value.name));
    this.availableValues = sortedValues.filter((value) => !favStack.includes(value.name));

    console.log('favoriteValues (from combineLatest)', this.favoriteValues);
    console.log('availableValues (from combineLatest)', this.availableValues);

    this.setShowValuesLimit();
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
   * TODO: Implement the logic to handle the close action of the tech stack selector modal or dropdown.
   */
  onClose() {
    console.log('close');
  }
}
