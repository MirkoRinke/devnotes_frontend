import { FormGroup, ValidationErrors } from '@angular/forms';
import { BadgeMessagesInterface, MessageHandler } from '../interfaces/validation-messages';

/**
 * Determines the appropriate duck icon to display based on the focus state of the password field and the length of the entered password.
 *
 * @returns The name of the duck icon to display.
 */
export function getDuckIcon(prefix: string, isPasswordFocused: boolean, passwordValue: string | null): string {
  if (!isPasswordFocused) return `${prefix}_normal_duck`;

  const length = passwordValue?.length || 0;

  if (length === 0) return `${prefix}_half_closed_duck_1`;
  if (length <= 2) return `${prefix}_half_closed_duck_2`;
  return `${prefix}_close_duck`;
}

/**
 * Checks if the specified form control is invalid and has been touched.
 *
 * @param controlName The name of the form control to check.
 * @returns True if the control is invalid and has been touched, otherwise false.
 */
export function isInvalid(controlName: string, form: FormGroup | null): boolean {
  const control = form?.get(controlName);
  return control?.invalid && control?.touched ? true : false;
}

/**
 * Retrieves the validation errors from the form controls and returns an object containing the errors for each control.
 * It iterates through the form controls, checks if they are invalid, and if so, adds their errors to the resulting object.
 *
 * @returns An object containing the validation errors for each form control.
 */
export function getFormErrors<T extends ValidationErrors>(form: FormGroup | null): Record<string, T> {
  const errors: Record<string, T> = {};

  Object.entries(form?.controls || {}).forEach(([key, control]) => {
    if (control.invalid && control.errors) {
      errors[key] = control.errors as T;
    }
  });

  return errors;
}

/**
 * Collects all form errors by merging control-level errors with form-level errors.
 * Group-level validator errors are normalised to the same shape as control errors
 * (e.g. { passwordMismatch: true } becomes { passwordMismatch: { passwordMismatch: true } }),
 * so that applyFieldErrorMessages can read the validator key from any entry uniformly.
 *
 * Note: The group-level error key is also used as the message key (e.g. the validator key 'passwordMismatch'
 * must match the 'passwordMismatch' entry in the form's messages and messageKeys).
 *
 * @param form The form group containing the form controls.
 * @param controlErrors The existing control errors to be merged with the form's errors.
 * @returns An object containing all form errors, including both control errors and form-level errors.
 */
export function collectAllFormErrors(form: FormGroup | null, controlErrors: Record<string, ValidationErrors>): Record<string, ValidationErrors> {
  const groupErrors: Record<string, ValidationErrors> = {};

  Object.keys(form?.errors || {}).forEach((errorKey) => {
    groupErrors[errorKey] = { [errorKey]: true };
  });

  return { ...controlErrors, ...groupErrors };
}

/**
 * Applies error messages to the specified fields based on the provided validation errors.
 * It iterates through the message keys, checks if there are corresponding errors, and sets or clears the messages using the provided message handler.
 *
 * @param messageKeys The keys of the form controls for which to apply error messages.
 * @param errors The validation errors for the form controls.
 * @param msg The message handler used to set or clear error messages.
 */
export function applyFieldErrorMessages<K extends string>(messageKeys: readonly K[], errors: Record<string, ValidationErrors>, msg: MessageHandler<K>): void {
  messageKeys.forEach((field) => {
    if (errors[field]) {
      const validatorKey = Object.keys(errors[field])[0];
      msg.setMessage(field, 'error', validatorKey);
    } else {
      msg.clearMessage(field);
    }
  });
}

/**
 * Retrieves the appropriate confirmation error message for a specific form control.
 * It checks if the control is invalid and touched, and if so, returns the corresponding message.
 * If the form has a mismatch error, it returns the message for the mismatch key.
 *
 * @param form The form group containing the form controls.
 * @param controlName The name of the form control to check for errors.
 * @param mismatchKey The key identifying the mismatch error at the form level.
 * @param messages The collection of messages for the form controls.
 * @returns The corresponding BadgeMessagesInterface if an error is found, otherwise null.
 */
export function getConfirmationErrorMessage<M extends { [K in keyof M]: BadgeMessagesInterface }>(
  form: FormGroup | null,
  controlName: Extract<keyof M, string>,
  mismatchKey: Extract<keyof M, string>,
  messages: M,
): BadgeMessagesInterface | null {
  const control = form?.get(controlName);

  if (control?.invalid && control.touched) {
    return messages[controlName];
  }

  return form?.hasError(mismatchKey) ? messages[mismatchKey] : null;
}
