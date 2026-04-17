import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

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
