import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { ApiService } from './api.service';

import { ApiEndpointEnums } from '../enums/api-endpoint';
import { AuthStorageService } from './auth-storage.service';

import type { DeleteAccountInterface } from '../interfaces/delete-account';
import type { ApiResponseObjektInterface } from '../interfaces/api-response';

@Injectable({
  providedIn: 'root',
})
export class DeleteAccountService {
  constructor(
    private apiService: ApiService,
    private authStorageService: AuthStorageService,
  ) {}

  /**
   * Performs the delete account operation by sending the delete account data to the API and handling the response.
   *
   * @param data
   * @returns
   */
  deleteAccount(data: DeleteAccountInterface): Observable<ApiResponseObjektInterface<null>> {
    return this.apiService.delete<ApiResponseObjektInterface<null>>(ApiEndpointEnums.DELETE_ACCOUNT, data).pipe(
      tap(() => {
        this.authStorageService.clearLoginData();
      }),
    );
  }
}
