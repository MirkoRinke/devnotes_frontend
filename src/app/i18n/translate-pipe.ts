import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './translation.service';

import type { ParamsInterface } from '../interfaces/error-handling';

@Pipe({
  name: 'translate',
  pure: false,
})
export class TranslatePipe implements PipeTransform {
  constructor(private translationService: TranslationService) {}

  /**
   * Transforms a translation key into its corresponding translated string using the TranslationService.
   *
   * @param key The translation key to be transformed (e.g., "PostTypes.feedback.title").
   * @param params Optional parameters to be used in the translation (e.g., { heading: 'Feedback' }).
   * @returns The translated string if found, or "quak" if the translation is not found or if the path is invalid.
   */
  transform(key: string, params?: ParamsInterface | null): string {
    return this.translationService.getTranslation(key, params);
  }
}
