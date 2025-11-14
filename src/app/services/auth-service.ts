import { Injectable } from '@angular/core';

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
    const TemporaryLoggedIn = true; // Set to 'true' to simulate a logged-in user
    if (TemporaryLoggedIn) {
      return '25|FEtDy1tSzTm48YlpXOF9c5kIARDQq6XCJODDvB0vdcc4aafe';
    }
    return null;
  }

  getDeviceFingerprint(): string {
    // Temporary implementation, returns a mock fingerprint
    return '73a90acaae2b1ccc0e969709665bc62f';
  }

  getCurrentUserId(): number | null {
    // Temporary implementation, returns a mock user ID or null
    const TemporaryLoggedIn = true; // Set to 'true' to simulate a logged-in user
    if (TemporaryLoggedIn) {
      return 1;
    }
    return null;
  }
}
