import { Component, Input, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { LoginService } from '../../services/login.service';
import { ApiErrorHandlingService } from '../../services/api-error-handling.service';
import { TranslationService } from '../../i18n/translation.service';

import type { LoginFormErrorsInterface, LoginFormInterface, LoginMessagesInterface } from '../../interfaces/login-form';
import type { BackendErrorResponseInterface, ParamsInterface } from '../../interfaces/error-handling';
import { badgeMessagesInit } from '../../interfaces/validation-messages';

import { emailOrUsernameValidator } from '../../utils/custom-validators';
import { RegexEnums } from '../../enums/regex';

import { SvgIconsService } from '../../services/svg.icons.service';
import { Badge } from '../badge/badge';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, Badge, RouterModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  @Input() agreementPage: boolean = false;

  loginForm: FormGroup | null = null;
  mustAcceptConditions: boolean = false;

  messages: LoginMessagesInterface = {
    identifier: { ...badgeMessagesInit },
    password: { ...badgeMessagesInit },
    acceptedConditions: { ...badgeMessagesInit },
    login: { ...badgeMessagesInit },
  };

  isProcessing = false;

  isPasswordFocused = false;

  private destroyRef = inject(DestroyRef);

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    public svgIconsService: SvgIconsService,
    private apiErrorHandlingService: ApiErrorHandlingService,
    private translationService: TranslationService,
  ) {}

  ngOnInit() {
    if (this.agreementPage) {
      this.mustAcceptConditions = true;
    }
    this.createForm();
  }

  /**
   * Initializes the login form with form controls and validators. If the user must accept conditions, it adds a requiredTrue validator to the acceptedConditions control.
   */
  private createForm() {
    const acceptedConditionsValidators = this.mustAcceptConditions ? [Validators.requiredTrue] : [];

    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required, emailOrUsernameValidator('login_identifier_invalid'), Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
      acceptedConditions: [false, acceptedConditionsValidators],
    });
  }

  /**
   * Handles the form submission. It first checks if the form is valid. If not, it marks all controls as touched, retrieves form errors, and sets appropriate error messages.
   * If the form is valid, it constructs a LoginFormInterface object based on the form values and calls the login method to perform the login operation.
   *
   * @returns
   */
  public onSubmit() {
    if (!this.loginForm) return;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.setErrorMessage();
      return;
    }

    const formData = this.loginForm.value;

    const data: LoginFormInterface = {
      password: formData.password,
    };

    if (this.mustAcceptConditions && formData.acceptedConditions) {
      data.privacy_policy_accepted = formData.acceptedConditions;
      data.terms_of_service_accepted = formData.acceptedConditions;
    }

    const isEmail = new RegExp(RegexEnums.email).test(formData.identifier);
    if (isEmail) {
      data.email = formData.identifier;
    } else {
      data.user_name = formData.identifier;
    }

    this.login(data);
  }

  /**
   * Performs the login operation by calling the login method of the LoginService.
   * It also handles the response and error scenarios, updating the messages and navigation accordingly.
   *
   * @param data
   * @returns
   */
  private login(data: LoginFormInterface) {
    /**
     * Prevent multiple submissions while the login request is being processed.
     */
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    this.loginService
      .login(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          console.log('Login successful:', response);

          this.setMessage('login', 'success', 'LOGIN_SUCCESSFUL');

          this.isProcessing = false;

          setTimeout(() => {
            this.router.navigate(['/my-area']);
          }, 2000);
        },
        error: (error) => {
          const errorResponse: BackendErrorResponseInterface = error.error;
          const businessAction = this.apiErrorHandlingService.handleApiError(errorResponse);
          const hasValidatorKey = businessAction?.messages && businessAction.messages.validatorKey;
          const params = businessAction?.messages?.params || null;

          if (hasValidatorKey) {
            this.setMessage('login', businessAction.messages.messageType, businessAction.messages.validatorKey, params);
          }

          if (businessAction?.mustAcceptConditions) {
            this.handleAcceptConditions();
          }

          this.isProcessing = false;
          return;
        },
      });
  }

  /**
   * Handles the scenario where the user must accept conditions (e.g., privacy policy or terms of service).
   * It sets the mustAcceptConditions flag to true and adds a requiredTrue validator to the acceptedConditions form control, then updates its validity.
   */
  private handleAcceptConditions(): void {
    this.mustAcceptConditions = true;
    this.loginForm?.get('acceptedConditions')?.setValidators(Validators.requiredTrue);
    this.loginForm?.get('acceptedConditions')?.updateValueAndValidity();
    this.loginForm?.get('acceptedConditions')?.markAsUntouched();
  }

  /**
   * Sets a message for a specific field, type, and validator key.
   * It retrieves the translation from the translation service and updates the messages object accordingly.
   *
   * @param field - The field for which the message is being set.
   * @param type - The type of message ('error', 'success', or 'info').
   * @param validatorKey - The key of the validator for which the message is being set.
   * @param params - Optional parameters to be used in the message.
   */
  private setMessage(field: keyof LoginMessagesInterface, type: 'error' | 'success' | 'info', validatorKey: string, params?: ParamsInterface | null): void {
    this.clearMessage(field);
    const path = `Auth.${type}.${field}.${validatorKey}`;
    const message = this.translationService.getTranslation(path, params);
    this.messages[field][type] = message;
  }

  /**
   * Clears the feedback messages for a given BadgeMessagesInterface object by resetting it to the initial state defined in badgeMessagesInit.
   */
  private clearMessage(key: keyof LoginMessagesInterface): void {
    this.messages[key] = { ...badgeMessagesInit };
  }

  /**
   * Handles the change event of the accepted conditions checkbox.
   * It updates the error and success messages based on whether the checkbox is checked or not.
   */
  public checkboxChanged() {
    const isAccepted = this.loginForm?.get('acceptedConditions')?.value;
    if (isAccepted) {
      this.setMessage('acceptedConditions', 'success', 'ACCEPTED_CONDITIONS');
      this.clearMessage('login');
    } else {
      this.setMessage('acceptedConditions', 'error', 'required');
    }
  }

  /**
   * Sets the error messages for the form controls based on the validation errors present in the form.
   * It iterates through the defined fields and checks if there are any errors for each field.
   */
  private setErrorMessage() {
    const errors = this.getFormErrors();
    const fields: (keyof LoginMessagesInterface)[] = ['identifier', 'password', 'acceptedConditions'];

    fields.forEach((field) => {
      if (errors[field]) {
        const validatorKey = Object.keys(errors[field])[0];
        this.setMessage(field, 'error', validatorKey);
      } else {
        this.clearMessage(field);
      }
    });
  }

  /**
   * Retrieves the validation errors from the form controls and returns an object containing the errors for each control.
   * It iterates through the form controls, checks if they are invalid, and if so, adds their errors to the resulting object.
   *
   * @returns
   */
  private getFormErrors() {
    const errors: { [key: string]: LoginFormErrorsInterface } = {};
    Object.entries(this.loginForm?.controls || {}).forEach(([key, control]) => {
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
  public getDuckIcon(): string {
    if (!this.isPasswordFocused) return 'login_normal_duck';

    const length = this.loginForm?.get('password')?.value?.length || 0;

    if (length === 0) return 'login_half_closed_duck_1';
    if (length <= 2) return 'login_half_closed_duck_2';
    return 'login_close_duck';
  }
}
