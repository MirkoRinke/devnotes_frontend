import { Component, Input } from '@angular/core';

import type { PostResourceModalInterface } from '../../../interfaces/post-ressource-modal';

import { SvgIconsService } from '../../../services/svg.icons.service';

@Component({
  selector: 'app-post-resource-modal',
  imports: [],
  templateUrl: './post-resource-modal.html',
  styleUrl: './post-resource-modal.scss',
})
export class PostResourceModal {
  @Input() modalData!: PostResourceModalInterface;

  constructor(public svgIconsService: SvgIconsService) {}
}
