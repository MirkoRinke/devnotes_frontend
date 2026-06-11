import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { SvgIconsService } from '../../services/svg.icons.service';
import { DeleteAccountService } from '../../services/delete-account.service';
import { ApiErrorHandlingService } from '../../services/api-error-handling.service';
import { AuthService } from '../../services/auth.service';

import type { DeleteAccountErrorsInterface, DeleteAccountInterface, DeleteAccountMessagesInterface } from '../../interfaces/delete-account';

import type { BackendErrorResponseInterface } from '../../interfaces/error-handling';

import { emailOrUsernameValidator } from '../../utils/custom-validators';
import { RegexEnums } from '../../enums/regex';

import { Badge } from '../badge/badge';

@Component({
  selector: 'app-delete-account',
  imports: [ReactiveFormsModule, Badge, RouterModule],
  templateUrl: './delete-account.html',
  styleUrl: './delete-account.scss',
})
export class DeleteAccount {
  deleteAccountForm: FormGroup | null = null;
  doubleCheckIdentifier = false;

  messages: DeleteAccountMessagesInterface = {
    identifier: { error: null, info: null, success: null },
    password: { error: null, info: null, success: null },
    deleteAccount: { error: null, info: null, success: null },
  };

  isProcessing = false;

  isPasswordFocused = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private deleteAccountService: DeleteAccountService,
    private router: Router,
    public svgIconsService: SvgIconsService,
    private apiErrorHandlingService: ApiErrorHandlingService,
    private authService: AuthService,
  ) {}

  ngOnInit() {
    this.createForm();
  }

  /**
   * Initializes the delete account form with form controls and validators. If the user must accept conditions, it adds a requiredTrue validator to the acceptedConditions control.
   */
  createForm() {
    this.deleteAccountForm = this.fb.group({
      identifier: ['', [Validators.required, emailOrUsernameValidator('delete_account_identifier_invalid'), Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
    });
  }

  /**
   * Handles the form submission. It first checks if the form is valid. If not, it marks all controls as touched, retrieves form errors, and sets appropriate error messages.
   * If the form is valid, it constructs a DeleteAccountInterface object based on the form values and calls the deleteAccount method to perform the delete account operation.
   *
   * @returns
   */
  onSubmit() {
    if (!this.deleteAccountForm) return;

    if (this.deleteAccountForm.invalid) {
      this.deleteAccountForm.markAllAsTouched();
      this.getFormErrors();
      this.setErrorMessage();
      return;
    }

    if (!this.doubleCheckIdentifier) {
      this.messages['deleteAccount']['info'] = 'Konto wirklich löschen?';
      this.doubleCheckIdentifier = true;
      return;
    }

    const formData = this.deleteAccountForm.value;

    const data: DeleteAccountInterface = {
      password: formData.password,
    };

    const isEmail = new RegExp(RegexEnums.email).test(formData.identifier);
    if (isEmail) {
      data.email = formData.identifier;
    } else {
      data.user_name = formData.identifier;
    }

    this.deleteAccount(data);
  }

  /**
   * Handles the cancel action
   */
  onCancel() {
    if (this.authService.isLoggedIn()) {
      //TODO replace with a /settings or /profile later, when such a page exists
      this.router.navigate(['/my-area']);
    } else {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Performs the delete account operation by calling the deleteAccount method of the DeleteAccountService.
   * It also handles the response and error scenarios, updating the messages and navigation accordingly.
   *
   * @param data
   * @returns
   */
  deleteAccount(data: DeleteAccountInterface) {
    /**
     * Prevent multiple submissions while the delete account request is being processed.
     */
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    this.deleteAccountService
      .deleteAccount(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.messages['deleteAccount']['success'] = 'Konto erfolgreich gelöscht. Weiterleitung...';
          this.messages['deleteAccount']['error'] = null;
          this.messages['deleteAccount']['info'] = null;
          this.isProcessing = false;

          setTimeout(() => {
            //TODO replace with a specific page that informs the user about the successful deletion of their account and provides further options or information.
            this.router.navigate(['/goodbye']);
          }, 2000);
        },
        error: (error) => {
          const errorResponse: BackendErrorResponseInterface = error.error;
          const businessAction = this.apiErrorHandlingService.handleApiError(errorResponse);
          const hasMessages = businessAction?.messages && businessAction.messages.messageType;

          if (hasMessages) {
            this.messages['deleteAccount'][businessAction.messages.messageType] = businessAction.messages.message;
          }

          this.isProcessing = false;
          return;
        },
      });
  }

  /**
   * Sets the error messages for the form fields based on the validation errors present in the form controls.
   */
  setErrorMessage() {
    const errors = this.getFormErrors();
    this.messages['identifier']['error'] = null;
    this.messages['password']['error'] = null;

    if (errors['identifier']) {
      if (errors['identifier']['required']) {
        this.messages['identifier']['error'] = 'E-Mail-Adresse / Benutzernamen eingeben.';
      } else if (errors['identifier']['delete_account_identifier_invalid']) {
        this.messages['identifier']['error'] = 'Die E-Mail-Adresse oder der Benutzername ist ungültig.';
      } else if (errors['identifier']['maxlength']) {
        this.messages['identifier']['error'] = 'Die E-Mail-Adresse oder der Benutzername ist ungültig.';
      }
    }

    if (errors['password']) {
      if (errors['password']['required']) {
        this.messages['password']['error'] = 'Passwort eingeben.';
      } else if (errors['password']['minlength']) {
        this.messages['password']['error'] = 'Das Passwort muss mindestens 6 Zeichen lang sein.';
      } else if (errors['password']['maxlength']) {
        this.messages['password']['error'] = 'Das Passwort darf maximal 255 Zeichen lang sein.';
      }
    }
  }

  /**
   * Retrieves the validation errors from the form controls and returns an object containing the errors for each control.
   * It iterates through the form controls, checks if they are invalid, and if so, adds their errors to the resulting object.
   *
   * @returns
   */
  getFormErrors() {
    const errors: { [key: string]: DeleteAccountErrorsInterface } = {};
    Object.entries(this.deleteAccountForm?.controls || {}).forEach(([key, control]) => {
      if (control.invalid && control.errors) {
        (errors as any)[key] = control.errors;
      }
    });
    return errors;
  }

  getDuckIcon(): string {
    if (!this.isPasswordFocused) return 'delete_account_normal_duck';

    const length = this.deleteAccountForm?.get('password')?.value?.length || 0;

    if (length === 0) return 'delete_account_half_closed_duck_1';
    if (length <= 2) return 'delete_account_half_closed_duck_2';
    return 'delete_account_close_duck';
  }
}
