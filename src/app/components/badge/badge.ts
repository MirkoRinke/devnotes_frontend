import { Component, Input, ViewChild, ElementRef, AfterViewChecked, ChangeDetectorRef } from '@angular/core';

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

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnChanges(): void {
    if (this.messages?.error || this.messages?.info || this.messages?.success) {
      this.checkForTranslationsPath(this.getActiveBadge()?.text || '');
    }
  }

  ngAfterViewChecked(): void {
    if (this.messages?.error || this.messages?.info || this.messages?.success) {
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
   * Returns the currently active badge based on the provided messages.
   *
   * @returns The active badge or null if no badge is active.
   */
  getActiveBadge(): ActiveBadgeInterface | null {
    if (!this.messages) return null;
    if (this.messages.error) return { type: 'error', icon: '[!]', text: this.messages.error };
    if (this.messages.info) return { type: 'info', icon: '[i]', text: this.messages.info };
    if (this.messages.success) return { type: 'success', icon: '[✓]', text: this.messages.success };
    return null;
  }
}
