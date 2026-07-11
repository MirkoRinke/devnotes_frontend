import { Component, Input, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import type { BadgeMessagesInterface, ActiveBadgeInterface } from '../../interfaces/validation-messages';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-badge',
  imports: [],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge implements AfterViewChecked {
  @Input() messages: BadgeMessagesInterface | null = null;
  @Input() caret: 'left' | 'right' | 'center' | null = null;
  @Input() animationDelay: number = 0;

  badgeText: ElementRef | null = null;

  isOverflowingY = false;
  isTranslationsPath = false;

  hasCheckedOverflow = false;

  constructor(
    private cdr: ChangeDetectorRef,
    private router: Router,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnChanges(): void {
    this.hasCheckedOverflow = false;
    if (this.messages?.error || this.messages?.info || this.messages?.success) {
      this.checkForTranslationsPath(this.getActiveBadge()?.text || '');
    }
  }

  ngAfterViewChecked(): void {
    if (!this.hasCheckedOverflow && (this.messages?.error || this.messages?.info || this.messages?.success)) {
      this.checkIsOverflowingY();
    }
  }

  /**
   * Sets the reference to the badge text element and updates the `badgeText` property.
   */
  @ViewChild('badgeText') set badgeTextRef(content: ElementRef) {
    this.badgeText = content;
  }

  /**
   * Checks if the badge text is overflowing vertically and updates the `isOverflowingY` property accordingly.
   *
   * @returns void
   */
  private checkIsOverflowingY(): void {
    if (!this.badgeText) return;
    const el = this.badgeText.nativeElement;

    const isOverflowingY = el.scrollHeight > el.clientHeight;

    if (isOverflowingY !== this.isOverflowingY) {
      this.isOverflowingY = isOverflowingY;
      this.cdr.detectChanges();
    }
    this.hasCheckedOverflow = true;
  }

  /**
   * Checks if the provided text is a translations path based on specific criteria.
   *
   * @param text The text to check.
   * @returns void
   */
  private checkForTranslationsPath(text: string): void {
    if (!text || !environment.DEBUG) return;
    const count = text.trim().split(/\s+/).length;

    const includes: (keyof BadgeMessagesInterface)[] = ['error', 'info', 'success'];

    if (count === 1 && includes.some((key) => text.includes(key))) {
      this.isTranslationsPath = true;
    }
  }

  /**
   * Retrieves the active badge details based on the current messages.
   * If there are no active messages, it returns null.
   *
   * @returns The active badge details or null if no active messages.
   */
  getActiveBadge(): ActiveBadgeInterface | null {
    const baseDetails = this._getBaseBadgeDetails();
    if (!baseDetails) return null;

    const { text, type, icon } = baseDetails;
    const htmlText: SafeHtml | null = this._parseMessageForLinks(text);

    if (htmlText) {
      return { type, icon, text: text, htmlText };
    }

    return { type, icon, text: text };
  }

  /**
   * Retrieves the base badge details based on the current messages.
   * If there are no active messages, it returns null.
   *
   * @returns The base badge details or null if no active messages.
   */
  private _getBaseBadgeDetails(): ActiveBadgeInterface | null {
    if (!this.messages) return null;

    if (this.messages.error) {
      return { text: this.messages.error, type: 'error', icon: '[!]' };
    }
    if (this.messages.info) {
      return { text: this.messages.info, type: 'info', icon: '[i]' };
    }
    if (this.messages.success) {
      return { text: this.messages.success, type: 'success', icon: '[✓]' };
    }

    return null;
  }

  /**
   * Parses the provided message for custom link patterns and replaces them with HTML anchor tags.
   *
   * The expected format for custom links is: [type]="url|alias"
   * - type: "routerLink" or "href"
   * - url: The URL or route
   * - alias: (Optional) The text to display for the link
   *
   * @param message The message to parse.
   * @returns The parsed message with HTML anchor tags or null if no custom links are found.
   */
  private _parseMessageForLinks(message: string): SafeHtml | null {
    const typePart = `\\[(routerLink|href)\\]`;
    const urlPart = `([^"|]+)`;
    const optionalAliasPart = `(?:\\|([^"]+))?`;

    const customLinkRegex = new RegExp(`${typePart}="${urlPart}${optionalAliasPart}"`, 'g');

    if (!message.match(customLinkRegex)) {
      return null;
    }

    const parsedMessage = message.replace(customLinkRegex, (match, type, url, alias) => {
      const linkText = alias || url;

      if (type === 'routerLink') {
        const routerLinkHTML = `<a class="badge-link" aria-label="${linkText}" href="${url}">${linkText}</a>`;
        return routerLinkHTML;
      }
      if (type === 'href') {
        const fullUrl = url.startsWith('www.') ? `https://${url}` : url;
        const hrefHTML = `<a class="badge-link" aria-label="${linkText}" href="${fullUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
        return hrefHTML;
      }
      return match;
    });

    return this.sanitizer.bypassSecurityTrustHtml(parsedMessage);
  }

  /**
   * Handles click events on links within the badge text.
   * If the clicked link is a router link, it prevents the default behavior and navigates using Angular's router.
   *
   * @param event The click event.
   */
  handleLinkClick(event: Event) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A') {
      const href = target.getAttribute('href');

      if (href && href.startsWith('/')) {
        event.preventDefault();
        this.router.navigate([href]);
      }
    }
  }
}
