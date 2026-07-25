import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthStorageService {
  private logged$ = new BehaviorSubject<void>(undefined);

  readonly authChanged$ = this.logged$.asObservable();

  /**
   * Saves both the access token and user ID to local storage, typically called after a successful login.
   * and emits a notification to subscribers that the authentication state has changed.
   *
   * @param token The access token to be saved.
   * @param userId The user ID to be saved.
   */
  saveLoginData(token: string, userId: number) {
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user_id', userId.toString());
    this.logged$.next();
  }

  /**
   * Clears the login data (access token and user ID) from local storage, effectively logging the user out.
   * and emits a notification to subscribers that the authentication state has changed.
   */
  clearLoginData() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user_id');
    this.logged$.next();
  }
}
