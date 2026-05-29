import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import { LoginService } from '../../services/login.service';

import type { LoginFormErrorsInterface, LoginFormInterface } from '../../interfaces/login-form';

import { emailOrUsernameValidator } from '../../utils/custom-validators';
import { RegexEnums } from '../../enums/regex';

import { SvgIconsService } from '../../services/svg.icons.service';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  loginForm: FormGroup | null = null;
  mustAcceptConditions: boolean = true; //TODO true for Testing, false for Production

  messages: { [key: string]: { error?: string | null; info: string | null } } = {
    identifier: { error: null, info: null },
    password: { error: null, info: null },
  };

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    public svgIconsService: SvgIconsService,
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    const acceptedConditionsValidators = this.mustAcceptConditions ? [Validators.requiredTrue] : [];

    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required, emailOrUsernameValidator('login_identifier_invalid'), Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]], //TODO Expand the password validation (e.g., the password must contain uppercase letters, lowercase letters, numbers, and special characters, etc.)
      acceptedConditions: [false, acceptedConditionsValidators],
    });
  }

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
      privacy_policy_accepted: formData.acceptedConditions,
      terms_of_service_accepted: formData.acceptedConditions,
    };

    const isEmail = new RegExp(RegexEnums.email).test(formData.identifier);
    if (isEmail) {
      data.email = formData.identifier;
    } else {
      data.user_name = formData.identifier;
    }

    this.login(data);
  }

  login(data: LoginFormInterface) {
    this.loginService.login(data).subscribe({
      next: (response) => {
        console.log('Login successful:', response);
      },
      error: (error) => {
        console.error('Login failed:', error);
      },
    });
  }

  setErrorMessage() {
    const errors = this.getFormErrors();

    this.messages['identifier']['error'] = null;
    this.messages['password']['error'] = null;

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

    console.log(this.messages);
  }

  getFormErrors() {
    const errors: { [key: string]: LoginFormErrorsInterface } = {};
    Object.entries(this.loginForm?.controls || {}).forEach(([key, control]) => {
      if (control.invalid && control.errors) {
        (errors as any)[key] = control.errors;
      }
    });
    console.log(errors);

    return errors;
  }
}
