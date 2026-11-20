import { ParamsInterface } from './error-handling';

export interface InfoTypeInterface {
  info: string | null;
}

export interface SuccessTypeInterface extends InfoTypeInterface {
  success: string | null;
}
export interface ErrorTypeInterface extends InfoTypeInterface {
  error: string | null;
}

export interface BadgeMessagesInterface extends SuccessTypeInterface, ErrorTypeInterface {}
export interface ActiveBadgeInterface {
  type: keyof BadgeMessagesInterface;
  icon: string;
  text: string;
  htmlText?: string;
}

export interface MessageHandler<K extends string = string> {
  setMessage(field: K, type: keyof BadgeMessagesInterface, validatorKey: string, params?: ParamsInterface | null): void;
  clearMessage(key: K): void;
}

/**
 *  This object initializes the badge messages with null values
 *  to ensure that they are defined and can be used in the application without causing errors.
 */
export const badgeMessagesInit: Record<keyof BadgeMessagesInterface, null> = {
  error: null,
  info: null,
  success: null,
};
