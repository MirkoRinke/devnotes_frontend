import type { BadgeMessagesInterface } from './validation-messages';
export interface SplittedConfirmationTitleInterface {
  value: string;
  status: 'pending' | 'matched' | 'error';
}

export interface PostDeleteMessagesInterface {
  delete: BadgeMessagesInterface;
}
