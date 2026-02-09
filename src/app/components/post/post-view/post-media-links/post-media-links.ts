import { Component, Input, Output, EventEmitter } from '@angular/core';

import { SvgIconsService } from '../../../../services/svg.icons.service';

import type { ExternalSourcePreviewInterface } from '../../../../interfaces/post';

@Component({
  selector: 'app-post-media-links',
  imports: [],
  templateUrl: './post-media-links.html',
  styleUrl: './post-media-links.scss',
})
export class PostMediaLinks {
  @Input() externalSourcePreviews!: ExternalSourcePreviewInterface[];

  @Output() openResourceModalEvent = new EventEmitter<'images' | 'videos' | 'resources'>();

  constructor(public svgIconsService: SvgIconsService) {}

  /**
   * Check if post has resources of specific type
   *
   * @param resourceType
   * @returns
   */
  hasResources(resourceType: 'images' | 'videos' | 'resources'): boolean {
    if (!this.externalSourcePreviews) {
      return false;
    }
    return this.externalSourcePreviews.some((preview) => preview.type === resourceType);
  }

  /**
   * Opens the Post Resource Modal.
   *
   * @param type
   * @returns
   */
  triggerOpenResourceModal(type: 'images' | 'videos' | 'resources') {
    if (!this.externalSourcePreviews || !this.hasResources(type)) {
      return;
    }

    this.openResourceModalEvent.emit(type);
  }
}
