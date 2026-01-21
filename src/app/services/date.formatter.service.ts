import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class DateFormatterService {
  /**
   * Converts a date string or Date object to a locale string.
   *
   * @param dateString
   * @returns
   */
  toLocaleString(dateString: string | Date | undefined) {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    return date.toLocaleString();
  }

  /**
   * Converts a date string or Date object to a locale date string.
   *
   * @param dateString
   * @returns
   */
  toLocaleDateString(dateString: string | Date | undefined) {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    return date.toLocaleDateString();
  }

  /**
   * Converts a date string or Date object to a locale time string.
   *
   * @param dateString
   * @returns
   */
  toLocaleTimeString(dateString: string | Date | undefined) {
    if (!dateString) {
      return '';
    }
    const date = new Date(dateString);
    return date.toLocaleTimeString();
  }
}
