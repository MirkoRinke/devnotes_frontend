import { Component, Input } from '@angular/core';

import type { PostInterface } from '../../../interfaces/post';

import { SvgIconsService } from '../../../services/svg.icons.service';

import { DateFormatterService } from '../../../services/date.formatter.service';
import { LocalDatePipe } from '../../../pipes/local-date-pipe';

@Component({
  selector: 'app-post-view',
  imports: [LocalDatePipe],
  templateUrl: './post-view.html',
  styleUrl: './post-view.scss',
})
export class PostView {
  @Input() post!: PostInterface;
  @Input() selectedEntityValue!: string | null;
  @Input() selectedPostType!: string | null;

  currentPost!: PostInterface;

  postVersionsValues: Array<{ label: string; value: number }> = [];
  dropdownOpen: boolean = false;

  constructor(
    public svgIconsService: SvgIconsService,
    private dateFormatterService: DateFormatterService,
  ) {}

  ngOnInit() {
    this.currentPost = this.post;
    this.createPostVersionsValues();
  }

  /**
   * Get avatar items entries
   *
   * @returns
   */
  avatarItemsEntries() {
    return this.post?.user?.avatar_items ? Object.entries(this.post.user.avatar_items).map(([key, url]) => ({ key, url })) : [];
  }

  /**
   * Create post versions values for selector
   */
  createPostVersionsValues() {
    this.postVersionsValues = [{ label: this.dateFormatterService.toLocaleString(this.post.updated_at), value: -1 }];
    if (this.post.history && this.post.history.length > 0) {
      this.post.history.forEach((version, index) => {
        const label = `${this.dateFormatterService.toLocaleString(version.updated_at)}`;
        this.postVersionsValues.push({ label, value: index });
      });
    }
  }

  /**
   * Toggle dropdown
   */
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  /**
   * Change post version
   *
   * @param versionIndex
   */
  changePostVersion(versionIndex: number) {
    if (this.post.history && versionIndex >= 0 && this.post.history.length > versionIndex) {
      this.currentPost = {
        ...this.post,
        ...this.post.history[versionIndex],
      };
    } else {
      this.currentPost = { ...this.post };
    }
  }
}
