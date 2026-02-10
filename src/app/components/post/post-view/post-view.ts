import { Component, Input, Output, EventEmitter } from '@angular/core';

import type { PostInterface } from '../../../interfaces/post';
import type { PostResourceModalInterface } from '../../../interfaces/post-ressource-modal';

import { PostResourceModal } from './post-resource-modal/post-resource-modal';

import { SvgIconsService } from '../../../services/svg.icons.service';
import { AuthService } from '../../../services/auth.service';
import { PostSettingsDropdown } from './post-settings-dropdown/post-settings-dropdown';
import { ReportModal } from '../../report-modal/report-modal';
import { UserBadge } from '../../user-badge/user-badge';
import { PostVersionDropdown } from './post-version-dropdown/post-version-dropdown';
import { ReportButton } from '../../report-button/report-button';
import { PostEngagement } from './post-engagement/post-engagement';
import { PostCode } from './post-code/post-code';
import { PostTechStack } from './post-tech-stack/post-tech-stack';
import { PostMediaLinks } from './post-media-links/post-media-links';
import { PostTags } from './post-tags/post-tags';

@Component({
  selector: 'app-post-view',
  imports: [PostResourceModal, PostSettingsDropdown, ReportModal, UserBadge, PostVersionDropdown, ReportButton, PostEngagement, PostCode, PostTechStack, PostMediaLinks, PostTags],
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

  @Output() modeChange = new EventEmitter<string>();

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
   * Opens the Post Resource Modal.
   *
   * @param type
   * @returns
   */
  openResourceModal(type: 'images' | 'videos' | 'resources') {
    if (!this.currentPost.external_source_previews) {
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
   * Check if current user is the owner of the post
   *
   * @param post
   * @returns
   */
  isOwner(post: PostInterface): boolean {
    return this.authService.getCurrentUserId() === post.user_id;
  }
}
