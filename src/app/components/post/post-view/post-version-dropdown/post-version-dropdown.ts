import { Component, Input, Output, EventEmitter } from '@angular/core';

import type { PostInterface } from '../../../../interfaces/post';

import { LocalDatePipe } from '../../../../pipes/local-date-pipe';
import { DateFormatterService } from '../../../../services/date.formatter.service';

import { SvgIconsService } from '../../../../services/svg.icons.service';

@Component({
  selector: 'app-post-version-dropdown',
  imports: [LocalDatePipe],
  templateUrl: './post-version-dropdown.html',
  styleUrl: './post-version-dropdown.scss',
})
export class PostVersionDropdown {
  @Input() post!: PostInterface;

  @Output() versionSelected = new EventEmitter<number>();

  currentPost!: PostInterface;

  showDropdownValues = false;
  showDropdownAnimation = false;

  postVersionsValues: Array<{ label: string; value: number }> = [];

  constructor(
    private dateFormatterService: DateFormatterService,
    public svgIconsService: SvgIconsService,
  ) {}

  ngOnInit() {
    this.currentPost = this.post;
    this.createPostVersionsValues(this.post);
  }

  /**
   * Toggle post version dropdown
   */
  togglePostVersionDropdown() {
    if (this.postVersionsValues.length <= 1) {
      return;
    }

    if (this.showDropdownValues) {
      this.showDropdownAnimation = false;
    } else {
      this.showDropdownValues = true;
      requestAnimationFrame(() => (this.showDropdownAnimation = true));
    }
  }

  /**
   * Handle animation end events
   *
   * @param event
   */
  onAnimationEnd(event: AnimationEvent) {
    if (event.animationName.endsWith('animated-out')) {
      this.showDropdownValues = false;
    }
  }

  /**
   * Create post versions values for selector
   */
  createPostVersionsValues(post: PostInterface) {
    this.postVersionsValues = [{ label: this.dateFormatterService.toLocaleString(post.updated_at), value: -1 }];
    if (post.history && post.history.length > 0) {
      post.history.forEach((version, index) => {
        const label = `${this.dateFormatterService.toLocaleString(version.updated_at)}`;
        this.postVersionsValues.push({ label, value: index });
      });
    }
  }

  /**
   * Select post version
   * @param value
   */
  selectPostVersion(value: number) {
    this.versionSelected.emit(value);
    this.showDropdownAnimation = false;
  }
}
