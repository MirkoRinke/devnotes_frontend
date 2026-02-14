import { Component, Input, OnChanges, SimpleChanges, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import * as Prism from 'prismjs';

import { SvgIconsService } from '../../../../services/svg.icons.service';

import { PrismLanguagePipe } from '../../../../pipes/prism-language-pipe';

@Component({
  selector: 'app-post-code',
  imports: [PrismLanguagePipe],
  templateUrl: './post-code.html',
  styleUrl: './post-code.scss',
})
export class PostCode implements OnChanges, AfterViewInit {
  @ViewChild('codeElement') codeElement: ElementRef | undefined;
  @Input() language: string | null = null;
  @Input() code: string | null = null;

  isCopied = false;
  copiedFailed = false;

  constructor(public svgIconsService: SvgIconsService) {}

  /**
   * Highlight code after view initialization
   */
  ngAfterViewInit() {
    this.highlight();
  }

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
   * Copy code to clipboard
   */
  copyToClipboard(code: string | null = '') {
    navigator.clipboard
      .writeText(code || '')
      .then(() => {
        this.isCopied = true;
        setTimeout(() => (this.isCopied = false), 2000);
      })
      .catch((err) => {
        this.copiedFailed = true;
        setTimeout(() => (this.copiedFailed = false), 2000);
      });
  }
}
