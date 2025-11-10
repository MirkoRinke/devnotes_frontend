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
      return '19|4rH3N15hcWokF5ZwJbVCxyMEl9iZGvFCUfZk90YU07bb08cc';
    }
    return null;
  }

  getDeviceFingerprint(): string {
    // Temporary implementation, returns a mock fingerprint
    return '73a90acaae2b1ccc0e969709665bc62f';
  }
}
