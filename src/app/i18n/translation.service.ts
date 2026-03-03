import { Injectable } from '@angular/core';

import { CONTENT_DE } from './data/translations.de';
import { CONTENT_EN } from './data/translations.en';

import { Content } from './data/translation.interface';

interface Translations {
  [key: string]: Content;
}

@Injectable({
  providedIn: 'root',
})
export class TranslationService {
  private currentLang = 'de';
  private translations: Translations = {
    de: CONTENT_DE,
    en: CONTENT_EN,
  };

  /**
   * Sets the current language for translations. This method can be called to switch between languages dynamically.
   *
   * @param lang The language code to set (e.g., "de" for German, "en" for English).
   */
  setLanguage(lang: string) {
    this.currentLang = lang;
  }

  /**
   * Retrieves the translation for a given key path. The key path is a dot-separated string that corresponds to the structure of the translation data.
   * For example, "PostTypes.feedback.title" would retrieve the title for the feedback post type.
   *
   * @param path The dot-separated key path to the desired translation (e.g., "PostTypes.feedback.title").
   * @returns The translated string if found, or "quak" if the translation is not found or if the path is invalid.
   */
  getTranslation(path: string): string {
    const keys = path.split('.');
    let data: any = this.translations[this.currentLang];

    for (const key of keys) {
      if (!data) return 'quak';

      data = data[key];
    }

    if (typeof data === 'string') {
      return data;
    }

    return 'quak';
  }
}
