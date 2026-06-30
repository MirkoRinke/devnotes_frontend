import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from './api.service';

import { ApiEndpointEnums } from '../enums/api-endpoint';

import type { RegisterFormInterface } from '../interfaces/register-form';

import type { ApiResponseObjektInterface } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class RegisterService {
  constructor(private apiService: ApiService) {}

  /**
   * Performs the registration operation by sending the registration data to the API endpoint.
   *
   * @param data
   * @returns
   */
  register(data: RegisterFormInterface): Observable<ApiResponseObjektInterface<null>> {
    return this.apiService.post<ApiResponseObjektInterface<null>>(ApiEndpointEnums.REGISTER, data);
  }
}
