import { Component, Input } from '@angular/core';

import type { UserInterface } from '../../interfaces/user';

@Component({
  selector: 'app-user-badge',
  imports: [],
  templateUrl: './user-badge.html',
  styleUrl: './user-badge.scss',
})
export class UserBadge {
  @Input() user!: UserInterface | null;
  @Input() userBadgeContext!: 'post' | 'comment' | 'profile';
  @Input() menuActive: boolean = false;

  constructor() {}
}
