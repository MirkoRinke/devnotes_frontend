import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-action-placeholder',
  imports: [RouterModule],
  templateUrl: './action-placeholder.html',
  styleUrl: './action-placeholder.scss',
})
export class ActionPlaceholder {
  @Input() title: string | null = null;
  @Input() message: string | null = null;
  @Input() buttonText: string | null = null;
  @Input() buttonLink: string | null = null;

  constructor() {}
}
