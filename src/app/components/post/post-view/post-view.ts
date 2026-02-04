import { Component, Input } from '@angular/core';

import type { PostInterface } from '../../../interfaces/post';
import type { PostResourceModalInterface } from '../../../interfaces/post-ressource-modal';

import { PostResourceModal } from './post-resource-modal/post-resource-modal';

import { SvgIconsService } from '../../../services/svg.icons.service';
import { AuthService } from '../../../services/auth.service';
import { PostSettingsDropdown } from './post-settings-dropdown/post-settings-dropdown';
import { ReportModal } from '../../report-modal/report-modal';
import { UserBadge } from '../../user-badge/user-badge';
import { PostVersionDropdown } from './post-version-dropdown/post-version-dropdown';

@Component({
  selector: 'app-post-view',
  imports: [PostResourceModal, PostSettingsDropdown, ReportModal, UserBadge, PostVersionDropdown],
  templateUrl: './post-view.html',
  styleUrl: './post-view.scss',
})
export class PostView {
  @Input() post!: PostInterface;
  @Input() selectedEntityValue!: string | null;
  @Input() selectedPostType!: string | null;

  currentPost!: PostInterface;

  currentPostModal: PostResourceModalInterface = { title: '', resources: [], previews: [] };
  isPostResourceModalOpen = false;
  isPostResourceModalAnimating = false;

  isReportModalOpen = false;
  isReportModalAnimating = false;

  isCopied = false;
  copiedFailed = false;

  constructor(
    public svgIconsService: SvgIconsService,
    public authService: AuthService,
  ) {}

  ngOnInit() {
    this.currentPost = this.post;
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

  /**
   * Open Report Modal
   */
  openReportModal() {
    this.isReportModalOpen = true;
    requestAnimationFrame(() => (this.isReportModalAnimating = true));
  }

  /**
   * Close Report Modal
   */
  closeReportModal() {
    this.isReportModalAnimating = false;
  }

  /**
   * Handle animation end events
   *
   * @param event
   */
  onAnimationEnd(event: AnimationEvent) {
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
