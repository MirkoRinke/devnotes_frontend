import { Component } from '@angular/core';
import { Input } from '@angular/core';

@Component({
  selector: 'app-badge',
  imports: [],
  templateUrl: './badge.html',
  styleUrl: './badge.scss',
})
export class Badge {
  @Input() messages: {
    error?: string | null;
    info?: string | null;
    success?: string | null;
  } = {};

  @Input() caret: 'left' | 'right' | 'center' | null = null;
}
