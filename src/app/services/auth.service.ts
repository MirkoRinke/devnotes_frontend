import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  /**
   * Check if the user is currently logged in by verifying the presence of a valid access token in local storage.
   *
   * @returns A boolean indicating whether the user is logged in.
   */
  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  /**
   * Get the current access token from local storage
   *
   * @returns The access token as a string, or null if not found.
   */
  getToken(): string | null {
    return localStorage.getItem('accessToken') || null;
  }

  /**
   * Generate a unique device fingerprint based on the user's hardware and browser information.
   * This method collects various pieces of information about the user's device, such as the user agent, platform, hardware concurrency, languages, and timezone.
   * It then combines this information into a single string and applies a custom hashing algorithm to generate a unique fingerprint for the device.
   *
   * @returns A string representing the unique device fingerprint.
   */
  getDeviceFingerprint(): string {
    const hardwareInfo = [
      navigator.userAgent || 'Unknown User Agent',
      navigator.platform || 'Unknown Platform',
      navigator.hardwareConcurrency || 'Unknown Hardware Concurrency',
      navigator.languages ? navigator.languages.join(',') : 'Unknown Language',
      Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown Timezone',
    ]
      .join('||')
      .replace(/ /g, '||')
      .trim();

    const hash = this.hashedFingerprint(hardwareInfo);

    return hash;
  }

  /**
   * Generate a hashed fingerprint from the provided hardware information string using a custom hashing algorithm.
   *
   * The algorithm initializes three hash values (hashA, hashB, hashC) with specific constants.
   * It then iterates over each character in the input string, updating the hash values using bitwise XOR and a series of left shifts and additions.
   * Finally, it combines the three hash values into a single hexadecimal string, which serves as the device fingerprint.
   *
   * @param hardwareInfo The hardware information string to be hashed.
   * @returns A hexadecimal string representing the hashed fingerprint.
   */
  hashedFingerprint(hardwareInfo: string): string {
    let hashA = 0x5ee5bc22;
    let hashB = 0xcc81d37e;
    let hashC = 0x86d38a91;

    for (let characterIndex = 0; characterIndex < hardwareInfo.length; characterIndex++) {
      const charCode = hardwareInfo.charCodeAt(characterIndex);

      hashA ^= charCode;
      hashA += (hashA << 1) + (hashA << 4) + (hashA << 7) + (hashA << 8) + (hashA << 24);

      hashB ^= charCode;
      hashB += (hashB << 3) + (hashB << 5) + (hashB << 9) + (hashB << 11) + (hashB << 26);

      hashC ^= charCode;
      hashC += (hashC << 2) + (hashC << 6) + (hashC << 10) + (hashC << 14) + (hashC << 24);
    }

    const hexPartA = (hashA >>> 0).toString(16);
    const hexPartB = (hashB >>> 0).toString(16);
    const hexPartC = (hashC >>> 0).toString(16);

    return (hexPartA + hexPartB + hexPartC).padStart(24, '0');
  }

  /**
   * Get a user-friendly device name based on the user's platform and browser, including a short fingerprint suffix for uniqueness.
   *
   * @returns A string representing the device name, e.g., "Windows - Chrome - (abc123)
   */
  getDeviceName(): string {
    const userAgent = navigator.userAgent || 'Unknown User Agent';

    let platform = navigator.platform || 'Unknown Platform';
    if (platform.includes('Win')) platform = 'Windows';
    else if (platform.includes('Mac')) platform = 'macOS';
    else if (platform.includes('Linux')) platform = 'Linux';
    else if (/Android/.test(userAgent)) platform = 'Android';
    else if (/iPhone|iPad|iPod/.test(userAgent)) platform = 'iOS';

    let browser = 'Unknown Browser';
    if (userAgent.includes('Chrome/') && !userAgent.includes('Edg/')) browser = 'Chrome';
    else if (userAgent.includes('Firefox/')) browser = 'Firefox';
    else if (userAgent.includes('Safari/')) browser = 'Safari';
    else if (userAgent.includes('Edg/')) browser = 'Edge';
    else if (userAgent.includes('Opera/') || userAgent.includes('OPR/')) browser = 'Opera';

    const suffix = btoa(this.getDeviceFingerprint().substring(0, 6));

    return `${platform} - ${browser} - ( ${suffix} )`;
  }

  /**
   * Get the current logged in user's ID from local storage
   *
   * @returns The user ID if available, otherwise null
   */
  getCurrentUserId(): number | null {
    if (!this.isLoggedIn()) {
      return null;
    }

    const userId = localStorage.getItem('user_id');
    return userId ? parseInt(userId, 10) : null;
  }

  /**
   * Check if the current user is the owner of a resource
   *
   * @param userId
   * @returns
   */
  isOwner(userId: number | null): boolean {
    if (!this.isLoggedIn() || userId === null) {
      return false;
    }
    return this.getCurrentUserId() !== null && this.getCurrentUserId() === userId;
  }
}
