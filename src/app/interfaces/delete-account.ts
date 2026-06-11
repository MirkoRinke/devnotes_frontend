import type { BadgeMessagesInterface } from './validation-messages';

export interface DeleteAccountErrorsInterface {
  required?: boolean;
  maxlength?: { requiredLength: number; actualLength: number };
  minlength?: { requiredLength: number; actualLength: number };

  delete_account_identifier_invalid?: boolean;
}

export interface DeleteAccountInterface {
  email?: string;
  user_name?: string;
  password: string;
}

export interface DeleteAccountMessagesInterface {
  identifier: BadgeMessagesInterface;
  password: BadgeMessagesInterface;
  deleteAccount: BadgeMessagesInterface;
}
