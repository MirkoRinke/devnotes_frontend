import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthStorageService {
  /**
   * Saves both the access token and user ID to local storage, typically called after a successful login.
   *
   * @param token The access token to be saved.
   * @param userId The user ID to be saved.
   */
  saveLoginData(token: string, userId: number) {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user_id', userId.toString());
  }

  /**
   * Clears the login data (access token and user ID) from local storage, effectively logging the user out.
   */
  clearLoginData() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user_id');
  }
}
