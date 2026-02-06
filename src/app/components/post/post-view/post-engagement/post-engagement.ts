import { Component, Input } from '@angular/core';
import { SvgIconsService } from '../../../../services/svg.icons.service';

@Component({
  selector: 'app-post-engagement',
  imports: [],
  templateUrl: './post-engagement.html',
  styleUrl: './post-engagement.scss',
})
export class PostEngagement {
  @Input() likesCount: number | null = 0;
  @Input() favoritesCount: number | null = 0;

  @Input() isLiked: boolean = false;
  @Input() isFavorited: boolean = false;

  isCopied = false;
  copiedFailed = false;

  constructor(public svgIconsService: SvgIconsService) {}

  /**
   * TODO: Implement like toggling functionality
   */
  toggleLike() {
    this.isLiked = !this.isLiked;

    if (this.isLiked && this.likesCount !== null) {
      this.likesCount++;
    } else if (this.likesCount !== null) {
      this.likesCount--;
    }

    console.log('Implement like toggling functionality', this.isLiked);
  }

  /**
   * TODO: Implement favorite toggling functionality
   */
  toggleFavorites() {
    this.isFavorited = !this.isFavorited;

    if (this.isFavorited && this.favoritesCount !== null) {
      this.favoritesCount++;
    } else if (this.favoritesCount !== null) {
      this.favoritesCount--;
    }

    console.log('Implement like toggling functionality', this.isFavorited);
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
}
