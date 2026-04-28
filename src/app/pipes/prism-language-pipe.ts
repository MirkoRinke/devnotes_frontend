import { Pipe, PipeTransform } from '@angular/core';
import { DEFAULT_PRISM_LANGUAGES, CUSTOM_PRISM_LANGUAGES } from '../utils/prism-languages';

@Pipe({
  name: 'prismLanguage',
  standalone: true,
})
export class PrismLanguagePipe implements PipeTransform {
  transform(value: string | undefined | null): string {
    if (!value) return '';

    const lang = value.toLowerCase().trim();

    const mappedLang = DEFAULT_PRISM_LANGUAGES[lang] || CUSTOM_PRISM_LANGUAGES[lang];

    if (mappedLang) {
      return `language-${mappedLang}`;
    }

    return 'language-plaintext';
  }
}
