import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import type { BackendErrorResponseInterface, BusinessActionInterface } from '../interfaces/error-handling';
import { AuthStorageService } from './auth-storage.service';

@Injectable({
  providedIn: 'root',
})
export class ApiErrorHandlingService {
  constructor(
    private router: Router,
    private authStorageService: AuthStorageService,
  ) {}

  handleApiError(error: BackendErrorResponseInterface): BusinessActionInterface | void {
    switch (error.code) {
      case 401:
        return this.handle401(error);
      case 403:
        return this.handle403(error);
      default:
        return this.handleDefault(error);
    }
  }

  /**
   * Default error handling for unrecognized error codes.
   * Returns a generic error message to be displayed to the user.
   *
   * @param error
   * @returns
   */
  private handleDefault(error: BackendErrorResponseInterface): BusinessActionInterface | void {
    console.warn('Unbekannter Fehlercode:', error.code);
    console.log('Fehlerdetails:', error);
    return {
      messages: {
        message: 'Es ist ein Fehler aufgetreten. Bitte erneut versuchen.',
        messageType: 'error',
      },
    };
  }

  /**
   * Handles 401 Unauthorized errors.
   *
   * @param error
   * @returns
   */
  private handle401(error: BackendErrorResponseInterface): BusinessActionInterface | void {
    if (error.errors === 'CREDENTIALS_INCORRECT') {
      return {
        messages: {
          message: 'E-Mail-Adresse / Benutzername oder Passwort ist falsch.',
          messageType: 'error',
        },
      };
    }
    if (error.errors === 'UNAUTHORIZED') {
      this.authStorageService.clearLoginData();
      this.router.navigate(['/login']);
      return;
    }
    return this.handleDefault(error);
  }

  /**
   * Handles 403 Forbidden errors.
   *
   * @param error
   * @returns
   */
  private handle403(error: BackendErrorResponseInterface): BusinessActionInterface | void {
    if (error.errors === 'PRIVACY_POLICY_NOT_ACCEPTED' || error.errors === 'TERMS_OF_SERVICE_NOT_ACCEPTED') {
      const isLoginPage = this.router.url.includes('/login');
      if (!isLoginPage) {
        //TODO replace later with a specific page. /compliance-check or something like that
        this.router.navigate(['/login']);
        return;
      }
      return {
        mustAcceptConditions: true,
        messages: {
          message: 'Es gab neue Nutzungsbedingungen oder Datenschutzrichtlinien',
          messageType: 'info',
        },
      };
    }
    return this.handleDefault(error);
  }
}
