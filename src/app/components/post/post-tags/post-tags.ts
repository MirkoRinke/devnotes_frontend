import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { TagsInterface } from '../../../interfaces/tags';

import type { PostParamsInterface } from '../../../interfaces/post-params';

@Component({
  selector: 'app-post-tags',
  imports: [RouterLink],
  templateUrl: './post-tags.html',
  styleUrl: './post-tags.scss',
})
export class PostTags {
  @Input() context: PostParamsInterface['context'] = null;
  @Input() endPoint: PostParamsInterface['endPoint'] = null;
  @Input() selectedEntity: PostParamsInterface['selectedEntity'] = null;
  @Input() selectedEntityValue: PostParamsInterface['selectedEntityValue'] = null;
  @Input() selectedPostType: PostParamsInterface['selectedPostType'] = null;

  @Input() tags: TagsInterface[] = [];

  @Input() isViewMode: boolean = true;
}
