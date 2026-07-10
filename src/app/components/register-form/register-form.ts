import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { RegisterService } from '../../services/register.service';

import { passwordConfirmationValidator, passwordStrengthValidator, toMuchWhitespaceValidator } from '../../utils/custom-validators';

import { ApiErrorHandlingService } from '../../services/api-error-handling.service';
import { TranslationService } from '../../i18n/translation.service';
import { RegistrationAvailabilityService } from '../../services/registration-availability.service';
import { RegexEnums } from '../../enums/regex';

import { BadgeMessageHandler } from '../../utils/badge-message-handler';

import type { RegisterFormErrorsInterface, RegisterMessagesInterface, RegisterFormInterface, RegistrationAvailabilityResponseInterface } from '../../interfaces/register-form';
import type { BackendErrorResponseInterface, BusinessActionInterface, ParamsInterface } from '../../interfaces/error-handling';
import type { BadgeMessagesInterface } from '../../interfaces/validation-messages';
import { badgeMessagesInit } from '../../interfaces/validation-messages';

import { SvgIconsService } from '../../services/svg.icons.service';
import { Badge } from '../badge/badge';

import { catchError, debounceTime, distinctUntilChanged, of, switchMap, tap } from 'rxjs';
import { PasswordToggleButton } from '../password-toggle-button/password-toggle-button';
import { PasswordStrengthFeedback } from '../password-strength-feedback/password-strength-feedback';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, RouterModule, Badge, PasswordToggleButton, PasswordStrengthFeedback],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss',
})
export class RegisterForm {
  registerForm: FormGroup | null = null;

  messages: RegisterMessagesInterface = {
    email: { ...badgeMessagesInit },
    name: { ...badgeMessagesInit },
    display_name: { ...badgeMessagesInit },
    password: { ...badgeMessagesInit },
    password_confirmation: { ...badgeMessagesInit },
    acceptedConditions: { ...badgeMessagesInit },
    register: { ...badgeMessagesInit },
    passwordMismatch: { ...badgeMessagesInit },
  };

  private messageKeys: (keyof RegisterMessagesInterface)[] = ['email', 'name', 'display_name', 'password', 'password_confirmation', 'acceptedConditions'];

  isProcessing: boolean = false;
  registerSuccessful: boolean = false;

  isPasswordFocused: boolean = false;
  isPasswordVisible: boolean = false;

  private destroyRef = inject(DestroyRef);

