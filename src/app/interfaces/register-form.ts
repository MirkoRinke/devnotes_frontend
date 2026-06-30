import type { BadgeMessagesInterface } from './validation-messages';

export interface RegisterFormErrorsInterface {
  required?: boolean;
  maxlength?: { requiredLength: number; actualLength: number };
  minlength?: { requiredLength: number; actualLength: number };
  email?: boolean;
  pattern?: { requiredPattern: string; actualValue: string };
  requiredTrue?: boolean;

  passwordMismatch?: boolean;
}

export interface RegisterFormInterface {
  email: string;
  name: string;
  display_name: string;
  password: string;
  password_confirmation: string;
  privacy_policy_accepted: boolean;
  terms_of_service_accepted: boolean;
}

export interface RegisterMessagesInterface {
  email: BadgeMessagesInterface;
  name: BadgeMessagesInterface;
  display_name: BadgeMessagesInterface;
  password: BadgeMessagesInterface;
  password_confirmation: BadgeMessagesInterface;
  acceptedConditions: BadgeMessagesInterface;
  register: BadgeMessagesInterface;
  passwordMismatch: BadgeMessagesInterface;
}
