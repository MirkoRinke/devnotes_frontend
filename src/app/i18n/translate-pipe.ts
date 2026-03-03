import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from './translation.service';

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
   * @returns The translated string if found, or "quak" if the translation is not found or if the path is invalid.
   */
  transform(key: string): string {
    return this.translationService.getTranslation(key);
  }
}
