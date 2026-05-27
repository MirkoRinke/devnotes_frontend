import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService } from './auth.service';
import { ApiService } from './api.service';

import { ApiEndpointEnums } from '../enums/api-endpoint';

import type { LoginFormInterface, LoginDataInterface } from '../interfaces/login-form';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  constructor(
    private authService: AuthService,
    private apiService: ApiService,
  ) {}

  login<T>(data: LoginFormInterface): Observable<T> {
    const deviceFingerprint = this.authService.getDeviceFingerprint();
    const deviceName = this.authService.getDeviceName();

    const loginData: LoginDataInterface = {
      ...data,
      device_fingerprint: deviceFingerprint,
      device_name: deviceName,
    };

    return this.apiService.post<T>(ApiEndpointEnums.LOGIN, loginData).pipe(
      tap((response: any) => {
        console.log('Login erfolgreich:', response);
      }),
    );
  }
}
