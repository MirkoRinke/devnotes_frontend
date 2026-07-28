import { ValidatorFn, Validators } from '@angular/forms';
import { emailOrUsernameValidator, passwordStrengthValidator, toMuchWhitespaceValidator } from '../utils/custom-validators';
import { RegexEnums } from '../enums/regex';

export const AUTH_FORMS_CONFIG = {
  name: (): [string, ValidatorFn[]] => [
    '',
    [Validators.required, Validators.minLength(2), Validators.maxLength(40), Validators.pattern(RegexEnums.username), toMuchWhitespaceValidator('tooMuchWhitespace')],
  ],
  display_name: (): [string, ValidatorFn[]] => [
    '',
    [Validators.required, Validators.minLength(2), Validators.maxLength(40), Validators.pattern(RegexEnums.username), toMuchWhitespaceValidator('tooMuchWhitespace')],
  ],
  email: (): [string, ValidatorFn[]] => ['', [Validators.required, Validators.email, Validators.maxLength(255)]],
  registerPassword: (): [string, ValidatorFn[]] => ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255), passwordStrengthValidator('weakPassword')]],
  registerPassword_confirmation: (): [string, ValidatorFn[]] => ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
  identifier: (): [string, ValidatorFn[]] => ['', [Validators.required, emailOrUsernameValidator('auth_identifier_invalid'), Validators.maxLength(255)]],
  loginPassword: (): [string, ValidatorFn[]] => ['', [Validators.required, Validators.minLength(8), Validators.maxLength(255)]],
  acceptedConditions: (): [boolean, ValidatorFn[]] => [false, [Validators.requiredTrue]],
};
