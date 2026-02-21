import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    // Temporary implementation, returns a mock token or null
    if (environment.loggedIn) {
      return environment.TEMP_TOKEN;
    }
    return null;
  }

  getDeviceFingerprint(): string {
    // Temporary implementation, returns a mock fingerprint
    return environment.TEMP_FINGERPRINT;
  }

  getCurrentUserId(): number | null {
    // Temporary implementation, returns a mock user ID or null
    if (this.isLoggedIn()) {
      return environment.USER_ID;
    }
    return null;
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
