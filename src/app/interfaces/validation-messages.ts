export interface InfoTypeInterface {
  info: string | null;
}

export interface SuccessTypeInterface extends InfoTypeInterface {
  success: string | null;
}
export interface ErrorTypeInterface extends InfoTypeInterface {
  error: string | null;
}

export interface ActiveBadgeInterface {
  type: keyof BadgeMessagesInterface;
  icon: string;
  text: string;
}

export interface BadgeMessagesInterface extends SuccessTypeInterface, ErrorTypeInterface {}
