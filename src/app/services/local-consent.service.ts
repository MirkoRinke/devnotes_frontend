import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalConsentService {
  /**
   * Saves local consent data in the browser's local storage with a timestamp and expiration time.
   *
   * @param name The key under which the consent data will be stored in local storage.
   * @param hours The number of hours after which the consent will expire.
   * @param data  The consent data to be stored, which can include any relevant information.
   */
  saveLocalConsent(name: string, hours: number, data: object): void {
    const timestamp = new Date().getTime();

    const dataWithTimestamp = { ...data, hours, timestamp };

    localStorage.setItem(name, JSON.stringify(dataWithTimestamp));
  }

  /**
   * Checks if local consent exists and is still valid based on the stored timestamp and expiration time.
   *
   * @param name  The key under which the consent data is stored in local storage.
   * @returns A boolean indicating whether the local consent is valid (true) or not (false).
   */
  hasLocalConsent(name: string): boolean {
    const storedData = localStorage.getItem(name);

    if (storedData) {
      const parsedData = JSON.parse(storedData);
      const currentTime = new Date().getTime();
      const expirationTime = parsedData.timestamp + parsedData.hours * 60 * 60 * 1000;

      if (currentTime < expirationTime) {
        return true;
      }

      localStorage.removeItem(name);
    }

    return false;
  }
}
