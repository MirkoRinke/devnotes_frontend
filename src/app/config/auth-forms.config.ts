import { ValidatorFn, Validators } from '@angular/forms';
import { emailOrUsernameValidator, passwordStrengthValidator, toMuchWhitespaceValidator } from '../utils/custom-validators';
import { RegexEnums } from '../enums/regex';

export const AUTH_FORMS_CONFIG = {
  name: (defaultValue: string = '', required: boolean = true): [string, ValidatorFn[]] => [
    defaultValue,
    [...(required ? [Validators.required] : []), Validators.minLength(2), Validators.maxLength(40), Validators.pattern(RegexEnums.username), toMuchWhitespaceValidator('tooMuchWhitespace')],
  ],
  display_name: (defaultValue: string = '', required: boolean = true): [string, ValidatorFn[]] => [
    defaultValue,
    [...(required ? [Validators.required] : []), Validators.minLength(2), Validators.maxLength(40), Validators.pattern(RegexEnums.username), toMuchWhitespaceValidator('tooMuchWhitespace')],
  ],
  email: (defaultValue: string = '', required: boolean = true): [string, ValidatorFn[]] => [defaultValue, [...(required ? [Validators.required] : []), Validators.email, Validators.maxLength(255)]],
  registerPassword: (defaultValue: string = '', required: boolean = true): [string, ValidatorFn[]] => [
    defaultValue,
    [...(required ? [Validators.required] : []), Validators.minLength(8), Validators.maxLength(255), passwordStrengthValidator('weakPassword')],
  ],
  registerPassword_confirmation: (defaultValue: string = '', required: boolean = true): [string, ValidatorFn[]] => [
    defaultValue,
    [...(required ? [Validators.required] : []), Validators.minLength(8), Validators.maxLength(255)],
  ],
  identifier: (defaultValue: string = '', required: boolean = true): [string, ValidatorFn[]] => [
    defaultValue,
    [...(required ? [Validators.required] : []), emailOrUsernameValidator('auth_identifier_invalid'), Validators.maxLength(255)],
  ],
  loginPassword: (defaultValue: string = '', required: boolean = true): [string, ValidatorFn[]] => [
    defaultValue,
    [...(required ? [Validators.required] : []), Validators.minLength(8), Validators.maxLength(255)],
  ],
  acceptedConditions: (defaultValue: boolean = false, required: boolean = true): [boolean, ValidatorFn[]] => [defaultValue, [...(required ? [Validators.requiredTrue] : [])]],
};
