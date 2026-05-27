import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';

import type { LoginFormErrorsInterface, LoginFormInterface } from '../../interfaces/login-form';

import { emailOrUsernameValidator } from '../../utils/custom-validators';
import { RegexEnums } from '../../enums/regex';

@Component({
  selector: 'app-login-form',
  imports: [ReactiveFormsModule],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss',
})
export class LoginForm {
  loginForm: FormGroup | null = null;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.createForm();
  }

  createForm() {
    this.loginForm = this.fb.group({
      identifier: ['', [Validators.required, emailOrUsernameValidator('login_identifier_invalid'), Validators.maxLength(255)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(255)]], //TODO Expand the password validation (e.g., the password must contain uppercase letters, lowercase letters, numbers, and special characters, etc.)
    });
  }

  onSubmit() {
    if (this.loginForm?.valid) {
      const formData = this.loginForm.value;

      const data: LoginFormInterface = {
        password: formData.password,

        // For Testing purposes, we set these to true by default.
        privacy_policy_accepted: true,
        terms_of_service_accepted: true,
      };

      const isEmail = new RegExp(RegexEnums.email).test(formData.identifier);
      if (isEmail) {
        data.email = formData.identifier;
      } else {
        data.user_name = formData.identifier;
      }

      console.log('Form submitted with data:', data);
      //TODO Here Call LoginService to perform the login action, e.g.:
    } else {
      const errors = this.getFormErrors();
      console.log('Form is invalid', errors);
      this.loginForm?.markAllAsTouched();
    }
  }

  getFormErrors() {
    const errors: { [key: string]: LoginFormErrorsInterface } = {};
    Object.entries(this.loginForm?.controls || {}).forEach(([key, control]) => {
      if (control.invalid && control.errors) {
        (errors as any)[key] = control.errors;
      }
    });
    return errors;
  }
}
