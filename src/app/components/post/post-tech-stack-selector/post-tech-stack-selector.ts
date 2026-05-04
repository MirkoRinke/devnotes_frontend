import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { skip, take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

import { AvailableValuesService } from '../../../services/available-values.service';
import { UserFavoriteTechnologiesService } from '../../../services/user-favorite-technologies.service';
import { SvgIconsService } from '../../../services/svg.icons.service';

import type { AvailableValuesInterface } from '../../../interfaces/available-values';
import type { TechStackSelectedValueInterface } from '../../../interfaces/post-form';

import { ApiEndpointEnums } from '../../../enums/api-endpoint';
@Component({
  selector: 'app-post-tech-stack-selector',
  imports: [ReactiveFormsModule],
  templateUrl: './post-tech-stack-selector.html',
  styleUrl: './post-tech-stack-selector.scss',
})
export class PostTechStackSelector {
  @Input() endPoint: keyof typeof ApiEndpointEnums | null = null;
  @Input() params: Array<string> | null = null;

  @Input() controlLanguages: FormControl | null = null;
  @Input() controlTechnologies: FormControl | null = null;

  @Input() enableSearch = false;
  isSearchActive = false;
  initialDisplayLimit = 20;

  @Input() openModal = false;
  dataLoaded = false;

  @Output() closeModal = new EventEmitter<void>();

  originalAvailableValues: AvailableValuesInterface[] = [];
  originalFavoriteValues: string[] = [];

  availableValues: AvailableValuesInterface[] = [];
  favoriteValues: AvailableValuesInterface[] = [];

  filteredValues: AvailableValuesInterface[] = [];

  selectedValues: TechStackSelectedValueInterface[] = [];

  constructor(
    private availableValuesService: AvailableValuesService,
    private userFavoriteTechnologiesService: UserFavoriteTechnologiesService,
    public svgIconsService: SvgIconsService,
  ) {}

  ngOnChanges() {
    if (this.openModal && this.params && this.endPoint) {
      this.resetSelectedValues();

      this.pushControlledValuesToSelected();
      if (!this.dataLoaded) {
        this.initDataStreams(this.params, this.endPoint);
      } else {
        this.sortBasedOnSelection();
      }
    }
  }

  /**
   * Resets the selected values if both form controls (languages and technologies) are pristine and have no values.
   * This ensures that the selectedValues array is cleared when the user has not made any selections in either control.
   */
  private resetSelectedValues() {
    const isEmptyAndPristine = (control: FormControl | null) => control?.pristine && !control?.value?.length;

    const isReset = isEmptyAndPristine(this.controlLanguages) && isEmptyAndPristine(this.controlTechnologies);

    if (isReset) {
      this.selectedValues = [];
    }
  }

  /**
   * Pushes the current values from the form controls (languages and technologies) to the selectedValues array.
   */
  private pushControlledValuesToSelected() {
    const langValues = this.controlLanguages?.value;
    const techValues = this.controlTechnologies?.value;

    if (this.selectedValues.length > 0 && !langValues && !techValues) {
      return;
    }

    const controlValues = [...(langValues || []), ...(techValues || [])];

    if (this.dataLoaded && controlValues.length === 0 && this.selectedValues.length > 0) {
      return;
    }

    this.selectedValues = controlValues.map((value: TechStackSelectedValueInterface) => ({
      name: value.name,
      entity: value.entity,
    }));
  }

  /**
   * Checks if a given value is currently selected by comparing it against the selectedValues array.
   *
   * @param value
   * @returns
   */
  public isSelected(value: AvailableValuesInterface): boolean {
    return this.selectedValues.some((selected) => selected.name === value.name);
  }

  /**
   * Toggles the selection of a value. If the value is already selected, it removes it from the selectedValues array
   * otherwise, it adds it to the selectedValues array
   *
   * @param value
   */
  public toggleValue(value: AvailableValuesInterface) {
    const isSelected = this.isSelected(value);
    if (isSelected) {
      const index = this.selectedValues.findIndex((selected) => selected.name === value.name);
      this.selectedValues.splice(index, 1);
    } else {
      this.selectedValues.push({ name: value.name, entity: value.entity });
    }
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
        this.originalAvailableValues = allValues;
        this.originalFavoriteValues = favStack;
        this.dataLoaded = true;
        this.filterValuesBasedOnFavorite();
      });
    this.userFavoriteTechnologiesService.loadFavoriteTechStack();
  }

  /**
   * Filters the available values based on the user's favorite tech stack. It separates the values into two arrays:
   * - `favoriteValues`: Contains values that are part of the user's favorite tech stack.
   * - `availableValues`: Contains values that are not part of the user's favorite tech stack.
   */
  private filterValuesBasedOnFavorite() {
    this.favoriteValues = this.originalAvailableValues.filter((value) => this.originalFavoriteValues.includes(value.name));
    this.availableValues = this.originalAvailableValues.filter((value) => !this.originalFavoriteValues.includes(value.name));
    this.sortBasedOnSelection();
  }

  /**
   * Sorts the available values and favorite values based on whether they are selected or not.
   * Selected values are prioritized at the top of the list, followed by non-selected values sorted by their total counts in descending order.
   */
  private sortBasedOnSelection() {
    const sortLogic = (a: AvailableValuesInterface, b: AvailableValuesInterface) => {
      const aIsSelected = this.isSelected(a);
      const bIsSelected = this.isSelected(b);

      if (aIsSelected && !bIsSelected) {
        return -1;
      }
      if (!aIsSelected && bIsSelected) {
        return 1;
      }
      return b.total_counts - a.total_counts;
    };

    this.favoriteValues = this.favoriteValues.sort(sortLogic);
    this.availableValues = this.availableValues.sort(sortLogic);

    this.setShowValuesLimit();
  }

  /**
   * Filters the dropdown values based on user input
   *
   * @param inputValue
   */
  public filterFunction(inputValue: string) {
    const input = (inputValue || '').toLowerCase().trim();
    if (input.length > 0) {
      this.filteredValues = this.originalAvailableValues.filter((value) => value.name.toLowerCase().startsWith(input));
      this.isSearchActive = true;
    } else {
      this.filteredValues = this.availableValues;
      this.isSearchActive = false;
    }
  }

  /**
   * Sets the limit of displayed values based on the enableSearch flag
   */
  private setShowValuesLimit() {
    if (this.enableSearch && !this.isSearchActive) {
      this.filteredValues = this.availableValues.slice(0, this.initialDisplayLimit);
    } else {
      this.filteredValues = this.availableValues;
    }
  }
  /**
   * Pushes the selected values to the respective form controls for languages and technologies.
   * It filters the selected values based on their entity type and updates the form controls accordingly.
   */
  public pushToControl() {
    if (this.controlLanguages) {
      this.controlLanguages.setValue(this.selectedValues.filter((v) => v.entity === 'language'));
    }

    if (this.controlTechnologies) {
      this.controlTechnologies.setValue(this.selectedValues.filter((v) => v.entity === 'technology'));
    }

    this.onClose();
  }

  /**
   * Handles the close action of the tech stack selector modal or dropdown.
   */
  private onClose() {
    this.closeModal.emit();
  }
}
