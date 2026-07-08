import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-password-strength-feedback',
  imports: [],
  templateUrl: './password-strength-feedback.html',
  styleUrl: './password-strength-feedback.scss',
})
export class PasswordStrengthFeedback {
  @Input() isPasswordFocused: boolean = false;
  @Input() control: AbstractControl | null = null;
}
