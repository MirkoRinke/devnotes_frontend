import { Component } from '@angular/core';
import { Input } from '@angular/core';

import type { BadgeMessagesInterface, ActiveBadgeInterface } from '../../interfaces/validation-messages';

@Component({
  selector: 'app-badge',
  imports: [],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge {
  @Input() messages: BadgeMessagesInterface | null = null;
  @Input() caret: 'left' | 'right' | 'center' | null = null;
  @Input() animationDelay: number = 0;

  getActiveBadge(): ActiveBadgeInterface | null {
    if (!this.messages) return null;
    if (this.messages.error) return { type: 'error', icon: '[!]', text: this.messages.error };
    if (this.messages.info) return { type: 'info', icon: '[i]', text: this.messages.info };
    if (this.messages.success) return { type: 'success', icon: '[✓]', text: this.messages.success };
    return null;
  }
}
