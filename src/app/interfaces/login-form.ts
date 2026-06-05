import type { BadgeMessagesInterface } from './validation-messages';

export interface LoginFormErrorsInterface {
  required?: boolean;
  maxlength?: { requiredLength: number; actualLength: number };
  minlength?: { requiredLength: number; actualLength: number };

  login_identifier_invalid?: boolean;
}

export interface LoginFormInterface {
  email?: string;
  user_name?: string;
  password: string;
  privacy_policy_accepted?: boolean;
  terms_of_service_accepted?: boolean;
}

export interface LoginDataInterface extends LoginFormInterface {
  device_name: string;
  device_fingerprint: string;
}

export interface LoginResponseInterface {
  accessToken: string;
  type: string;
  user_id: number;
}

export interface LoginMessagesInterface {
  identifier: BadgeMessagesInterface;
  password: BadgeMessagesInterface;
  acceptedConditions: BadgeMessagesInterface;
  login: BadgeMessagesInterface;
}
