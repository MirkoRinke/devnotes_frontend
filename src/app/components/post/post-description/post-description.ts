import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import { SvgIconsService } from '../../../services/svg.icons.service';
import { getCssVariableValue } from '../../../utils/css-helper';

@Component({
  selector: 'app-post-description',
  imports: [ReactiveFormsModule],
  templateUrl: './post-description.html',
  styleUrl: './post-description.scss',
})
export class PostDescription {
  @Input() isViewMode: boolean = true;

  @Input() description: string | null = null;
  @Input() control: FormControl | null = null;
  @Input() errorIndex: number | null = null;

  isCopied = false;
  copiedFailed = false;

  isExpanded: boolean = false;

  maxHeight: number | null = null;
  minHeight: number = 0;

  descriptionTextarea: ElementRef | null = null;

  constructor(public svgIconsService: SvgIconsService) {}

  /**
   * Sets the reference to the description textarea element and adjusts its height accordingly.
   *
   * @param content The ElementRef of the description textarea.
   */
  @ViewChild('descriptionTextarea') set content(content: ElementRef) {
    if (content) {
      this.descriptionTextarea = content;
      const style = getComputedStyle(content.nativeElement);
      this.maxHeight = getCssVariableValue(style, '--description-max-height') || null;
      this.minHeight = getCssVariableValue(style, '--description-min-height') || 0;
      this.adjustHeight();
    }
  }

  /**
   * Adjusts the height of the description textarea to fit its content.
   *
   * @returns
   */
  public adjustHeight(): void {
    const textarea = this.descriptionTextarea?.nativeElement as HTMLTextAreaElement;
    if (!textarea) return;

    textarea.style.height = 'auto';

    const maxHeight = this.isExpanded ? null : this.maxHeight;

    const border = textarea.offsetHeight - textarea.clientHeight;

    let target = textarea.scrollHeight + border;

    if (maxHeight) target = Math.min(target, maxHeight);
    target = Math.max(target, this.minHeight);

    textarea.style.height = Math.ceil(target) + 'px';
  }

  /**
   * Copy to the clipboard and show feedback on success or failure
   */
  copyToClipboard(copy: string | null = '') {
    navigator.clipboard
      .writeText(copy || '')
      .then(() => {
        this.isCopied = true;
        setTimeout(() => (this.isCopied = false), 2000);
      })
      .catch((err) => {
        this.copiedFailed = true;
        setTimeout(() => (this.copiedFailed = false), 2000);
      });
  }

  /**
   * Toggle the expanded state of the description
   */
  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.adjustHeight();
  }
}
