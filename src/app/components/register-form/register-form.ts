import { Component, Input, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

import { RegisterService } from '../../services/register.service';

import { passwordConfirmationValidator } from '../../utils/custom-validators';

import { ApiErrorHandlingService } from '../../services/api-error-handling.service';
import { TranslationService } from '../../i18n/translation.service';

import { BadgeMessageHandler } from '../../utils/badge-message-handler';

import type { RegisterFormErrorsInterface, RegisterMessagesInterface, RegisterFormInterface } from '../../interfaces/register-form';
import type { BackendErrorResponseInterface, BusinessActionInterface, ParamsInterface } from '../../interfaces/error-handling';
import { badgeMessagesInit } from '../../interfaces/validation-messages';

import { SvgIconsService } from '../../services/svg.icons.service';
import { Badge } from '../badge/badge';

@Component({
  selector: 'app-register-form',
  imports: [ReactiveFormsModule, RouterModule, Badge],
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

  isProcessing = false;
  registerSuccessful = false;

  isPasswordFocused = false;

  private destroyRef = inject(DestroyRef);

  private msg = new BadgeMessageHandler<RegisterMessagesInterface>(this.messages, 'Register', inject(TranslationService));

  constructor(
    private fb: FormBuilder,
    private registerService: RegisterService,
    private router: Router,
    public svgIconsService: SvgIconsService,
    private apiErrorHandlingService: ApiErrorHandlingService,
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
        name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255), Validators.pattern(/[^@]+/)]],
        display_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(255)]],
        email: ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
        password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
        password_confirmation: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
        acceptedConditions: [false, [Validators.requiredTrue]],
      },
      {
        validators: passwordConfirmationValidator('password', 'password_confirmation', 'passwordMismatch'),
      },
    );
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
      console.log(this.messages);
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
          console.log('Registration successful:', response);

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
            console.log('Business action received:', businessAction);

            this.msg.setMessage('register', businessAction.messages.messageType, businessAction.messages.validatorKey, params);
          } else {
            this.msg.setMessage('register', 'error', 'UNKNOWN_ERROR');
          }

          console.log('Registration failed:', errorResponse);

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
    const fields: (keyof RegisterMessagesInterface)[] = ['email', 'name', 'display_name', 'password', 'password_confirmation', 'acceptedConditions', 'passwordMismatch'];
    const allErrors = { ...controlErrors, ...formErrors };

    fields.forEach((field) => {
      if (allErrors[field]) {
        const validatorKey = Object.keys(allErrors[field])[0];
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
}
