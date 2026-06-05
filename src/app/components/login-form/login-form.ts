import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

import { LoginService } from '../../services/login.service';

import type { LoginFormErrorsInterface, LoginFormInterface } from '../../interfaces/login-form';

import { emailOrUsernameValidator } from '../../utils/custom-validators';
import { RegexEnums } from '../../enums/regex';

import { SvgIconsService } from '../../services/svg.icons.service';
import { Badge } from '../badge/badge';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule, Badge],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  loginForm: FormGroup | null = null;
  mustAcceptConditions: boolean = false;

  messages: { [key: string]: { error?: string | null; info: string | null; success?: string | null } } = {
    identifier: { error: null, info: null, success: null },
    password: { error: null, info: null, success: null },
    acceptedConditions: { error: null, info: null, success: null },
    login: { error: null, info: null, success: null },
  };

  constructor(
    private fb: FormBuilder,
    private loginService: LoginService,
    private router: Router,
    public svgIconsService: SvgIconsService,
  ) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    const acceptedConditionsValidators = this.mustAcceptConditions ? [Validators.requiredTrue] : [];

    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required, emailOrUsernameValidator('login_identifier_invalid'), Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
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

        this.messages['login']['success'] = 'Login erfolgreich. Weiterleitung...';
        this.messages['login']['error'] = null;
        this.messages['login']['info'] = null;

        setTimeout(() => {
          this.router.navigate(['/my-area']);
        }, 2000);
      },
      error: (error) => {
        const errorResponse = error.error;
        const errors = errorResponse.errors;

        if (errorResponse?.code === 422 && (errors['privacy_policy_accepted'] || errors['terms_of_service_accepted'])) {
          this.messages['login']['info'] = 'Es gab neue Nutzungsbedingungen | Datenschutzrichtlinie';
          this.mustAcceptConditions = true;
          this.loginForm?.get('acceptedConditions')?.setValidators(Validators.requiredTrue);
          this.loginForm?.get('acceptedConditions')?.updateValueAndValidity();
          return;
        }

        this.messages['login']['error'] = 'Es ist ein Fehler aufgetreten. Bitte erneut versuchen.';

        console.log(this.messages);
      },
    });
  }

  public setMessageClass(field: string): string {
    if (this.messages[field]['error']) {
      return 'ng-invalid ng-touched';
    } else if (this.messages[field]['info']) {
      return 'dev-info';
    } else if (this.messages[field]['success']) {
      return 'dev-success';
    }
    return 'ng-valid';
  }

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
