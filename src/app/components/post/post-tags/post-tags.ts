import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { TagsInterface } from '../../../interfaces/tags';

@Component({
  selector: 'app-post-tags',
  imports: [RouterLink],
  templateUrl: './post-tags.html',
  styleUrl: './post-tags.scss',
})
export class PostTags {
  @Input() context: string | null = null;
  @Input() endPoint: string | null = null;

  @Input() selectedEntity: string | null = null;
  @Input() selectedEntityValue: string | null = null;
  @Input() selectedPostType: string | null = null;

  @Input() tags: TagsInterface[] = [];
}
