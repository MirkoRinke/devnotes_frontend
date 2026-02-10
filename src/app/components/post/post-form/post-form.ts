import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-post-form',
  imports: [],
  templateUrl: './post-form.html',
  styleUrl: './post-form.scss',
})
export class PostForm {
  @Input() mode: 'create' | 'edit' = 'create';

  @Output() modeChange = new EventEmitter<'view'>();

  constructor() {}

  switchMode(newMode: 'view') {
    this.modeChange.emit(newMode);
  }
}
