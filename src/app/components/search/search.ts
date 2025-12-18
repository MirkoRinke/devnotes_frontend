import { Component, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationStart } from '@angular/router';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { SvgIconsService } from '../../services/svg.icons.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-search',
  imports: [CommonModule],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements OnDestroy {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  private destroy$ = new Subject<void>();

  constructor(
    public svgIconsService: SvgIconsService,
    public searchService: SearchService,
    private router: Router,
  ) {}

  ngAfterViewInit(): void {
    this.router.events.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (this.searchInput && this.searchInput.nativeElement) {
          this.searchInput.nativeElement.value = '';
          this.searchService.searchValueInput('');
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
