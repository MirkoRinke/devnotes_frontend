import { Component, Input, Output, EventEmitter } from '@angular/core';
import { SvgIconsService } from '../../../services/svg.icons.service';

import { TranslatePipe } from '../../../i18n/translate-pipe';

@Component({
  selector: 'app-password-toggle-button',
  imports: [TranslatePipe],
  templateUrl: './password-toggle-button.html',
  styleUrl: './password-toggle-button.scss',
})
export class PasswordToggleButton {
  @Input() isPasswordVisible: boolean = false;

  @Output() passwordVisibilityChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public readonly svgIconsService: SvgIconsService) {}

  public togglePasswordVisibility(): void {
    this.isPasswordVisible = !this.isPasswordVisible;
    this.passwordVisibilityChange.emit(this.isPasswordVisible);
  }
}
