import { Component, Input, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef, OnChanges } from '@angular/core';
import { Router } from '@angular/router';

import type { BadgeMessagesInterface, ActiveBadgeInterface } from '../../interfaces/validation-messages';

import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-badge',
  imports: [],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge implements AfterViewChecked, OnChanges {
  @Input() messages: BadgeMessagesInterface | null = null;
  @Input() caret: 'left' | 'right' | 'center' | 'none' | null = null;
  @Input() animationDelay: number = 0;

  public activeBadge: ActiveBadgeInterface | null = null;
  private badgeText: ElementRef<HTMLElement> | null = null;

  public isOverflowingY = false;
  public isTranslationsPath = false;

  private hasCheckedOverflow = false;

  constructor(
    private readonly cdr: ChangeDetectorRef,
    private readonly router: Router,
  ) {}

  ngOnChanges(): void {
    this.hasCheckedOverflow = false;
    this.isOverflowingY = false;
    this.activeBadge = this.getActiveBadge();
    this.isTranslationsPath = this.looksLikeTranslationPath(this.activeBadge?.text ?? '');
  }

  ngAfterViewChecked(): void {
    if (!this.hasCheckedOverflow && this.activeBadge) {
      this.checkIsOverflowingY();
    }
  }

  /**
   * Sets the reference to the badge text element and updates the `badgeText` property.
   */
  @ViewChild('badgeText') set badgeTextRef(content: ElementRef<HTMLElement>) {
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
   * Checks if the provided text looks like a translation key (single word containing a message type).
   * Only relevant in DEBUG mode.
   *
   * @param text The text to check.
   * @returns True if the text looks like a translation path.
   */
  private looksLikeTranslationPath(text: string): boolean {
    if (!text || !environment.DEBUG) return false;

    const isSingleWord = text.trim().split(/\s+/).length === 1;
    const messageTypes: (keyof BadgeMessagesInterface)[] = ['error', 'info', 'success'];

    return isSingleWord && messageTypes.some((type) => text.includes(type));
  }

  /**
   * Retrieves the active badge details based on the current messages.
   * If there are no active messages, it returns null.
   *
   * @returns The active badge details or null if no active messages.
   */
  private getActiveBadge(): ActiveBadgeInterface | null {
    const baseDetails = this.getBaseBadgeDetails();
    if (!baseDetails) return null;

    const { text, type, icon } = baseDetails;
    const htmlText: string | null = this.resolveHtml(text);

    if (htmlText) {
      return { type, icon, text, htmlText };
    }

    return { type, icon, text };
  }

  /**
   * Resolves the HTML content for the given text, including parsing custom links and checking for HTML entities.
   *
   * @param text The text to resolve.
   * @returns The resolved HTML content or null if no HTML content is found.
   */
  private resolveHtml(text: string): string | null {
    const withLinks = this.parseMessageForLinks(text);
    if (withLinks) return withLinks;
    return this.hasHtmlEntities(text) ? text : null;
  }

  /**
   * Checks if the given text contains any HTML entities.
   *
   * @param text The text to check.
   * @returns True if the text contains HTML entities, false otherwise.
   */
  private hasHtmlEntities(text: string): boolean {
    const htmlEntities = ['&nbsp;', '&shy;'];
    return htmlEntities.some((entity) => text.includes(entity));
  }

  /**
   * Retrieves the base badge details based on the current messages.
   * If there are no active messages, it returns null.
   *
   * @returns The base badge details or null if no active messages.
   */
  private getBaseBadgeDetails(): ActiveBadgeInterface | null {
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
   * Parses the given message for custom links of the form [routerLink] or [href].
   * Replaces them with appropriate HTML anchor tags.
   *
   * @param message The message to parse.
   * @returns The parsed message with HTML links or null if no custom links are found.
   */
  private parseMessageForLinks(message: string): string | null {
    const typePart = `\\[(routerLink|href)\\]`;
    const urlPart = `([^"|]+)`;
    const optionalAliasPart = `(?:\\|([^"]+))?`;

    const customLinkRegex = new RegExp(`${typePart}="${urlPart}${optionalAliasPart}"`, 'g');

    if (!message.match(customLinkRegex)) {
      return null;
    }

    const parsedMessage = message.replace(customLinkRegex, (match: string, type: string, url: string, alias?: string) => {
      const linkText = alias || url;

      if (type === 'routerLink') {
        const routerLinkHTML = `<a class="badge-link" href="${url}">${linkText}</a>`;
        return routerLinkHTML;
      }
      if (type === 'href') {
        const fullUrl = url.startsWith('www.') ? `https://${url}` : url;
        const hrefHTML = `<a class="badge-link" href="${fullUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`;
        return hrefHTML;
      }
      return match;
    });

    return parsedMessage;
  }

  /**
   * Handles click events on links within the badge text.
   * If the clicked link is a router link, it prevents the default behavior and navigates using Angular's router.
   *
   * @param event The click event.
   */
  public handleLinkClick(event: Event): void {
    const target = event.target as HTMLElement;
    if (target.tagName === 'A') {
      const href = target.getAttribute('href');

      if (href && href.startsWith('/')) {
        event.preventDefault();
        this.router.navigateByUrl(href);
      }
    }
  }
}
