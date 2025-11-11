import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-guest-teaser-prompt',
  imports: [RouterModule],
  templateUrl: './guest-teaser-prompt.html',
  styleUrl: './guest-teaser-prompt.scss',
})
export class GuestTeaserPrompt {
  @Input() title!: string;
  @Input() message!: string;
  @Input() buttonText!: string;
  @Input() buttonLink!: string;

  constructor() {}
}
