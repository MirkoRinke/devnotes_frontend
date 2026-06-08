import { Injectable } from '@angular/core';

import type { BackendErrorResponseInterface, BusinessActionInterface } from '../interfaces/error-handling';

@Injectable({
  providedIn: 'root',
})
export class ApiErrorHandlingService {
  processTechnicalError(error: BackendErrorResponseInterface): void {}

  processValidationIssues(error: BackendErrorResponseInterface): void {}

  processBusinessEvent(error: BackendErrorResponseInterface): BusinessActionInterface {
    switch (error.code) {
      case 403:
        if (error.errors === 'PRIVACY_POLICY_NOT_ACCEPTED' || error.errors === 'TERMS_OF_SERVICE_NOT_ACCEPTED') {
          return {
            mustAcceptConditions: true,
            messages: {
              message: 'Es gab neue Nutzungsbedingungen oder Datenschutzrichtlinien',
              messageType: 'info',
            },
          };
        }
        break;

      case 401:
        if (error.errors === 'CREDENTIALS_INCORRECT') {
          return {
            messages: {
              message: 'E-Mail-Adresse / Benutzername oder Passwort ist falsch.',
              messageType: 'error',
            },
          };
        }
        break;
    }

    return {
      messages: {
        message: 'Es ist ein Fehler aufgetreten. Bitte erneut versuchen.',
        messageType: 'error',
      },
    };
  }
}