  private msg = new BadgeMessageHandler<RegisterMessagesInterface>(this.messages, 'Auth', inject(TranslationService));

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    public svgIconsService: SvgIconsService,
    private apiErrorHandlingService: ApiErrorHandlingService,
    private registrationAvailabilityService: RegistrationAvailabilityService,
  ) {}

  ngOnInit() {
    this.createForm();
  }

  /**
   * Initializes the register form with form controls and their respective validators.
   * The form controls include email, name, display_name, password, password_confirmation, and acceptedConditions.
   */
  private createForm() {
    this.registerForm = this.fb.group(
      {
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40), Validators.pattern(RegexEnums.username), toMuchWhitespaceValidator('tooMuchWhitespace')]],
        display_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(40), Validators.pattern(RegexEnums.username), toMuchWhitespaceValidator('tooMuchWhitespace')]],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255), passwordStrengthValidator('weakPassword')]],
        password_confirmation: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
        acceptedConditions: [false, [Validators.requiredTrue]],
      },
      {
        validators: passwordConfirmationValidator('password', 'password_confirmation', 'passwordMismatch'),
      },
    );

    this.initAvailabilityCheck();
    this.initLiveFeedback();
  }

  /**
   * Initializes the availability check for specific form controls by subscribing to their value changes.
   * It checks the availability of the entered values and updates the form control's error state accordingly.
   * This provides real-time feedback to the user regarding the availability of their chosen name and display name.
   */
  private initAvailabilityCheck() {
    const fields: (keyof RegistrationAvailabilityResponseInterface)[] = ['name', 'display_name'];

    fields.forEach((controlName) => {
      console.log(`Initializing availability check for control: ${controlName}`);

      const formControl: AbstractControl | null = this.registerForm?.get(controlName) || null;
      if (!formControl) return;
      this.createAvailabilityStream(formControl, controlName).pipe(takeUntilDestroyed(this.destroyRef)).subscribe();
    });
  }

  /**
   * Creates an observable stream that listens for value changes on the specified form control.
   * It checks the availability of the value and updates the form control's error state accordingly.
   *
   * @param formControl The form control to listen for value changes.
   * @param controlName The name of the control to check availability for.
   * @returns An observable stream that emits availability check results.
   */
  private createAvailabilityStream(formControl: AbstractControl, controlName: keyof RegistrationAvailabilityResponseInterface) {
    return formControl.valueChanges.pipe(
      debounceTime(500),
      distinctUntilChanged(),
      switchMap((value) => {
        if (formControl.valid && value && value.trim() !== '' && value.length >= 2) {
          return this.registrationAvailabilityService.checkRegistrationAvailability(formControl, value, controlName).pipe(
            tap((response) => {
              const data: RegistrationAvailabilityResponseInterface | null = response?.data?.data || null;
              if (!data) return;

              if (data && data[controlName] && data[controlName].includes(`${controlName.toUpperCase()}_ALREADY_IN_USE`)) {
                this.registrationAvailabilityService.setRegistrationError(formControl);
                this.msg.setMessage('register', 'info', `${controlName.toUpperCase()}_ALREADY_IN_USE`, { name: value });
              } else {
                this.registrationAvailabilityService.clearRegistrationError(formControl);
                this.msg.setMessage('register', 'success', `${controlName.toUpperCase()}_AVAILABLE`, { name: value });
              }
            }),
            catchError((error) => {
              const errorResponse: BackendErrorResponseInterface = error.error;
              const businessAction = this.apiErrorHandlingService.handleApiError(errorResponse);

              if (businessAction) {
                if (businessAction.messages.validatorKey === 'FORBIDDEN_NAME' || businessAction.messages.validatorKey === 'FORBIDDEN_DISPLAY_NAME') {
                  this.msg.setMessage('register', businessAction.messages.messageType, businessAction.messages.validatorKey, { name: value });
                } else {
                  this.msg.setMessage('register', businessAction.messages.messageType, businessAction.messages.validatorKey, businessAction.messages.params);
                }
              }
              return of(null);
            }),
          );
        }
        this.registrationAvailabilityService.clearRegistrationError(formControl);

        if (formControl.hasError('registrationUnavailable')) {
          this.msg.clearMessage('register');
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
    const fieldConfigs: { control: string; field: keyof RegisterMessagesInterface; type: keyof BadgeMessagesInterface; errorKey: string }[] = [
      { control: 'name', field: 'register', type: 'info', errorKey: 'tooMuchWhitespace' },
      { control: 'display_name', field: 'register', type: 'info', errorKey: 'tooMuchWhitespace' },
      { control: 'name', field: 'name', type: 'error', errorKey: 'tooMuchWhitespace' },
      { control: 'display_name', field: 'display_name', type: 'error', errorKey: 'tooMuchWhitespace' },
      { control: 'password', field: 'password', type: 'error', errorKey: 'minlength' },
      { control: 'password', field: 'password', type: 'error', errorKey: 'weakPassword' },
    ];

    fieldConfigs.forEach(({ control, field, type, errorKey }) => {
      const formControl = this.registerForm?.get(control);
      if (!formControl) return;

      formControl.valueChanges.pipe(debounceTime(200), takeUntilDestroyed(this.destroyRef)).subscribe(() => {
        if (formControl.hasError(errorKey)) {
          if (control === 'name' || control === 'display_name') {
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
   * If the form is valid, it constructs a RegisterFormInterface object based on the form values and calls the register method to perform the registration operation.
   *
   * @returns
   */
  public onSubmit() {
    if (!this.registerForm) return;

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      this.setErrorMessage();
      return;
    }

    const formData = this.registerForm.value;

    const data: RegisterFormInterface = {
      name: formData.name,
      display_name: formData.display_name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
      privacy_policy_accepted: formData.acceptedConditions,
      terms_of_service_accepted: formData.acceptedConditions,
    };

    this.register(data);
  }

  /**
   * Performs the registration operation by calling the register method of the RegisterService.
   * It also handles the response and error scenarios, updating the messages and navigation accordingly.
   *
   * @param data
   * @returns
   */
  private register(data: RegisterFormInterface) {
    /**
     * Prevent multiple submissions while the registration request is being processed.
     */
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    this.registerService
      .register(data)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.msg.setMessage('register', 'success', 'REGISTER_SUCCESSFUL');
          this.registerSuccessful = true;
          this.isProcessing = false;

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 2000);
        },
        error: (error) => {
          const errorResponse: BackendErrorResponseInterface = error.error;

          const businessAction: BusinessActionInterface | null = this.apiErrorHandlingService.handleApiError(errorResponse) || null;
          const params: ParamsInterface | null = businessAction?.messages?.params || null;

          if (businessAction) {
            this.msg.setMessage('register', businessAction.messages.messageType, businessAction.messages.validatorKey, params);
          } else {
            this.msg.setMessage('register', 'error', 'UNKNOWN_ERROR');
          }

          this.isProcessing = false;
          return;
        },
      });
  }

  /**
   * Handles the change event of the accepted conditions checkbox.
   * It updates the error and success messages based on whether the checkbox is checked or not.
   */
  public checkboxChanged() {
    const isAccepted = this.registerForm?.get('acceptedConditions')?.value;
    if (isAccepted) {
      this.msg.setMessage('acceptedConditions', 'success', 'ACCEPTED_CONDITIONS');
      this.msg.clearMessage('register');
    } else {
      this.msg.setMessage('acceptedConditions', 'error', 'required');
    }
  }

  /**
   * Sets the error messages for the form controls based on the validation errors present in the form.
   * It iterates through the defined fields and checks if there are any errors for each field.
   */
  private setErrorMessage() {
    const controlErrors = this.getFormErrors();
    const formErrors = this.registerForm?.errors || {};
    const allErrors = { ...controlErrors, ...formErrors };

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
  }

  /**
   * Retrieves the validation errors from the form controls and returns an object containing the errors for each control.
   * It iterates through the form controls, checks if they are invalid, and if so, adds their errors to the resulting object.
   *
   * @returns
   */
  private getFormErrors() {
    const errors: { [key: string]: RegisterFormErrorsInterface } = {};
    Object.entries(this.registerForm?.controls || {}).forEach(([key, control]) => {
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
    if (!this.isPasswordFocused) return 'register_normal_duck';

    const length = this.registerForm?.get('password')?.value?.length || 0;

    if (length === 0) return 'register_half_closed_duck_1';
    if (length <= 2) return 'register_half_closed_duck_2';
    return 'register_close_duck';
  }

  /**
   * Retrieves the appropriate error message for the password confirmation field based on its validation state.
   */
  get passwordConfirmationErrorMessage() {
    const control = this.registerForm?.get('password_confirmation');

    if (control?.invalid && control?.touched) {
      return this.messages['password_confirmation'];
    }

    if (this.registerForm?.hasError('passwordMismatch')) {
      return this.messages['passwordMismatch'];
    }

    return null;
  }
}
