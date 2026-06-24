import { BadgeMessagesInterface, badgeMessagesInit } from '../interfaces/validation-messages';
import type { ParamsInterface } from '../interfaces/error-handling';
import { TranslationService } from '../i18n/translation.service';

export class BadgeMessageHandler<T extends Record<keyof T, BadgeMessagesInterface>> {
  private _timeout: number | null = null;

  constructor(
    private messages: T,
    private pathPrefix: string,
    private translationService: TranslationService,
    private autoClearDelay: number | null = null,
  ) {}

  /**
   * Sets a message for a specific field, type, and validator key.
   * It constructs the translation path based on the provided parameters and retrieves the corresponding translation using the TranslationService.
   * The message is then stored in the messages object under the specified field and type.
   *
   * @param field The field for which the message is being set.
   * @param type The type of message (e.g., 'error', 'warning', 'info').
   * @param validatorKey The key identifying the specific validation rule.
   * @param params Optional parameters to be passed to the translation service.
   */
  setMessage(field: keyof T, type: keyof BadgeMessagesInterface, validatorKey: string, params?: ParamsInterface | null): void {
    this.clearMessage(field);
    const path = `${this.pathPrefix}.${type}.${String(field)}.${validatorKey}`;
    (this.messages[field] as BadgeMessagesInterface)[type] = this.translationService.getTranslation(path, params, validatorKey);
  }

  /**
   * Clears the message for a specific field. If an auto-clear delay is set, it will automatically clear the message after the specified delay.
   *
   * @param key The field for which the message is being cleared.
   */
  clearMessage(key: keyof T): void {
    if (this._timeout) clearTimeout(this._timeout);
    this.messages[key] = { ...badgeMessagesInit } as T[keyof T];
    if (this.autoClearDelay !== null) {
      this._timeout = setTimeout(() => {
        this.messages[key] = { ...badgeMessagesInit } as T[keyof T];
      }, this.autoClearDelay);
    }
  }

  /**
   * Destroys the BadgeMessageHandler instance by clearing any existing timeout to prevent memory leaks or unintended behavior when the instance is no longer needed.
   */
  destroy() {
    if (this._timeout) clearTimeout(this._timeout);
  }
}
