import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Custom validator to ensure that at least one of the specified fields has a value.
 *
 * @param fields
 * @param errorKey
 * @returns
 */
export function atLeastOne(fields: string[], errorKey: string = 'atLeastOneRequired'): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const hasValue = fields.some((fieldName) => {
      const value = control.get(fieldName)?.value;

      if (Array.isArray(value)) {
        return value.length > 0;
      }

      return value !== null && value !== undefined && value !== '';
    });

    return hasValue ? null : { [errorKey]: true };
  };
}
