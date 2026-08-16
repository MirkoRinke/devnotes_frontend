import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { RegexEnums } from '../enums/regex';

const EMAIL_RE = new RegExp(RegexEnums.email);
const USERNAME_RE = new RegExp(RegexEnums.username);
const UPPER_RE = new RegExp(RegexEnums.hasUpperCase);
const LOWER_RE = new RegExp(RegexEnums.hasLowerCase);
const NUMBER_RE = new RegExp(RegexEnums.hasNumber);
const SPECIAL_RE = new RegExp(RegexEnums.hasSpecialChar);

/**
 * Checks if a given value is considered to have a meaningful value.
 * Handles arrays, strings (with trimming), and other types.
 * @param value The value to check.
 * @returns True if the value is meaningful, otherwise false.
 */
function hasMeaningfulValue(value: any): boolean {
  if (Array.isArray(value)) {
    return value.length > 0;
  }
  if (typeof value === 'string') {
    return value.trim().length > 0;
  }
  return value !== null && value !== undefined && value !== '';
}

/**
 * Custom validator to ensure that at least one of the specified fields has a value.
 *
 * @param fields
 * @param errorKey
 * @returns
 */
export function atLeastOne(fields: string[], errorKey: string = 'atLeastOneRequired'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasValue = fields.some((fieldName) => hasMeaningfulValue(control.get(fieldName)?.value));

    if (!hasValue) {
      return { [errorKey]: true };
    }

    return null;
  };
}

/**
 * Custom validator to ensure that the target field is required if the source field has a value.
 *
 * @param sourceFieldName The name of the source control to check.
 * @param targetFieldName The name of the target control that becomes required.
 * @param errorKey The error key to return if validation fails. Defaults to 'requiredWith'.
 * @returns A ValidatorFn or null.
 */
export function requiredWith(sourceFieldName: string, targetFieldName: string, errorKey: string = 'requiredWith'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const sourceHasValue = hasMeaningfulValue(control.get(sourceFieldName)?.value);
    const targetHasValue = hasMeaningfulValue(control.get(targetFieldName)?.value);

    if (sourceHasValue && !targetHasValue) {
      return { [errorKey]: true };
    }

    return null;
  };
}

/**
 * Custom validator to check if a value is either a valid email or a valid username.
 *
 * @param errorKey The error key to return if validation fails. Defaults to 'invalidIdentifier'.
 * @returns A ValidatorFn or null.
 */
export function emailOrUsernameValidator(errorKey: string = 'invalidIdentifier'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    if (EMAIL_RE.test(value)) {
      return null;
    }

    return USERNAME_RE.test(value) ? null : { [errorKey]: true };
  };
}

/**
 * Custom validator to check if two fields have mismatched values.
 *
 * @param field1Name
 * @param field2Name
 * @param errorKey
 * @returns
 */
export function mismatchedFieldsValidator(field1Name: string, field2Name: string, errorKey: string = 'fieldsMismatch'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const field1Value = control.get(field1Name)?.value;
    const field2Value = control.get(field2Name)?.value;

    if (field1Value !== field2Value) {
      return { [errorKey]: true };
    }
    return null;
  };
}

/**
 * Custom validator to check the strength of a password.
 *
 * @param errorKey
 * @returns
 */
export function passwordStrengthValidator(errorKey: string = 'weakPassword'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;

    const results = {
      hasUpperCase: UPPER_RE.test(value),
      hasLowerCase: LOWER_RE.test(value),
      hasNumber: NUMBER_RE.test(value),
      hasSpecialChar: SPECIAL_RE.test(value),
    };

    const isValid = Object.values(results).every((val) => val === true);

    return isValid ? null : { [errorKey]: results };
  };
}

/**
 * Custom validator to check if a string contains too much whitespace (two or more consecutive spaces).
 *
 * @param errorKey The error key to return if validation fails. Defaults to 'tooMuchWhitespace'.
 * @returns A ValidatorFn or null.
 */
export function tooMuchWhitespaceValidator(errorKey: string = 'tooMuchWhitespace'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;
    if (!value) return null;
    const hasTooMuchWhitespace = /\s{2,}/.test(value);
    return hasTooMuchWhitespace ? { [errorKey]: true } : null;
  };
}
