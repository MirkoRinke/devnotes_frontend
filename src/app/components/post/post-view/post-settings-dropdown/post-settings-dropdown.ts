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
   * Edit Post ( placeholder )
   */
  editPost() {
    alert('Edit Post implement later');
  }

  /**
   * Delete Post ( placeholder )
   */
  deletePost() {
    alert('Delete Post implement later');
  }
}
