import { Component, Input } from '@angular/core';

import type { PostInterface } from '../../../interfaces/post';
import type { PostResourceModalInterface } from '../../../interfaces/post-ressource-modal';

import { LocalDatePipe } from '../../../pipes/local-date-pipe';

import { PostResourceModal } from './post-resource-modal/post-resource-modal';

import { DateFormatterService } from '../../../services/date.formatter.service';
import { SvgIconsService } from '../../../services/svg.icons.service';
import { AuthService } from '../../../services/auth.service';
import { PostSettingsDropdown } from './post-settings-dropdown/post-settings-dropdown';
import { ReportModal } from '../../report-modal/report-modal';

@Component({
  selector: 'app-post-view',
  imports: [LocalDatePipe, PostResourceModal, PostSettingsDropdown, ReportModal],
  templateUrl: './post-view.html',
  styleUrl: './post-view.scss',
})
export class PostView {
  @Input() post!: PostInterface;
  @Input() selectedEntityValue!: string | null;
  @Input() selectedPostType!: string | null;

  currentPost!: PostInterface;

  postVersionsValues: Array<{ label: string; value: number }> = [];

  showDropdownValues = false;
  showDropdownAnimation = false;

  isPostResourceModalOpen = false;
  isPostResourceModalAnimating = false;

  isReportModalOpen = false;
  isReportModalAnimating = false;

  currentPostModal: PostResourceModalInterface = { title: '', resources: [], previews: [] };

  isCopied = false;
  copiedFailed = false;

  constructor(
    public svgIconsService: SvgIconsService,
    private dateFormatterService: DateFormatterService,
    public authService: AuthService,
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
   * Check if post has resources of specific type
   *
   * @param resourceType
   * @returns
   */
  hasResources(resourceType: 'images' | 'videos' | 'resources'): boolean {
    if (!this.currentPost.external_source_previews) {
      return false;
    }
    return this.currentPost.external_source_previews.some((preview) => preview.type === resourceType);
  }

  /**
   * Opens the Post Resource Modal.
   *
   * @param type
   * @returns
   */
  openResourceModal(type: 'images' | 'videos' | 'resources') {
    if (!this.currentPost.external_source_previews || !this.hasResources(type)) {
      return;
    }

    const filteredPreviews = this.currentPost.external_source_previews.filter((preview) => preview.type === type);

    this.currentPostModal = {
      title: type,
      resources: this.currentPost[type] || [],
      previews: filteredPreviews,
    };

    this.isPostResourceModalOpen = true;
    requestAnimationFrame(() => (this.isPostResourceModalAnimating = true));
  }

  /**
   * Closes the Post Resource Modal
   */
  closeResourceModal() {
    this.isPostResourceModalAnimating = false;
  }

  openReportModal() {
    this.isReportModalOpen = true;
    requestAnimationFrame(() => (this.isReportModalAnimating = true));
  }

  closeReportModal() {
    this.isReportModalAnimating = false;
  }

  /**
   * Handle animation end events
   *
   * @param event
   */
  onAnimationEnd(event: AnimationEvent) {
    //TODO Refactoring this later to 'fade-out'
    if (event.animationName.endsWith('animated-out') && this.showDropdownValues) {
      this.showDropdownValues = false;
    }

    if (event.animationName.endsWith('fade-out')) {
      if (this.isPostResourceModalOpen) {
        this.isPostResourceModalOpen = false;
        this.currentPostModal = { title: '', resources: [], previews: [] };
      }

      if (this.isReportModalOpen) {
        this.isReportModalOpen = false;
      }
    }
  }

  /**
   * Change post version
   *
   * @param versionIndex
   */
  onSelect(versionIndex: number) {
    if (this.post.history && versionIndex >= 0 && this.post.history.length > versionIndex) {
      console.log(this.post.history[versionIndex]);
      console.log(this.currentPost);

      this.currentPost = {
        ...this.post,
        ...this.post.history[versionIndex],
      };
    } else {
      this.currentPost = { ...this.post };
    }
  }

  /**
   * Copy code to clipboard
   */
  copyToClipboard(code: string = '') {
    navigator.clipboard
      .writeText(code || '')
      .then(() => {
        this.isCopied = true;
        setTimeout(() => (this.isCopied = false), 2000);
      })
      .catch((err) => {
        this.copiedFailed = true;
        setTimeout(() => (this.copiedFailed = false), 2000);
      });
  }

  /**
   * Check if current user is the owner of the post
   *
   * @param post
   * @returns
   */
  isOwner(post: PostInterface): boolean {
    return this.authService.getCurrentUserId() === post.user_id;
  }
}
