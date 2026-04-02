import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { skip, take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

import { AvailableValuesService } from '../../../services/available-values.service';
import { UserFavoriteTechnologiesService } from '../../../services/user-favorite-technologies.service';
import { SvgIconsService } from '../../../services/svg.icons.service';

import type { AvailableValuesInterface } from '../../../interfaces/available-values';
import type { TechStackSelectedValueInterface } from '../../../interfaces/postForm';
@Component({
  selector: 'app-post-tech-stack-selector',
  imports: [ReactiveFormsModule],
  templateUrl: './post-tech-stack-selector.html',
  styleUrl: './post-tech-stack-selector.scss',
})
export class PostTechStackSelector {
  @Input() controlLanguages: FormControl | null = null;
  @Input() controlTechnologies: FormControl | null = null;
  @Input() params: Array<string> | null = null;
  @Input() endPoint: string | null = null;

  @Input() openModal = false;
  dataLoaded = false;

  @Output() closeModal = new EventEmitter<void>();

  availableValues: AvailableValuesInterface[] = [];
  favoriteValues: AvailableValuesInterface[] = [];

  filteredValues: AvailableValuesInterface[] = [];

  selectedValues: TechStackSelectedValueInterface[] = [];

  enableSearch = false;

  constructor(
    private availableValuesService: AvailableValuesService,
    private userFavoriteTechnologiesService: UserFavoriteTechnologiesService,
    public svgIconsService: SvgIconsService,
  ) {}

  ngOnInit() {
    console.log('Control Languages:', this.controlLanguages?.value);
    console.log('Control Technologies:', this.controlTechnologies?.value);
  }

  ngOnChanges() {
    if (this.openModal && this.params && this.endPoint) {
      if (!this.dataLoaded) {
        console.log('openModal is true and data is not loaded, initializing data streams');
        this.initDataStreams(this.params, this.endPoint);
        this.dataLoaded = true;
      }
      this.pushControlledValuesToSelected();
    }
  }

  /**
   * Pushes the current values from the form controls (languages and technologies) to the selectedValues array.
   */
  pushControlledValuesToSelected() {
    const controlValues = [...(this.controlLanguages?.value || []), ...(this.controlTechnologies?.value || [])];
    this.selectedValues = controlValues.map((value: TechStackSelectedValueInterface) => ({
      name: value.name,
      entity: value.entity,
    }));

    console.log('Selected Values:', this.selectedValues);
  }

  /**
   * Checks if a given value is currently selected by comparing it against the selectedValues array.
   *
   * @param value
   * @returns
   */
  ifSelected(value: AvailableValuesInterface): boolean {
    return this.selectedValues.some((selected) => selected.name === value.name);
  }

  /**
   * Toggles the selection of a value. If the value is already selected, it removes it from the selectedValues array
   * otherwise, it adds it to the selectedValues array
   *
   * @param value
   */
  toggleValue(value: AvailableValuesInterface) {
    const isSelected = this.ifSelected(value);
    if (isSelected) {
      const index = this.selectedValues.findIndex((selected) => selected.name === value.name);
      this.selectedValues.splice(index, 1);
    } else {
      this.selectedValues.push({ name: value.name, entity: value.entity });
    }
    console.log('Selected Values after toggle:', this.selectedValues);
  }

  ngOnDestroy() {
    console.log('PostTechStackSelector component destroyed');
  }

  /**
   * Initializes the data streams for available values and the user's favorite tech stack.
   * It uses combineLatest to wait for both the available values and the favorite tech stack to be loaded before processing the data.
   * The available values are sorted by total counts, and then execute the filtering logic to separate favorite values from available values based on the user's favorite tech stack.
   */
  private initDataStreams(params: Array<string>, endPoint: string) {
    const availableValues$ = this.availableValuesService.getAvailableValues(params, endPoint).pipe(take(1));
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
   * Handles the close action of the tech stack selector modal or dropdown.
   */
  onClose() {
    this.closeModal.emit();
  }

  /**
   * Pushes the selected values to the respective form controls for languages and technologies.
   * It filters the selected values based on their entity type and updates the form controls accordingly.
   */
  pushToControl() {
    if (this.controlLanguages) {
      this.controlLanguages.setValue(this.selectedValues.filter((v) => v.entity === 'language'));
    }

    if (this.controlTechnologies) {
      this.controlTechnologies.setValue(this.selectedValues.filter((v) => v.entity === 'technology'));
    }
  }
}
