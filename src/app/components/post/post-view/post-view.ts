import { Component, Input } from '@angular/core';
import { DatePipe } from '@angular/common';

import type { PostInterface } from '../../../interfaces/post';

@Component({
  selector: 'app-post-view',
  imports: [DatePipe],
  templateUrl: './post-view.html',
  styleUrl: './post-view.scss',
})
export class PostView {
  @Input() post!: PostInterface;

  avatarItemsEntries() {
    return this.post?.user?.avatar_items ? Object.entries(this.post.user.avatar_items).map(([key, url]) => ({ key, url })) : [];
  }
}
