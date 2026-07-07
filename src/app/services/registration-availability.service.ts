import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

import { ApiEndpointEnums } from '../enums/api-endpoint';

import type { ApiResponseObjektInterface } from '../interfaces/api-response';
import type { RegistrationAvailabilityResponseInterface } from '../interfaces/register-form';

import { tap } from 'rxjs';
import { AbstractControl } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class RegistrationAvailabilityService {
  constructor(private apiService: ApiService) {}

  /**
   * Checks the availability of a registration field.
   * 
   * @param control The form control to check.
   * @param value The value to check for availability.
   * @param controlName The name of the control to check.
   * @returns An observable of the API response.

   */
  public checkRegistrationAvailability(control: AbstractControl, value: string, controlName: keyof RegistrationAvailabilityResponseInterface) {
    const data = { [controlName]: value };
    const url = ApiEndpointEnums.CHECK_REGISTRATION_AVAILABILITY;

    return this.apiService.post<ApiResponseObjektInterface<RegistrationAvailabilityResponseInterface>>(url, data).pipe(
      tap(() => {
        this.clearRegistrationError(control);
      }),
    );
  }

  /**
   * Clears the registration error from the form control if it exists.
   *
   * @param control The form control to clear the error from.
   */
  public clearRegistrationError(control: AbstractControl) {
    const errors = control?.errors;
    if (errors && errors['registrationUnavailable']) {
      delete errors['registrationUnavailable'];
      control?.setErrors(Object.keys(errors).length ? errors : null);
    }
  }

  /**
   * Sets the registration error on the form control.
   *
   * @param control
   */
  public setRegistrationError(control: AbstractControl) {
    const errors = control?.errors || {};
    control?.setErrors({ ...errors, registrationUnavailable: true });
  }
}
