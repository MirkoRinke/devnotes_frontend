import { Component, Input, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { LoginService } from '../../services/login.service';
import { ApiErrorHandlingService } from '../../services/api-error-handling.service';

import type { LoginFormErrorsInterface, LoginFormInterface, LoginMessagesInterface } from '../../interfaces/login-form';
import type { BackendErrorResponseInterface } from '../../interfaces/error-handling';

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
    identifier: { error: null, info: null, success: null },
    password: { error: null, info: null, success: null },
    acceptedConditions: { error: null, info: null, success: null },
    login: { error: null, info: null, success: null },
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
  createForm() {
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
  onSubmit() {
    if (!this.loginForm) return;

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      this.getFormErrors();
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
  login(data: LoginFormInterface) {
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

          this.messages['login']['success'] = 'Login erfolgreich. Weiterleitung...';
          this.messages['login']['error'] = null;
          this.messages['login']['info'] = null;
          this.isProcessing = false;

          setTimeout(() => {
            this.router.navigate(['/my-area']);
          }, 2000);
        },
        error: (error) => {
          const errorResponse: BackendErrorResponseInterface = error.error;
          const businessAction = this.apiErrorHandlingService.handleApiError(errorResponse);
          const hasMessages = businessAction?.messages && businessAction.messages.messageType;

          if (hasMessages) {
            this.messages['login'][businessAction.messages.messageType] = businessAction.messages.message;
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
  handleAcceptConditions(): void {
    this.mustAcceptConditions = true;
    this.loginForm?.get('acceptedConditions')?.setValidators(Validators.requiredTrue);
    this.loginForm?.get('acceptedConditions')?.updateValueAndValidity();
    this.loginForm?.get('acceptedConditions')?.markAsUntouched();
  }

  /**
   * Handles the change event of the accepted conditions checkbox.
   * It updates the error and success messages based on whether the checkbox is checked or not.
   */
  checkboxChanged() {
    if (this.loginForm?.get('acceptedConditions')?.value) {
      this.messages['acceptedConditions']['error'] = null;
      this.messages['acceptedConditions']['success'] = 'Nutzungsbedingungen & Datenschutzrichtlinie akzeptiert.';
      this.messages['login']['info'] = null;
    } else {
      this.messages['acceptedConditions']['error'] = 'Bitte Nutzungsbedingungen & Datenschutzrichtlinie akzeptieren.';
      this.messages['acceptedConditions']['success'] = null;
    }
  }

  /**
   * Sets the error messages for the form fields based on the validation errors present in the form controls.
   */
  setErrorMessage() {
    const errors = this.getFormErrors();
    this.messages['identifier']['error'] = null;
    this.messages['password']['error'] = null;
    this.messages['acceptedConditions']['error'] = null;

    if (errors['identifier']) {
      if (errors['identifier']['required']) {
        this.messages['identifier']['error'] = 'E-Mail-Adresse / Benutzernamen eingeben.';
      } else if (errors['identifier']['login_identifier_invalid']) {
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

    if (errors['acceptedConditions']) {
      if (errors['acceptedConditions']['required']) {
        this.messages['acceptedConditions']['error'] = 'Bitte Nutzungsbedingungen & Datenschutzrichtlinie akzeptieren.';
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
    const errors: { [key: string]: LoginFormErrorsInterface } = {};
    Object.entries(this.loginForm?.controls || {}).forEach(([key, control]) => {
      if (control.invalid && control.errors) {
        (errors as any)[key] = control.errors;
      }
    });
    return errors;
  }

  getDuckIcon(): string {
    if (!this.isPasswordFocused) return 'login_normal_duck';

    const length = this.loginForm?.get('password')?.value?.length || 0;

    if (length === 0) return 'login_half_closed_duck_1';
    if (length <= 2) return 'login_half_closed_duck_2';
    return 'login_close_duck';
  }
}
