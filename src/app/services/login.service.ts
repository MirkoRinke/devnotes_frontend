import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { ApiService } from './api.service';

import { ApiEndpointEnums } from '../enums/api-endpoint';

import type { LoginFormInterface, LoginDataInterface, LoginResponseInterface } from '../interfaces/login-form';
import type { ApiResponseObjektInterface } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
  ) {}

  /**
   * Performs the login operation by sending the login data to the API and handling the response.
   *
   * @param data
   * @returns
   */
  login(data: LoginFormInterface): Observable<ApiResponseObjektInterface<LoginResponseInterface>> {
    const deviceFingerprint = this.authService.getDeviceFingerprint();
    const deviceName = this.authService.getDeviceName();

    const loginData: LoginDataInterface = {
      ...data,
      device_fingerprint: deviceFingerprint,
      device_name: deviceName,
    };

    return this.apiService.post<ApiResponseObjektInterface<LoginResponseInterface>>(ApiEndpointEnums.LOGIN, loginData).pipe(
      tap((response: ApiResponseObjektInterface<LoginResponseInterface>) => {
        const token = response.data.data.accessToken || null;
        const userId = response.data.data.user_id || null;
        if (token && userId) {
          this.saveToken(token);
          this.saveUserId(userId);
        }
      }),
    );
  }

  /**
   * Saves the access token to local storage for later use in authenticated requests.
   *
   * @param token The access token to be saved.
   */
  saveToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  /**
   * Saves the user ID to local storage for later use in identifying the logged-in user.
   *
   * @param userId The user ID to be saved.
   */
  saveUserId(userId: number) {
    localStorage.setItem('user_id', userId.toString());
  }

  /**
   * Performs the logout operation by removing the access token and user ID from local storage, effectively logging the user out.
   */
  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user_id');

    //TODO: Implement logout logic, e.g., redirect to the login page.
  }
}
