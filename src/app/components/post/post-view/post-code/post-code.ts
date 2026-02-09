import { Component, Input } from '@angular/core';

import { SvgIconsService } from '../../../../services/svg.icons.service';

@Component({
  selector: 'app-post-code',
  imports: [],
  templateUrl: './post-code.html',
  styleUrl: './post-code.scss',
})
export class PostCode {
  @Input() code: string | null = null;

  isCopied = false;
  copiedFailed = false;

  constructor(public svgIconsService: SvgIconsService) {}

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
