import { Injectable } from '@angular/core';

import { CONTENT_DE } from './data/translations.de';
import { CONTENT_EN } from './data/translations.en';

import { Content } from './data/translation.interface';

import type { ParamsInterface } from '../interfaces/error-handling';

import { environment } from '../../environments/environment';

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
   * @param params Optional parameters to be used in the translation string.
   * @param validatorKey Optional key to determine if a global error message should be used.
   * @returns The translated string if found, or "quak" if the translation is not found or if the path is invalid.
   */
  getTranslation(path: string, params?: ParamsInterface | null, validatorKey?: string): string {
    const keys = path.split('.');
    let data: any = this.translations[this.currentLang];

    const globalFallback = this.translations[this.currentLang]?.Global?.UNKNOWN_ERROR || (environment.DEBUG ? path : 'quak');

    for (const key of keys) {
      if (!data) {
        if (validatorKey === 'UNKNOWN_ERROR') {
          return globalFallback;
        }
        return environment.DEBUG ? path : 'quak';
      }
      data = data[key];
    }

    if (typeof data === 'string') {
      if (params) {
        Object.keys(params).forEach((key) => {
          data = data.replace(`{${key}}`, String(params[key]));
        });
      }
      return data;
    }

    if (validatorKey === 'UNKNOWN_ERROR') {
      return globalFallback;
    }
    return environment.DEBUG ? path : 'quak';
  }
}
