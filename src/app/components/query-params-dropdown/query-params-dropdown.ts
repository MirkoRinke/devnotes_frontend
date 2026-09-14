import { Component, Input, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';

import { AvailableValuesService } from '../../services/available-values.service';
import { SvgIconsService } from '../../services/svg.icons.service';

import { TranslatePipe } from '../../i18n/translate-pipe';

import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { RovingFocusDirective } from '../../directives/roving-focus.directive';
import { EscapeCloseDirective } from '../../directives/escape-close.directive';

import type { AvailableValuesInterface } from '../../interfaces/available-values';
import type { DropdownDisplayConfigInterface, DropdownFeaturesInterface } from '../../interfaces/query-params-dropdown';

import { ApiEndpointEnums } from '../../enums/api-endpoint';

@Component({
  selector: 'app-query-params-dropdown',
  imports: [ClickOutsideDirective, TranslatePipe, RovingFocusDirective, EscapeCloseDirective],
  templateUrl: './query-params-dropdown.html',
  styleUrl: './query-params-dropdown.scss',
})
export class QueryParamsDropdown {
  @Input() mode: 'URL' | 'Component' | null = null;

  @Input() features: DropdownFeaturesInterface | null = null;
  @Input() display: DropdownDisplayConfigInterface | null = null;

  @Input() endPoint: keyof typeof ApiEndpointEnums | null = null;
  @Input() params: Array<string> | null = null;

  @Input() values: { [key: string]: string } | null = null;

  @Input() changeDetectionToken: string | null = null;

  @Output() selectionChange = new EventEmitter<string>();

  public availableValues: AvailableValuesInterface[] = [];
  public filteredValues: AvailableValuesInterface[] = [];
  public totalCount: number = 0;

  public showDropdownValues = false;
  public showAnimation = false;

  private searchTimeout?: ReturnType<typeof setTimeout>;
  public showAriaCounter = false;

  constructor(
    private readonly router: Router,
    private readonly availableValuesService: AvailableValuesService,
    public readonly svgIconsService: SvgIconsService,
  ) {}

  /**
   * Initializes the component and fetches available values if necessary
   */
  ngOnInit(): void {
    if (this.endPoint && this.params && this.mode === 'Component') {
      this.getAvailableValues(this.params, this.endPoint);
    }
  }

  /**
   * Detects changes in input properties and fetches available values if necessary
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.changeDetectionToken && changes['changeDetectionToken']) {
      if (this.endPoint && this.params) {
        this.getAvailableValues(this.params, this.endPoint);
      }
    } else if (changes['values'] && this.values) {
      this.availableValues = Object.keys(this.values).map((key) => ({ name: key, total_counts: 0, entity: '' }));
      this.setShowValuesLimit();
    }
  }

  /**
   * Fetches available values from the service based on provided params and endpoint
   */
  private getAvailableValues(params: Array<string>, endPoint: keyof typeof ApiEndpointEnums): void {
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
  private calculateTotalCount(): void {
    this.totalCount = this.availableValues.reduce((sum, current) => sum + current.total_counts, 0);
  }

  /**
   * Derives the displayed selection label from the raw value, falling back to the empty-state text when unset
   */
  public get selectedLabel(): string | null {
    const value = this.display?.currentValue;
    if (!value) {
      return this.display?.emptyStateLabel ?? null;
    }
    return this.values?.[value] ?? value;
  }

  /**
   * Sets the limit of displayed values based on the enableSearch flag
   */
  private setShowValuesLimit(): void {
    if (this.features?.enableSearch) {
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
  public filterFunction(inputValue: string): void {
    this.showAriaCounter = false;
    const input = (inputValue || '').toLowerCase().trim();
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
    }

    if (input.length > 0) {
      this.filteredValues = this.availableValues.filter((value) => value.name.toLowerCase().startsWith(input));
      this.searchTimeout = setTimeout(() => {
        this.showAriaCounter = this.filteredValues.length > 0;
      }, 500);
    } else {
      this.setShowValuesLimit();
    }
  }

  /**
   * Toggles the visibility of the dropdown values
   */
  public toggleDropdown(): void {
    if (this.showDropdownValues) {
      this.showAnimation = false;
    } else {
      this.showDropdownValues = true;
      requestAnimationFrame(() => (this.showAnimation = true));
    }
  }

  /**
   * Closes the dropdown values with an animation
   * This method is called when a click outside the dropdown is detected
   */
  public closeDropdown(): void {
    this.showAnimation = false;
  }

  /**
   * Handles the end of the animation to hide the dropdown values
   *
   * @param event
   */
  public onAnimationEnd(event: AnimationEvent): void {
    if (event.animationName.endsWith('animated-out')) {
      this.showDropdownValues = false;
      this.filterFunction('');
    }
  }

  /**
   * Dispatches the selection via URL navigation or the component output, depending on the configured mode
   */
  public select(value: string): void {
    if (this.mode === 'URL' && this.display?.key) {
      this.onSelectURL(value, this.display.key);
    } else if (this.mode === 'Component') {
      this.onSelectComponent(value);
    }
  }

  /**
   * Handles selection change in the dropdown component
   * Set or removes the query param in the URL based on selection
   *
   * @param value
   */
  private onSelectURL(value: string, key: string): void {
    this.router.navigate([], {
      queryParams: { [key]: value || null, page: null },
      queryParamsHandling: 'merge',
      replaceUrl: true,
    });
    this.showDropdownValues = false;
  }

  /**
   * Handles selection change in the dropdown component for Component mode
   * Emits the selected value to the parent component
   *
   * @param value
   */
  private onSelectComponent(value: string): void {
    this.selectionChange.emit(value);
    this.showAnimation = false;
  }
}
