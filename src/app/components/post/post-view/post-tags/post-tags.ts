import { Component, Input } from '@angular/core';

import type { TagsInterface } from '../../../../interfaces/tags';

@Component({
  selector: 'app-post-tags',
  imports: [],
  templateUrl: './post-tags.html',
  styleUrl: './post-tags.scss',
})
export class PostTags {
  @Input() tags: TagsInterface[] = [];

  /**
   * TODO: Implement search function for languages and technologies
   */
  searchPlaceholderFunction(item: TagsInterface) {
    console.log('Search function not implemented yet for item:', item);
  }
}
