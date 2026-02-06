import { Component } from '@angular/core';

import { SvgIconsService } from '../../../../services/svg.icons.service';

@Component({
  selector: 'app-post-settings-dropdown',
  imports: [],
  templateUrl: './post-settings-dropdown.html',
  styleUrl: './post-settings-dropdown.scss',
})
export class PostSettingsDropdown {
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
   * TODO: Implement edit post functionality
   */
  editPost() {
    alert('Edit Post implement later');
  }

  /**
   * TODO: Implement delete post functionality
   */
  deletePost() {
    alert('Delete Post implement later');
  }
}
