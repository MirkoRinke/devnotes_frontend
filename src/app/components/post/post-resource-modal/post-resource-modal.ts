import { Component, Input } from '@angular/core';

import type { ExternalSourcePreviewInterface } from '../../../interfaces/post';
import type { PostResourceModalInterface } from '../../../interfaces/post-ressource-modal';

@Component({
  selector: 'app-post-resource-modal',
  imports: [],
  templateUrl: './post-resource-modal.html',
  styleUrl: './post-resource-modal.scss',
})
export class PostResourceModal {
  @Input() modalData!: PostResourceModalInterface;
}
