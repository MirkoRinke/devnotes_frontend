import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { SvgIconsService } from '../../services/svg.icons.service';
import { DeleteAccountService } from '../../services/delete-account.service';
import { ApiErrorHandlingService } from '../../services/api-error-handling.service';
import { TranslationService } from '../../i18n/translation.service';

import { BadgeMessageHandler } from '../../utils/badge-message-handler';

import { AuthService } from '../../services/auth.service';

import type { DeleteAccountErrorsInterface, DeleteAccountInterface, DeleteAccountMessagesInterface } from '../../interfaces/delete-account';
import type { BackendErrorResponseInterface, BusinessActionInterface, ParamsInterface } from '../../interfaces/error-handling';
import { badgeMessagesInit } from '../../interfaces/validation-messages';

import { emailOrUsernameValidator } from '../../utils/custom-validators';
import { RegexEnums } from '../../enums/regex';

import { Badge } from '../badge/badge';
import { PasswordToggleButton } from '../password-toggle-button/password-toggle-button';

@Component({
  selector: 'app-delete-account',
  imports: [ReactiveFormsModule, Badge, RouterModule, PasswordToggleButton],
  templateUrl: './delete-account.html',
  styleUrl: './delete-account.scss',
})
export class DeleteAccount {
  deleteAccountForm: FormGroup | null = null;
  doubleCheckIdentifier = false;

  messages: DeleteAccountMessagesInterface = {
    identifier: { ...badgeMessagesInit },
    password: { ...badgeMessagesInit },
    deleteAccount: { ...badgeMessagesInit },
  };

  isProcessing: boolean = false;

  isPasswordFocused: boolean = false;
  isPasswordVisible: boolean = false;

  private destroyRef = inject(DestroyRef);

  private msg = new BadgeMessageHandler<DeleteAccountMessagesInterface>(this.messages, 'Auth', inject(TranslationService));

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
  private setErrorMessage() {
    const errors = this.getFormErrors();
    const fields: (keyof DeleteAccountMessagesInterface)[] = ['identifier', 'password'];

    fields.forEach((field) => {
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

  /**
   * Determines the appropriate duck icon to display based on the focus state of the password field and the length of the entered password.
   *
   * @returns The name of the duck icon to display.
   */
  getDuckIcon(): string {
    if (!this.isPasswordFocused) return 'delete_account_normal_duck';

    const length = this.deleteAccountForm?.get('password')?.value?.length || 0;

    if (length === 0) return 'delete_account_half_closed_duck_1';
    if (length <= 2) return 'delete_account_half_closed_duck_2';
    return 'delete_account_close_duck';
  }
}
