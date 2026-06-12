import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import type { BackendErrorResponseInterface, BusinessActionInterface } from '../interfaces/error-handling';
import { AuthStorageService } from './auth-storage.service';
import { RegexEnums } from '../enums/regex';

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
      case 429:
        return this.handle429(error);
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
    /**
     * Unified error message for Login and Account Deletion to prevent User Enumeration attacks.
     */
    if (error.errors === 'CREDENTIALS_INCORRECT' || error.errors === 'ACCOUNT_DELETION_INVALID_CREDENTIALS') {
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
      const isAgreementPage = this.router.url.includes('/agreement');

      if (!isLoginPage && !isAgreementPage) {
        this.authStorageService.clearLoginData();
        this.router.navigate(['/agreement']);
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

    /**
     * Specific handling for internal account types (e.g., 'guest','admin', etc.)
     * where standard self-service deletion is restricted for business reasons.
     */
    if (error.errors === 'ACCOUNT_DELETION_FORBIDDEN') {
      return {
        messages: {
          message: 'Das Löschen des Kontos ist nicht möglich.',
          messageType: 'error',
        },
      };
    }

    if (error.errors === 'ACCOUNT_SUSPENDED') {
      const isLoginPage = this.router.url.includes('/login');
      const isAgreementPage = this.router.url.includes('/agreement');

      const match = error.message.match(new RegExp(RegexEnums.digitsOnly));
      const days = match ? match[0] : 'unbekannt';

      if (!isLoginPage && !isAgreementPage) {
        this.authStorageService.clearLoginData();
        this.router.navigate(['/login']);
        return;
      }

      return {
        messages: {
          message: `Ihr Konto wurde für ${days} Tage gesperrt.`,
          messageType: 'error',
        },
      };
    }

    return this.handleDefault(error);
  }

  /**
   * Handles 429 Too Many Requests errors.
   *
   * @param error
   * @returns
   */
  private handle429(error: BackendErrorResponseInterface): BusinessActionInterface | void {
    if (error.errors === 'TOO_MANY_REQUESTS') {
      return {
        messages: {
          message: 'Zu viele Anfragen. Bitte warten sie einen Moment.',
          messageType: 'error',
        },
      };
    }
    return this.handleDefault(error);
  }
}
