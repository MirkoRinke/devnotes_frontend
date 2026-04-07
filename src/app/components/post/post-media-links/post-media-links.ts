import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SvgIconsService } from '../../../services/svg.icons.service';

import type { ExternalSourceInterface } from '../../../interfaces/post-external-source';

@Component({
  selector: 'app-post-media-links',
  imports: [],
  templateUrl: './post-media-links.html',
  styleUrl: './post-media-links.scss',
})
export class PostMediaLinks {
  @Input() externalSource: ExternalSourceInterface = {
    images: false,
    videos: false,
    resources: false,
  };

  @Output() openResourceModalEvent = new EventEmitter<'images' | 'videos' | 'resources'>();

  constructor(public svgIconsService: SvgIconsService) {}

  /**
   * Opens the Resource Modal for the given type (images, videos, resources)
   *
   * @param type The type of resource modal to open ('images', 'videos', 'resources')
   */
  triggerOpenResourceModal(type: 'images' | 'videos' | 'resources') {
    this.openResourceModalEvent.emit(type);
  }
}
