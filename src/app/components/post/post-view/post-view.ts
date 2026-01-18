import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

import type { PostInterface } from '../../../interfaces/post';

import { SvgIconsService } from '../../../services/svg.icons.service';

@Component({
  selector: 'app-post-view',
  imports: [DatePipe],
  templateUrl: './post-view.html',
  styleUrl: './post-view.scss',
})
export class PostView {
  @Input() post!: PostInterface;
  @Input() selectedEntityValue!: string | null;
  @Input() selectedPostType!: string | null;

  constructor(public svgIconsService: SvgIconsService) {}

  avatarItemsEntries() {
    return this.post?.user?.avatar_items ? Object.entries(this.post.user.avatar_items).map(([key, url]) => ({ key, url })) : [];
  }
}
