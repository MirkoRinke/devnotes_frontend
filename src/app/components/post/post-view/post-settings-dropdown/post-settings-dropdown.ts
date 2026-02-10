import { Component, Output, EventEmitter } from '@angular/core';

import { SvgIconsService } from '../../../../services/svg.icons.service';

@Component({
  selector: 'app-post-settings-dropdown',
  imports: [],
  templateUrl: './post-settings-dropdown.html',
  styleUrl: './post-settings-dropdown.scss',
})
export class PostSettingsDropdown {
  @Output() modeChange = new EventEmitter<string>();

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
   * Switch mode to edit or delete
   *
   * TODO Remove create mode later, only for testing purposes
   *
   * @param mode
   */
  switchMode(mode: 'edit' | 'create' | 'delete') {
    this.modeChange.emit(mode);
  }
}
