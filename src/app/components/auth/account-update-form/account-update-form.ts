import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { mismatchedFieldsValidator } from '../../../utils/custom-validators';

import { AuthService } from '../../../services/auth.service';
import { ApiService } from '../../../services/api.service';
import { ApiErrorHandlingService } from '../../../services/api-error-handling.service';
import { TranslationService } from '../../../i18n/translation.service';
import { UserNameAvailabilityService } from '../../../services/user-name-availability.service';

import { BadgeMessageHandler } from '../../../utils/badge-message-handler';
import { AUTH_FORMS_CONFIG } from '../../../config/auth-forms.config';

import type {
  AccountSettingsFormErrorsInterface,
  AccountSettingsMessagesInterface,
  AccountSettingsFormInterface,
  AccountSettingsAvailabilityResponseInterface,
} from '../../../interfaces/account-settings';
import type { BackendErrorResponseInterface, BusinessActionInterface, ParamsInterface } from '../../../interfaces/error-handling';
import type { BadgeMessagesInterface } from '../../../interfaces/validation-messages';
import { badgeMessagesInit } from '../../../interfaces/validation-messages';

import type { ApiResponseObjektInterface } from '../../../interfaces/api-response';
import type { UserInterface } from '../../../interfaces/user';

import { ApiEndpointEnums } from '../../../enums/api-endpoint';

import { SvgIconsService } from '../../../services/svg.icons.service';
import { Badge } from '../../badge/badge';

