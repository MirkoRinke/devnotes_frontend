import { Component } from '@angular/core';
import { Input } from '@angular/core';

import type { BadgeMessagesInterface } from '../../interfaces/validation-messages';

@Component({
  selector: 'app-badge',
  imports: [],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge {
  @Input() messages: BadgeMessagesInterface | null = null;
  @Input() caret: 'left' | 'right' | 'center' | null = null;
}
