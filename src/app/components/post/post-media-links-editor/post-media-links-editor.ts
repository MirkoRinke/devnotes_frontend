import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-post-media-links-editor',
  imports: [],
  templateUrl: './post-media-links-editor.html',
  styleUrl: './post-media-links-editor.scss',
})
export class PostMediaLinksEditor {
  @Input() type: 'images' | 'videos' | 'resources' = 'images';

  @Output() closeModal = new EventEmitter<void>();

  public pushToControl() {
    console.log('pushToControl called in PostMediaLinksEditor');
    this.onClose();
  }

  public onClose() {
    this.closeModal.emit();
  }
}
