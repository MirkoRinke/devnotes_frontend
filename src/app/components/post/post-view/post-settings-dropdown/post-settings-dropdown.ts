import { Component, Output, EventEmitter } from '@angular/core';

import { SvgIconsService } from '../../../../services/svg.icons.service';
import { RouterLink } from '@angular/router';

import type { PostMode } from '../../../../interfaces/post-mode';

@Component({
  selector: 'app-post-settings-dropdown',
  imports: [RouterLink],
  templateUrl: './post-settings-dropdown.html',
  styleUrl: './post-settings-dropdown.scss',
})
export class PostSettingsDropdown {
  @Output() modeChange = new EventEmitter<PostMode>();
  @Output() deletePost = new EventEmitter<void>();

  isPostSettingsDropdownOpen = false;
  isPostSettingsDropdownAnimating = false;

  constructor(public svgIconsService: SvgIconsService) {}

  /**
   * Toggle Settings Dropdown
   */
  toggleSettingsDropdown() {
    if (this.isPostSettingsDropdownOpen) {
      this.isPostSettingsDropdownAnimating = false;
    } else {
      this.isPostSettingsDropdownOpen = true;
      requestAnimationFrame(() => (this.isPostSettingsDropdownAnimating = true));
    }
  }

  /**
   * Handle animation end events
   *
   * @param event
   */
  onAnimationEnd(event: AnimationEvent) {
    //TODO Refactoring this later to 'fade-out'
    if (event.animationName.endsWith('animated-out') && this.isPostSettingsDropdownOpen) {
      this.isPostSettingsDropdownOpen = false;
    }
  }

  /**
   * Switch mode and emit mode change event
   *
   * @param mode
   */
  switchMode(mode: PostMode) {
    this.modeChange.emit(mode);
  }

  /**
   * Emit delete post event
   */
  onDeletePost() {
    this.deletePost.emit();
  }

  /**
   * Close settings dropdown
   */
  closeSettingsDropdown() {
    this.isPostSettingsDropdownAnimating = false;
  }
}
