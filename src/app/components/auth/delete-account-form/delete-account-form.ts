import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { SvgIconsService } from '../../../services/svg.icons.service';
import { DeleteAccountService } from '../../../services/delete-account.service';
import { ApiErrorHandlingService } from '../../../services/api-error-handling.service';
import { TranslationService } from '../../../i18n/translation.service';
import { TranslatePipe } from '../../../i18n/translate-pipe';

import { BadgeMessageHandler } from '../../../utils/badge-message-handler';
import { AUTH_FORMS_CONFIG } from '../../../config/auth-forms.config';

import { AuthService } from '../../../services/auth.service';

import type { DeleteAccountErrorsInterface, DeleteAccountInterface, DeleteAccountMessagesInterface } from '../../../interfaces/delete-account-form';
import type { BackendErrorResponseInterface, BusinessActionInterface, ParamsInterface } from '../../../interfaces/error-handling';
import { badgeMessagesInit } from '../../../interfaces/validation-messages';

import { RegexEnums } from '../../../enums/regex';

import { Badge } from '../../badge/badge';
import { PasswordToggleButton } from '../password-toggle-button/password-toggle-button';

@Component({
  selector: 'app-delete-account-form',
  imports: [ReactiveFormsModule, Badge, RouterModule, PasswordToggleButton, TranslatePipe],
  templateUrl: './delete-account-form.html',
  styleUrl: './delete-account-form.scss',
})
export class DeleteAccountForm {
  public deleteAccountForm: FormGroup | null = null;
  public doubleCheckIdentifier = false;

  public messages: DeleteAccountMessagesInterface = {
    identifier: { ...badgeMessagesInit },
    password: { ...badgeMessagesInit },
    deleteAccount: { ...badgeMessagesInit },
  };

  private readonly messageKeys: (keyof DeleteAccountMessagesInterface)[] = ['identifier', 'password'];

  public isProcessing: boolean = false;

  public isPasswordFocused: boolean = false;
  public isPasswordVisible: boolean = false;

  private readonly destroyRef = inject(DestroyRef);

  private readonly msg = new BadgeMessageHandler<DeleteAccountMessagesInterface>(this.messages, 'Auth', inject(TranslationService));

  constructor(
    private readonly fb: FormBuilder,
    private readonly deleteAccountService: DeleteAccountService,
    private readonly router: Router,
    public readonly svgIconsService: SvgIconsService,
    private readonly apiErrorHandlingService: ApiErrorHandlingService,
    private readonly authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  /**
   * Initializes the delete account form with form controls and validators. If the user must accept conditions, it adds a requiredTrue validator to the acceptedConditions control.
   */
  private createForm(): void {
    this.deleteAccountForm = this.fb.group({
      identifier: AUTH_FORMS_CONFIG.identifier(),
      password: AUTH_FORMS_CONFIG.loginPassword(),
    });
  }

  /**
   * Handles the form submission. It first checks if the form is valid. If not, it marks all controls as touched, retrieves form errors, and sets appropriate error messages.
   * If the form is valid, it constructs a DeleteAccountInterface object based on the form values and calls the deleteAccount method to perform the delete account operation.
   *
   * @returns
   */
  public onSubmit(): void {
    if (!this.deleteAccountForm) return;

    if (this.deleteAccountForm.invalid) {
      this.deleteAccountForm.markAllAsTouched();
      this.setErrorMessage();
      return;
    }

    if (!this.doubleCheckIdentifier) {
      this.msg.setMessage('deleteAccount', 'info', 'DELETE_ACCOUNT_CONFIRMATION');
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
  public onCancel(): void {
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
  private deleteAccount(data: DeleteAccountInterface): void {
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
        next: () => {
          this.msg.setMessage('deleteAccount', 'success', 'DELETE_ACCOUNT_SUCCESSFUL');

          this.isProcessing = false;

          setTimeout(() => {
            this.router.navigate(['/farewell']);
          }, 2000);
        },
        error: (error) => {
          const errorResponse: BackendErrorResponseInterface = error.error;

          const businessAction: BusinessActionInterface | null = this.apiErrorHandlingService.handleApiError(errorResponse) || null;
          const params: ParamsInterface | null = businessAction?.messages?.params || null;

          if (businessAction) {
            this.msg.setMessage('deleteAccount', businessAction.messages.messageType, businessAction.messages.validatorKey, params);
          } else {
            this.msg.setMessage('deleteAccount', 'error', 'UNKNOWN_ERROR');
          }

          this.isProcessing = false;
          return;
        },
      });
  }

  /**
   * Sets the error messages for the form controls based on the validation errors present in the form.
   * It iterates through the defined fields and checks if there are any errors for each field.
   */
  private setErrorMessage(): void {
    const errors = this.getFormErrors();

    this.messageKeys.forEach((field) => {
      if (errors[field]) {
        const validatorKey = Object.keys(errors[field])[0];
        this.msg.setMessage(field, 'error', validatorKey);
      } else {
        this.msg.clearMessage(field);
      }
    });
  }

  /**
   * Retrieves the validation errors from the form controls and returns an object containing the errors for each control.
   * It iterates through the form controls, checks if they are invalid, and if so, adds their errors to the resulting object.
   *
   * @returns An object containing the validation errors for each form control.
   */
  private getFormErrors(): { [key: string]: DeleteAccountErrorsInterface } {
    const errors: { [key: string]: DeleteAccountErrorsInterface } = {};
    Object.entries(this.deleteAccountForm?.controls || {}).forEach(([key, control]) => {
      if (control.invalid && control.errors) {
        errors[key] = control.errors;
      }
    });
    return errors;
  }

  /**
   * Determines the appropriate duck icon to display based on the focus state of the password field and the length of the entered password.
   *
   * @returns The name of the duck icon to display.
   */
  public getDuckIcon(): string {
    if (!this.isPasswordFocused) return 'delete_account_normal_duck';

    const length = this.deleteAccountForm?.get('password')?.value?.length || 0;

    if (length === 0) return 'delete_account_half_closed_duck_1';
    if (length <= 2) return 'delete_account_half_closed_duck_2';
    return 'delete_account_close_duck';
  }
}
