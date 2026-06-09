import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { ApiService } from './api.service';

import { ApiEndpointEnums } from '../enums/api-endpoint';
import { AuthStorageService } from './auth-storage.service';

import type { LoginFormInterface, LoginDataInterface, LoginResponseInterface } from '../interfaces/login-form';
import type { ApiResponseObjektInterface } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private authStorageService: AuthStorageService,
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
          this.authStorageService.saveLoginData(token, userId);
        }
      }),
    );
  }
}
