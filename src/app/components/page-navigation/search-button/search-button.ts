import { Component, OnInit, Input, Output, EventEmitter, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';

import { SvgIconsService } from '../../../services/svg.icons.service';
import { SearchService } from '../../../services/search.service';

import { TranslatePipe } from '../../../i18n/translate-pipe';

import { AccessibleButtonDirective } from '../../../directives/accessible-button-directive';

@Component({
  selector: 'app-search-button',
  imports: [CommonModule, TranslatePipe, AccessibleButtonDirective],
  templateUrl: './search-button.html',
  styleUrl: './search-button.scss',
})
export class SearchButton implements OnInit {
  @Input() showSearch: boolean = false;

  @Output() toggleSearchEvent = new EventEmitter<void>();

  public hasSearchValue: boolean = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    public svgIconsService: SvgIconsService,
    public searchService: SearchService,
  ) {}

  ngOnInit(): void {
    this.searchValueInput();
  }

  /**
   * Emits an event to toggle the visibility of the search input. This method is typically called when the user clicks the search button.
   */
  public toggleSearch(): void {
    this.toggleSearchEvent.emit();
  }

  /**
   * Clears the search input and resets the search state in the SearchService. This method is typically called when the user clicks a "clear search" button.
   */
  public clearSearch(): void {
    this.searchService.searchValueInput(null);
  }

  /**
   * Subscribes to search value changes and filters tiles accordingly.
   */
  private searchValueInput(): void {
    this.searchService.searchValue$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((inputValue) => {
      this.hasSearchValue = inputValue ? inputValue.trim().length > 0 : false;
    });
  }
}
