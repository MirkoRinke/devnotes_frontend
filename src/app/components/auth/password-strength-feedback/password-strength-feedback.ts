import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

import { TranslatePipe } from '../../../i18n/translate-pipe';

@Component({
  selector: 'app-password-strength-feedback',
  imports: [TranslatePipe],
  templateUrl: './password-strength-feedback.html',
  styleUrl: './password-strength-feedback.scss',
})
export class PasswordStrengthFeedback {
  @Input() isPasswordFocused: boolean = false;
  @Input() control: AbstractControl | null = null;
  @Input() passwordFieldId: string | null = null;

  public readonly passwordRequirementKeys = ['hasUpperCase', 'hasLowerCase', 'hasNumber', 'hasSpecialChar'] as const;

  public passwordRequirements(requirement: (typeof this.passwordRequirementKeys)[number]): boolean {
    const passwordRequirements = this.control?.errors?.['weakPassword'] || null;
    const passwordLength = this.control?.value?.length || 0;
    if (passwordLength != 0 && (passwordRequirements === null || passwordRequirements?.[requirement])) {
      return true;
    }
    return false;
  }
}
