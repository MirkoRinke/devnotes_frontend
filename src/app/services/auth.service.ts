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
    if (this.isLoggedIn()) {
      return 1;
    }
    return null;
  }
}
