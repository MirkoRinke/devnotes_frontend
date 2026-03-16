import { Component, input, Input } from '@angular/core';
import { SvgIconsService } from '../../../services/svg.icons.service';

import { ApiService } from '../../../services/api.service';
import { AuthService } from '../../../services/auth.service';

import { ApiEndpointEnums } from '../../../enums/api-endpoint';

import { PostInterface } from '../../../interfaces/post';

@Component({
  selector: 'app-post-engagement',
  imports: [],
  templateUrl: './post-engagement.html',
  styleUrl: './post-engagement.scss',
})
export class PostEngagement {
  @Input() post: PostInterface | null = null;

  isProcessingFavorites = false;
  isProcessingLike = false;

  isCopied = false;
  copiedFailed = false;

  @Input() isViewMode = true;

  constructor(
    public svgIconsService: SvgIconsService,
    private apiService: ApiService,
    public authService: AuthService,
  ) {}

  /**
   * Toggle like status of the post
   * @param postId ID of the post to toggle like status
   */
  toggleLike(post: PostInterface) {
    /**
     * Prevent multiple like/unlike requests and ensure user is logged in and not the owner of the post
     */
    if (this.isProcessingLike || !this.authService.isLoggedIn() || this.isOwner(post)) {
      return;
    }

    this.isProcessingLike = true;

    const url = ApiEndpointEnums.LIKES;

    let method: 'delete' | 'post' = post.is_liked ? 'delete' : 'post';

    post.is_liked = !post.is_liked;

    let data = {
      likeable_type: 'post',
      likeable_id: post.id,
    };

    this.apiService[method](url, data).subscribe({
      next: (response) => {
        post.likes_count = post.is_liked ? (post.likes_count ?? 0) + 1 : (post.likes_count ?? 0) - 1;
        this.isProcessingLike = false;
      },
      error: (error) => {
        post.is_liked = !post.is_liked;
        this.isProcessingLike = false;
      },
    });
  }

  /**
   * Toggle favorite status of the post
   * @param postId ID of the post to toggle favorite status
   */
  toggleFavorites(post: PostInterface) {
    /**
     * Prevent multiple favorite/unfavorite requests and ensure user is logged in
     */
    if (this.isProcessingFavorites || !this.authService.isLoggedIn()) {
      return;
    }

    this.isProcessingFavorites = true;

    const url = `${ApiEndpointEnums.POSTS}${post.id}${ApiEndpointEnums.TOGGLE_FAVORITE_SUFFIX}`;

    let method: 'delete' | 'post' = post.is_favorited ? 'delete' : 'post';

    post.is_favorited = !post.is_favorited;

    this.apiService[method](url).subscribe({
      next: (response) => {
        post.favorite_count = post.is_favorited ? (post.favorite_count ?? 0) + 1 : (post.favorite_count ?? 0) - 1;
        this.isProcessingFavorites = false;
      },
      error: (error) => {
        post.is_favorited = !post.is_favorited;
        this.isProcessingFavorites = false;
      },
    });
  }

  /**
   * Copy to clipboard
   * TODO: Implement share functionality to share post on social media platforms
   */
  sharePost() {
    const url = window.location.href;
    navigator.clipboard
      .writeText(url || '')
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
   * Check if the current user is the owner of the post
   *
   * @param post
   * @returns
   */
  isOwner(post: PostInterface | null): boolean {
    if (!post) {
      return false;
    }
    return this.authService.isOwner(post.user_id ?? null);
  }

  /**
   * Check if the user is logged in
   *
   * @returns
   */
  public isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  /**
   * Determines the appropriate icon name for the like button based on the post's like status and ownership.
   * - If the form is in 'create' mode or the post is null, it returns 'like_outline'.
   * - If the user is the owner of the post, it returns 'like'.
   * - Otherwise, it returns 'like' if the post is liked, and 'like_outline' if not.
   *
   * @param post
   * @returns
   */
  public getLikeIconName(post: PostInterface | null): string {
    if (!post) {
      return 'like_outline';
    }
    return post.is_liked || this.isOwner(post) ? 'like' : 'like_outline';
  }

  /**
   * Determines the appropriate icon name for the favorite button based on the post's favorite status and ownership.
   * - If the form is in 'create' mode or the post is null, it returns 'favorite_outline'.
   * - If the user is the owner of the post, it returns 'favorite'.
   * - Otherwise, it returns 'favorite' if the post is favorited, and 'favorite_outline' if not.
   *
   * @param post
   * @returns
   */
  public getFavoriteIconName(post: PostInterface | null): string {
    if (!post) {
      return 'favorite_outline';
    }
    return post.is_favorited ? 'favorite' : 'favorite_outline';
  }
}
