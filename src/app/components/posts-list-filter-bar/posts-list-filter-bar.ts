import { Component, Input, ElementRef, ViewChild, HostListener, inject, DestroyRef } from '@angular/core';
import { Subject, Subscription } from 'rxjs';

import { debounceTime } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { NgTemplateOutlet } from '@angular/common';

import { QueryParamsDropdown } from '../../components/query-params-dropdown/query-params-dropdown';
import { QueryParamsDatepicker } from '../../components/query-params-datepicker/query-params-datepicker';

import { ClickOutsideDirective } from '../../directives/click-outside.directive';
import { EscapeCloseDirective } from '../../directives/escape-close.directive';

import { SvgIconsService } from '../../services/svg.icons.service';

import type { FilterValuesInterface, EntityLabelsInterface } from '../../interfaces/posts-list-filter-bar';

@Component({
  selector: 'app-posts-list-filter-bar',
  imports: [QueryParamsDropdown, QueryParamsDatepicker, ClickOutsideDirective, EscapeCloseDirective, NgTemplateOutlet],
  templateUrl: './posts-list-filter-bar.html',
  styleUrl: './posts-list-filter-bar.scss',
})
export class PostsListFilterBar {
  @Input() filterValues: FilterValuesInterface | null = null;

  public showMoreFilters: boolean = false;
  public showAnimation = false;

  private filterContainer: ElementRef | null = null;
  public filterChildrenCount: number = 0;
  public windowsWidth: number = window.innerWidth;

  private resize$ = new Subject<void>();

  private readonly destroyRef = inject(DestroyRef);

  constructor(public readonly svgIconsService: SvgIconsService) {}

  ngOnInit(): void {
    this.initResizeSubscription();
  }

  public changeDetectionValue(): string {
    return 'changeDetectionValues' + JSON.stringify(this.filterValues);
  }

  /**
   * Returns the label for the given entity key.
   * If the label key is not found, it returns a default value 'Entität'.
   *
   * @param labelKey The key of the entity for which to retrieve the label.
   * @returns The label corresponding to the given entity key, or 'Entität' if the key is not found.
   */
  selectedEntityLabel(labelKey: string): string {
    const entityLabels: EntityLabelsInterface = {
      entity: this.filterValues?.selectedEntity === 'languages' ? 'languages' : 'technologies',
      postTypes: 'postTypes',
      category: 'category',
      status: 'status',
      dateFrom: 'dateFrom',
      dateTo: 'dateTo',
      sort: 'sort',
    };

    return entityLabels[labelKey as keyof EntityLabelsInterface];
  }

  /**
   * Toggles the visibility of the secondary filters section.
   * If the section is currently visible, it triggers the fade-out animation.
   * If the section is currently hidden, it makes the section visible and triggers the fade-in animation.
   */
  public toggleMoreFilters(): void {
    if (this.showMoreFilters) {
      this.showAnimation = false;
    } else {
      this.showMoreFilters = true;
      requestAnimationFrame(() => (this.showAnimation = true));
    }
  }

  /**
   * Handles the end of the fade-out animation for the secondary filters section.
   *
   * @param event
   */
  public onAnimationEnd(event: AnimationEvent): void {
    if (event.animationName.endsWith('animated-out-filters')) {
      this.showMoreFilters = false;
    }
  }

  /**
   * Sets the reference to the filter container element and updates the count of its child elements.
   *
   * @param element The reference to the filter container element.
   */
  @ViewChild('filter') public set filterContainerRef(element: ElementRef) {
    if (element && element.nativeElement) {
      this.filterContainer = element;
      requestAnimationFrame(() => {
        this.filterChildrenCountValue();
      });
    }
  }

  private filterChildrenCountValue() {
    if (this.filterContainer) {
      this.filterChildrenCount = this.filterContainer.nativeElement.children.length;
    }
  }

  /**
   * Handles window resize events.
   */
  @HostListener('window:resize')
  public onResize(): void {
    this.resize$.next();
  }

  /**
   * Initializes the resize subscription to handle window resize events.
   */
  private initResizeSubscription(): void {
    this.resize$.pipe(debounceTime(200), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.windowsWidth = window.innerWidth;
      requestAnimationFrame(() => {
        this.filterChildrenCountValue();
      });
    });
  }
}
