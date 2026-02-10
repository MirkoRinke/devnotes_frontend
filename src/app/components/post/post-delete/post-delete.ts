import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-post-delete',
  imports: [],
  templateUrl: './post-delete.html',
  styleUrl: './post-delete.scss',
})
export class PostDelete {
  @Input() mode: 'delete' = 'delete';

  @Output() modeChange = new EventEmitter<'view'>();

  constructor() {}

  switchMode(newMode: 'view') {
    this.modeChange.emit(newMode);
  }
}
