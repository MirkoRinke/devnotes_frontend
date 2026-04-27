import { Component, Input, Output, EventEmitter, SimpleChanges, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

import type { PostInterface } from '../../../interfaces/post';
import type { PostResourceModalInterface, PostResourceType } from '../../../interfaces/post-resource-modal';
import type { ExternalSourceInterface } from '../../../interfaces/post-external-source';

import { PostResourceModal } from './post-resource-modal/post-resource-modal';

import { SvgIconsService } from '../../../services/svg.icons.service';
import { AuthService } from '../../../services/auth.service';

import { PostSettingsDropdown } from './post-settings-dropdown/post-settings-dropdown';
import { ReportModal } from '../../report-modal/report-modal';
import { UserBadge } from '../../user-badge/user-badge';
import { PostVersionDropdown } from './post-version-dropdown/post-version-dropdown';
import { ReportButton } from '../../report-button/report-button';
import { PostEngagement } from '../post-engagement/post-engagement';
import { PostCode } from '../post-code/post-code';
import { PostTechStack } from '../post-tech-stack/post-tech-stack';
import { PostMediaLinks } from '../post-media-links/post-media-links';
import { PostTags } from '../post-tags/post-tags';
import { PostDescription } from '../post-description/post-description';
import { PostDelete } from '../post-delete/post-delete';

@Component({
  selector: 'app-post-view',
  imports: [
    PostResourceModal,
    PostSettingsDropdown,
    ReportModal,
    UserBadge,
    PostVersionDropdown,
    ReportButton,
    PostEngagement,
    PostCode,
    PostTechStack,
    PostMediaLinks,
    PostTags,
    PostDescription,
    PostDelete,
  ],
  templateUrl: './post-view.html',
  styleUrl: './post-view.scss',
})
export class PostView implements OnChanges {
  @Input() context: string | null = null;
  @Input() endPoint: string | null = null;

  @Input() selectedEntity: string | null = null;
  @Input() selectedEntityValue: string | null = null;
  @Input() selectedPostType: string | null = null;

  @Input() post: PostInterface | null = null;

  currentPost: PostInterface = {} as PostInterface;

  currentPostModal: PostResourceModalInterface = { title: '', type: null, postOwnerId: null, resources: [], previews: [] };
  isPostResourceModalOpen = false;
  isPostResourceModalAnimating = false;

  @Output() resourceRefreshRequest = new EventEmitter<string>();
  lastResourceRefreshType: PostResourceType = null;
  resourceFlags: ExternalSourceInterface = { images: false, videos: false, resources: false };

  isReportModalOpen = false;
  isReportModalAnimating = false;

  @Output() modeChange = new EventEmitter<string>();

  isDeleteModalOpen = false;
  isDeleteModalAnimating = false;

  constructor(
    public svgIconsService: SvgIconsService,
    public authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit() {
    if (this.post) {
      this.currentPost = this.post;
    } else {
      this.router.navigate(['/']);
    }
  }

  /**
   * Detect changes to the post input and update the currentPost accordingly
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['post'] && changes['post'].currentValue) {
      this.currentPost = changes['post'].currentValue;
      this.hasResources();
      if (this.lastResourceRefreshType !== null) {
        this.openResourceModal(this.lastResourceRefreshType);
        this.lastResourceRefreshType = null;
      }
    }
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
  openResourceModal(type: PostResourceType) {
    if (!this.currentPost.external_source_previews || type === null || !this.currentPost.user_id) {
      return;
    }

    const filteredPreviews = this.currentPost.external_source_previews.filter((preview) => preview.type === type);

    this.currentPostModal = {
      title: type,
      type: type,
      postOwnerId: this.currentPost.user_id,
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
   * Check if the post has resources of the specified type and set flags accordingly
   */
  hasResources() {
    if (this.currentPost.external_source_previews) {
      this.resourceFlags = {
        images: this.currentPost.external_source_previews.some((preview) => preview.type === 'images'),
        videos: this.currentPost.external_source_previews.some((preview) => preview.type === 'videos'),
        resources: this.currentPost.external_source_previews.some((preview) => preview.type === 'resources'),
      };
    }
  }

  /**
   * Enable external content and refresh resources in the modal
   */
  enableExternalContent(type: PostResourceType) {
    this.lastResourceRefreshType = type;
    this.resourceRefreshRequest.emit();
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
   * Open delete confirmation modal
   */
  onDeletePost() {
    this.isDeleteModalOpen = true;
    requestAnimationFrame(() => (this.isDeleteModalAnimating = true));
  }

  /**
   * Close delete confirmation modal
   */
  closeDeleteModal() {
    this.isDeleteModalAnimating = false;
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
        this.currentPostModal = { title: '', type: null, postOwnerId: null, resources: [], previews: [] };
      }

      if (this.isReportModalOpen) {
        this.isReportModalOpen = false;
      }

      if (this.isDeleteModalOpen) {
        this.isDeleteModalOpen = false;
      }
    }
  }

  /**
   * Change post version
   *
   * @param versionIndex
   */
  onSelect(versionIndex: number) {
    if (this.post && this.post.history && versionIndex >= 0 && this.post.history.length > versionIndex) {
      this.currentPost = {
        ...this.post,
        ...this.post.history[versionIndex],
      };
    } else if (this.post) {
      this.currentPost = { ...this.post };
    }
  }

  /**
   * Check if the current logged-in user is the owner of the post
   *
   * @param post
   * @returns
   */
  isOwner(post: PostInterface): boolean {
    return this.authService.isOwner(post?.user_id ?? null);
  }

  switchMode(mode: 'edit') {
    this.modeChange.emit(mode);
  }
}