import { catchError, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { PasswordToggleButton } from '../password-toggle-button/password-toggle-button';
import { PasswordStrengthFeedback } from '../password-strength-feedback/password-strength-feedback';

@Component({
  selector: 'app-account-update-form',
  imports: [ReactiveFormsModule, RouterModule, Badge, PasswordToggleButton, PasswordStrengthFeedback],
  templateUrl: './account-update-form.html',
  styleUrl: './account-update-form.scss',
})
export class AccountUpdateForm {
  accountSettingsForm: FormGroup | null = null;

  messages: AccountSettingsMessagesInterface = {
    email: { ...badgeMessagesInit },
    email_confirmation: { ...badgeMessagesInit },
    name: { ...badgeMessagesInit },
    password: { ...badgeMessagesInit },
    password_confirmation: { ...badgeMessagesInit },
    accountSettings: { ...badgeMessagesInit },
    passwordMismatch: { ...badgeMessagesInit },
    emailMismatch: { ...badgeMessagesInit },
    current_password: { ...badgeMessagesInit },
  };

  private messageKeys: (keyof AccountSettingsMessagesInterface)[] = [
    'name',
    'email',
    'email_confirmation',
    'password',
    'password_confirmation',
    'current_password',
    'accountSettings',
    'passwordMismatch',
    'emailMismatch',
  ];

  isProcessing: boolean = false;

  isPasswordFocused: boolean = false;
  isPasswordVisible: boolean = false;

  private destroyRef = inject(DestroyRef);

  private msg = new BadgeMessageHandler<AccountSettingsMessagesInterface>(this.messages, 'Auth', inject(TranslationService));

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private apiService: ApiService,
    public svgIconsService: SvgIconsService,
    private apiErrorHandlingService: ApiErrorHandlingService,
    private userNameAvailabilityService: UserNameAvailabilityService,
  ) {}

  ngOnInit() {
    this.createForm();
  }

  /**
   * Initializes the accountSettings form with form controls and their respective validators.
   * The form controls include name, email, email_confirmation, password, password_confirmation, and current_password.
   */
  private createForm() {
    this.accountSettingsForm = this.fb.group(
      {
        name: AUTH_FORMS_CONFIG.name('', false),
        email: AUTH_FORMS_CONFIG.email('', false),
        email_confirmation: AUTH_FORMS_CONFIG.email('', false),
        password: AUTH_FORMS_CONFIG.registerPassword('', false),
        password_confirmation: AUTH_FORMS_CONFIG.registerPassword_confirmation('', false),
        current_password: AUTH_FORMS_CONFIG.loginPassword('', true),
      },
      {
        validators: [mismatchedFieldsValidator('password', 'password_confirmation', 'passwordMismatch'), mismatchedFieldsValidator('email', 'email_confirmation', 'emailMismatch')],
      },
    );

    this.initAvailabilityCheck();
    this.initLiveFeedback();
  }

  /**
   * Helper method to get a form control by name. Returns null if the form is not initialized or if the control does not exist.
   *
   * @param name The name of the form control.
   * @returns The form control or null if it does not exist.
   */
  public getControl(name: string): FormControl | null {
    if (!this.accountSettingsForm) {
      return null;
    }
    return this.accountSettingsForm.get(name) as FormControl;
  }

  /**
   * Initializes the availability check for specific form controls by subscribing to their value changes.
   * It checks the availability of the entered values and updates the form control's error state accordingly.
   * This provides real-time feedback to the user regarding the availability of their chosen name.
   */
  private initAvailabilityCheck() {
    const fields: (keyof AccountSettingsAvailabilityResponseInterface)[] = ['name'];

    fields.forEach((controlName) => {
      const formControl: AbstractControl | null = this.accountSettingsForm?.get(controlName) || null;
      if (!formControl) return;
      this.createAvailabilityStream(formControl, controlName).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    });
  }

  /**
   * Creates an observable stream that checks the availability of a user name based on the value changes of the provided form control.
   *
   * @param formControl The form control to monitor for value changes.
   * @param controlName The name of the control to check for availability.
   * @returns An observable that emits the availability check results.
   */
  private createAvailabilityStream(formControl: AbstractControl, controlName: keyof AccountSettingsAvailabilityResponseInterface) {
    return formControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((value) => {
        if (formControl.valid && value && value.trim() !== '' && value.length >= 2) {
          return this.userNameAvailabilityService.checkUserNameAvailability(formControl, value, controlName).pipe(
            tap((response) => {
              const data: AccountSettingsAvailabilityResponseInterface | null = response?.data?.data || null;
              if (!data) return;

              if (data && data[controlName] && data[controlName].includes(`${controlName.toUpperCase()}_ALREADY_IN_USE`)) {
                this.userNameAvailabilityService.setUserNameError(formControl);
                this.msg.setMessage('accountSettings', 'info', `${controlName.toUpperCase()}_ALREADY_IN_USE`, { name: value });
              } else {
                this.userNameAvailabilityService.clearUserNameError(formControl);
                this.msg.setMessage('accountSettings', 'success', `${controlName.toUpperCase()}_AVAILABLE`, { name: value });
              }
            }),
            catchError((error) => {
              const errorResponse: BackendErrorResponseInterface = error.error;
              const businessAction = this.apiErrorHandlingService.handleApiError(errorResponse);

              if (businessAction) {
                if (businessAction.messages.validatorKey === 'FORBIDDEN_NAME') {
                  this.msg.setMessage('accountSettings', businessAction.messages.messageType, businessAction.messages.validatorKey, { name: value });
                } else {
                  this.msg.setMessage('accountSettings', businessAction.messages.messageType, businessAction.messages.validatorKey, businessAction.messages.params);
                }
              }
              return of(null);
            }),
          );
        }
        this.userNameAvailabilityService.clearUserNameError(formControl);

        if (formControl.hasError('userNameUnavailable')) {
          this.msg.clearMessage('accountSettings');
        }

        return of(null);
      }),
    );
  }

  /**
   * Initializes live feedback for the form controls by subscribing to their value changes.
   * It checks for specific validation errors and sets or clears the corresponding messages accordingly.
   * This provides real-time feedback to the user as they interact with the form controls.
   */
  private initLiveFeedback() {
    const fieldConfigs: { control: string; field: keyof AccountSettingsMessagesInterface; type: keyof BadgeMessagesInterface; errorKey: string }[] = [
      { control: 'name', field: 'accountSettings', type: 'info', errorKey: 'tooMuchWhitespace' },
      { control: 'name', field: 'name', type: 'error', errorKey: 'tooMuchWhitespace' },
      { control: 'password', field: 'password', type: 'error', errorKey: 'minlength' },
      { control: 'password', field: 'password', type: 'error', errorKey: 'weakPassword' },
    ];

    fieldConfigs.forEach(({ control, field, type, errorKey }) => {
      const formControl = this.accountSettingsForm?.get(control);
      if (!formControl) return;

      formControl.valueChanges.pipe(debounceTime(200), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        if (formControl.hasError(errorKey)) {
          if (control === 'name') {
            this.msg.setMessage(field, type, errorKey, { name: formControl.value });
          } else {
            this.msg.setMessage(field, type, errorKey);
          }
        } else if (!formControl.hasError(errorKey)) {
          this.msg.clearMessage(field);
        }
      });
    });
  }

  /**
   * Handles the form submission. It first checks if the form is valid. If not, it marks all controls as touched, retrieves form errors, and sets appropriate error messages.
   * If the form is valid, it constructs a data object containing the form values and calls the saveAccountSettings method to perform the account settings update.
   *
   * @returns
   */
  public onSubmit() {
    if (!this.accountSettingsForm) return;

    if (this.accountSettingsForm.invalid) {
      this.accountSettingsForm.markAllAsTouched();
      this.setErrorMessage();
      return;
    }

    const formData = this.accountSettingsForm.value;

    let data: AccountSettingsFormInterface = {
      current_password: formData.current_password,
    };

    Object.entries(formData).forEach(([key, value]) => {
      if (value === undefined || value === null || value === '' || key in data) {
        return;
      }

      data = { ...data, [key]: value };
    });

    const hasChanges = Object.keys(data).length > 1;

    if (!hasChanges) {
      this.msg.setMessage('accountSettings', 'info', 'NO_CHANGES');
      return;
    }

    this.saveAccountSettings(data);
  }

  /**
   * Performs the account settings update by calling the ApiService.
   * It also handles the response and error scenarios, updating the messages accordingly.
   *
   * @param data
   * @returns
   */
  private saveAccountSettings(data: AccountSettingsFormInterface) {
    /**
     * Prevent multiple submissions while the request is being processed.
     */
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    const user_id = this.authService.getCurrentUserId();
    if (user_id === null) return;

    const url = `${ApiEndpointEnums.USER}${user_id}/`;

    this.apiService.patch<ApiResponseObjektInterface<UserInterface>>(url, data).subscribe({
      next: (response) => {
        this.msg.setMessage('accountSettings', 'success', 'ACCOUNT_SETTINGS_UPDATED');
        this.isProcessing = false;
      },
      error: (error) => {
        const errorResponse: BackendErrorResponseInterface = error.error;

        const businessAction: BusinessActionInterface | null = this.apiErrorHandlingService.handleApiError(errorResponse) || null;
        const params: ParamsInterface | null = businessAction?.messages?.params || null;

        if (businessAction) {
          this.msg.setMessage('accountSettings', businessAction.messages.messageType, businessAction.messages.validatorKey, params);
        } else {
          this.msg.setMessage('accountSettings', 'error', 'UNKNOWN_ERROR');
        }

        this.isProcessing = false;
      },
    });
  }

  /**
   * Sets the error messages for the form controls based on the validation errors present in the form.
   * It iterates through the defined fields and checks if there are any errors for each field.
   */
  private setErrorMessage() {
    const controlErrors = this.getFormErrors();
    const formErrors = this.accountSettingsForm?.errors || {};
    const allErrors = { ...controlErrors, ...formErrors };

    console.log('Form validation errors:', allErrors);

    this.messageKeys.forEach((field) => {
      if (allErrors[field]) {
        const validatorKey = Object.keys(allErrors[field])[0];
        this.msg.setMessage(field, 'error', validatorKey);
      } else {
        this.msg.clearMessage(field);
      }
    });

    if (allErrors['passwordMismatch']) {
      this.msg.setMessage('passwordMismatch', 'error', 'passwordMismatch');
    }

    if (allErrors['emailMismatch']) {
      this.msg.setMessage('emailMismatch', 'error', 'emailMismatch');
    }
  }

  /**
   * Retrieves the validation errors from the form controls and returns an object containing the errors for each control.
   * It iterates through the form controls, checks if they are invalid, and if so, adds their errors to the resulting object.
   *
   * @returns
   */
  private getFormErrors() {
    const errors: { [key: string]: AccountSettingsFormErrorsInterface } = {};
    Object.entries(this.accountSettingsForm?.controls || {}).forEach(([key, control]) => {
      if (control.invalid && control.errors) {
        (errors as any)[key] = control.errors;
      }
    });
    return errors;
  }

  /**
   * Retrieves the appropriate error message for the password confirmation field based on its validation state.
   */
  get passwordConfirmationErrorMessage() {
    const control = this.accountSettingsForm?.get('password_confirmation');

    if (control?.invalid && control?.touched) {
      return this.messages['password_confirmation'];
    }

    if (this.accountSettingsForm?.hasError('passwordMismatch')) {
      return this.messages['passwordMismatch'];
    }

    return null;
  }

  get emailConfirmationErrorMessage() {
    const control = this.accountSettingsForm?.get('email_confirmation');

    if (control?.invalid && control?.touched) {
      return this.messages['email_confirmation'];
    }

    if (this.accountSettingsForm?.hasError('emailMismatch')) {
      return this.messages['emailMismatch'];
    }

    return null;
  }
}
