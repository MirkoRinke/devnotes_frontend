import type { BadgeMessagesInterface } from './validation-messages';

export interface AccountSettingsFormErrorsInterface {
  required?: boolean;
  maxlength?: { requiredLength: number; actualLength: number };
  minlength?: { requiredLength: number; actualLength: number };
  email?: boolean;
  pattern?: { requiredPattern: string; actualValue: string };
  requiredTrue?: boolean;

  passwordMismatch?: boolean;
}

export interface AccountSettingsFormInterface {
  name?: string;
  email?: string;
  email_confirmation?: string;
  password?: string;
  password_confirmation?: string;
  current_password: string;
}

export interface AccountSettingsMessagesInterface {
  name: BadgeMessagesInterface;
  email: BadgeMessagesInterface;
  email_confirmation: BadgeMessagesInterface;
  password: BadgeMessagesInterface;
  password_confirmation: BadgeMessagesInterface;
  accountSettings: BadgeMessagesInterface;
  passwordMismatch: BadgeMessagesInterface;
  emailMismatch: BadgeMessagesInterface;
  current_password: BadgeMessagesInterface;
}

export interface AccountSettingsAvailabilityResponseInterface {
  name?: string[];
}
