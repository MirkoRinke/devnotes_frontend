import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-post-tags-editor',
  imports: [ReactiveFormsModule],
  templateUrl: './post-tags-editor.html',
  styleUrl: './post-tags-editor.scss',
})
export class PostTagsEditor {
  @Input() openModal = false;
  @Input() control: FormControl | null = null;
  @Input() endPoint: string | null = null;
  @Input() params: Array<string> | null = null;
  @Input() enableSearch = false;

  @Output() closeModal = new EventEmitter<void>();

  public pushToControl() {
    console.log('pushToControl called in PostTagsEditor');
    this.onClose();
  }

  public onClose() {
    this.closeModal.emit();
  }
}
