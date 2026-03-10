import { Component, Input, Output, EventEmitter } from '@angular/core';

import type { PostInterface } from '../../../interfaces/post';

@Component({
  selector: 'app-post-form',
  imports: [],
  templateUrl: './post-form.html',
  styleUrl: './post-form.scss',
})
export class PostForm {
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() post: PostInterface | null = null;

  @Output() modeChange = new EventEmitter<'view'>();

  constructor() {}

  switchMode(newMode: 'view') {
    this.modeChange.emit(newMode);
  }
}
