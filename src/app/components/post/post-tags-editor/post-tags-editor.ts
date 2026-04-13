import { Component, Input, Output, EventEmitter, SimpleChanges } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { take } from 'rxjs/operators';
import { combineLatest } from 'rxjs';

import { AvailableValuesService } from '../../../services/available-values.service';

import { SvgIconsService } from '../../../services/svg.icons.service';

import type { AvailableValuesInterface } from '../../../interfaces/available-values';

interface TagValueInterface {
  name: string;
  entity: string;
}

@Component({
  selector: 'app-post-tags-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './post-tags-editor.html',
  styleUrl: './post-tags-editor.scss',
})
export class PostTagsEditor {
  @Input() control: FormControl | null = null;
  @Input() endPoint: string | null = null;
  @Input() params: Array<string> | null = null;
  @Input() specificCategory: string | null = null;

  @Input()
  @Input()
  enableSearch = false;
  isSearchActive = false;
  initialDisplayLimit = 10;

  @Input() openModal = false;
  dataLoaded = false;

  @Output() closeModal = new EventEmitter<void>();

  originalAvailableValues: AvailableValuesInterface[] = [];
  originalAvailableValuesSpecificCategory: AvailableValuesInterface[] = [];

  currentValues: AvailableValuesInterface[] = [];
  filteredValues: AvailableValuesInterface[] = [];
  specificCategoryValues: AvailableValuesInterface[] = [];
  newAddedValues: AvailableValuesInterface[] = [];

  selectedValues: TagValueInterface[] = [];

  constructor(
    public svgIconsService: SvgIconsService,
    private availableValuesService: AvailableValuesService,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['specificCategory'] && !changes['specificCategory'].firstChange && this.params && this.endPoint) {
      this.initDataStreams(this.params!, this.endPoint!);
      return;
    }

    if (this.openModal && this.params && this.endPoint) {
      this.pushControlledValuesToSelected();
      if (!this.dataLoaded) {
        this.initDataStreams(this.params, this.endPoint);
      } else {
        this.sortBasedOnSelection();
      }
    }
  }

  /**
   * Pushes the current values of the form control to the selectedValues array, ensuring that
   * the selected values are in sync with the form control's value when the modal is opened.
   */
  private pushControlledValuesToSelected() {
    const controlValues = [...(this.control?.value || [])];
    this.selectedValues = controlValues.map((value: TagValueInterface) => ({
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
   * Adds a new value to the selectedValues array if it is not already present.
   * The new value is trimmed of whitespace and checked for emptiness before being added.
   * If the new value is valid and not already selected, it is added to the selectedValues array with the specified entity type.
   *
   * @param newValue The new value to be added to the selectedValues array.
   * @returns void
   */
  public managedNewValues(newValue: string, task: 'add' | 'remove') {
    const trimmedValue = newValue.trim().toLowerCase();
    if (trimmedValue.length === 0) {
      return;
    }
    const newTag: TagValueInterface = { name: trimmedValue, entity: 'tags' };

    if (!this.selectedValues.some((value) => value.name === newTag.name) && task === 'add') {
      this.selectedValues.push(newTag);
    }
    if (!this.newAddedValues.some((value) => value.name === newTag.name) && task === 'add') {
      this.newAddedValues.push({ name: newTag.name, entity: newTag.entity, total_counts: 0 });
    }

    if (this.selectedValues.some((value) => value.name === newTag.name) && task === 'remove') {
      const index = this.selectedValues.findIndex((value) => value.name === newTag.name);
      this.selectedValues.splice(index, 1);
    }
    if (this.newAddedValues.some((value) => value.name === newTag.name) && task === 'remove') {
      const index = this.newAddedValues.findIndex((value) => value.name === newTag.name);
      this.newAddedValues.splice(index, 1);
    }
  }

  /**
   * Initializes the data streams for fetching available values based on the provided parameters and endpoint.
   *
   * @param params The parameters to be used for fetching available values.
   * @param endPoint The endpoint to be used for fetching available values.
   */
  private initDataStreams(params: Array<string>, endPoint: string) {
    const specificCategoryParams = [`?filter[category]=${this.specificCategory}&select=count:tags.name`];
    const specificCategoryEndPoint = 'POSTS';

    const availableValues$ = this.availableValuesService.getAvailableValues(params, endPoint).pipe(take(1));
    const availableValuesSpecificCategory$ = this.availableValuesService.getAvailableValues(specificCategoryParams, specificCategoryEndPoint).pipe(take(1));

    combineLatest([availableValues$, availableValuesSpecificCategory$])
      .pipe(take(1))
      .subscribe(([allValues, specificCategoryValues]) => {
        this.originalAvailableValues = allValues;
        this.originalAvailableValuesSpecificCategory = specificCategoryValues;
        this.dataLoaded = true;
        this.sortBasedOnSelection();
      });
  }

  /**
   * Sorts the available values based on their selection status and total counts.
   */
  private sortBasedOnSelection() {
    const sortLogic = (a: AvailableValuesInterface, b: AvailableValuesInterface) => {
      return b.total_counts - a.total_counts;
    };

    this.currentValues = [...this.originalAvailableValues.sort(sortLogic).filter((value) => this.isSelected(value))];
    this.specificCategoryValues = [...this.originalAvailableValuesSpecificCategory.sort(sortLogic).filter((value) => !this.isSelected(value))];

    this.setShowValuesLimit();
  }

  /**
   * Filters the available values based on the input value from the search field. If the input value is not empty,
   * it filters the original available values to include only those that start with the input value (case-insensitive).
   * If the input value is empty, it resets the filtered values to show all current values and deactivates the search state.
   *
   * @param inputValue The value entered in the search input field used to filter the available values.
   */
  public filterFunction(inputValue: string) {
    const input = (inputValue || '').toLowerCase().trim();
    if (input.length > 0) {
      this.filteredValues = this.originalAvailableValues.filter((value) => value.name.toLowerCase().startsWith(input));
      this.isSearchActive = true;
    } else {
      this.filteredValues = this.currentValues;
      this.isSearchActive = false;
    }
  }

  /**
   * Sets the limit for the number of values to be displayed based on the search state.
   * If search is enabled and not active, it limits the displayed values to the initial display limit.
   */
  private setShowValuesLimit() {
    if (this.enableSearch && !this.isSearchActive) {
      this.filteredValues = this.currentValues.slice(0, this.initialDisplayLimit);
      this.specificCategoryValues = this.specificCategoryValues.slice(0, this.initialDisplayLimit);
    } else {
      this.filteredValues = this.currentValues;
    }
  }

  /**
   * Pushes the currently selected values to the form control and emits the closeModal event to signal that the modal should be closed.
   */
  public pushToControl() {
    if (this.control) {
      this.control.setValue(this.selectedValues);
    }
    this.newAddedValues = [];
    this.onClose();
  }

  /**
   * Emits the closeModal event to signal that the modal should be closed.
   */
  public onClose() {
    this.closeModal.emit();
  }
}
