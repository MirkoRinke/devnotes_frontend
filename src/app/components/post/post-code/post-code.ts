import { Component, Input, Output, OnChanges, SimpleChanges, ViewChild, ElementRef, EventEmitter } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import * as Prism from 'prismjs';
import { PrismLanguagePipe } from '../../../pipes/prism-language-pipe';

import { SvgIconsService } from '../../../services/svg.icons.service';
import { getCssVariableValue } from '../../../utils/css-helper';

@Component({
  selector: 'app-post-code',
  imports: [PrismLanguagePipe, ReactiveFormsModule],
  templateUrl: './post-code.html',
  styleUrl: './post-code.scss',
})
export class PostCode implements OnChanges {
  @Input() control: FormControl | null = null;

  @Input() language: string | null = null;
  @Input() code: string | null = null;

  isViewMode = true;
  isFirstLoad = true;

  isCopied = false;
  copiedFailed = false;

  isExpanded: boolean = false;

  codeElement: ElementRef | null = null;
  codeTextarea: ElementRef | null = null;

  maxHeight: number | null = null;
  minHeight: number = 0;

  @Output() viewModeChange = new EventEmitter<boolean>();

  constructor(public svgIconsService: SvgIconsService) {}

  /**
   * Detect changes in code or language and re-highlight if necessary
   *
   * @param changes
   */
  ngOnChanges(changes: SimpleChanges) {
    if ((changes['code'] && !changes['code'].firstChange) || (changes['language'] && !changes['language'].firstChange)) {
      this.highlight();
    }
  }

  /**
   * Highlight code using Prism.js
   */
  private highlight() {
    if (this.codeElement?.nativeElement) {
      this.codeElement.nativeElement.innerHTML = this.code || '';
      Prism.highlightElement(this.codeElement.nativeElement);
    }
  }

  /**
   * Sets the reference to the code element and highlights it.
   *
   * @param content The ElementRef of the code element.
   *
   */
  @ViewChild('codeElement') set codeElementRef(content: ElementRef) {
    this.codeElement = content;
    if (content) {
      requestAnimationFrame(() => {
        if (this.control && this.isFirstLoad) {
          this.viewModeChange.emit();
          this.isFirstLoad = false;
        }
        this.highlight();
      });

      // console.log('codeElement:', this.codeElement?.nativeElement.getBoundingClientRect());
    }
  }

  /**
   * Sets the reference to the code textarea element and adjusts its height accordingly.
   *
   * @param content The ElementRef of the code textarea.
   */
  @ViewChild('codeTextarea') set content(content: ElementRef) {
    if (content) {
      this.codeTextarea = content;
      const style = getComputedStyle(content.nativeElement);
      this.maxHeight = getCssVariableValue(style, '--codeTextarea-max-height') || null;
      this.minHeight = getCssVariableValue(style, '--codeTextarea-min-height') || 0;
      this.adjustHeight();

      content.nativeElement.focus({
        preventScroll: true,
      });
      // console.log('codeTextarea:', this.codeTextarea?.nativeElement.getBoundingClientRect());
    }
  }

  /**
   * Adjusts the height of the code textarea to fit its content.
   *
   * @returns
   */
  public adjustHeight(): void {
    const textarea = this.codeTextarea?.nativeElement as HTMLTextAreaElement;
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
   * Toggle the expanded state of the code block
   */
  toggleExpanded() {
    this.isExpanded = !this.isExpanded;
    this.adjustHeight();
  }

  /**
   * Sets the view mode of the component, which determines whether the code is displayed in a read-only format or an editable textarea.
   *
   * @param mode
   */
  public setViewMode(mode: boolean) {
    this.isViewMode = mode;
    this.viewModeChange.emit();
  }
}
