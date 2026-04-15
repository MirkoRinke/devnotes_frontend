import { Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';

import type { AvailableValuesInterface } from '../interfaces/available-values';
import type { ApiResponseArrayInterface } from '../interfaces/api-response';

import { ApiEndpointEnums } from '../enums/api-endpoint';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AvailableValuesService {
  constructor(private apiService: ApiService) {}

  /**
   * Get available values from multiple endpoints as a single observable
   *
   * @param params e.g., ['?select=count:languages.name']" or ['?select=count:languages.name', '?select=count:technologies.name']
   * @param endPoint e.g., /posts/ or /user-profiles/
   * @returns Observable of AvailableValuesInterface array
   */
  getAvailableValues(params: Array<string>, endPoint: string): Observable<AvailableValuesInterface[]> {
    const requests = params.map((param) => this.apiService.get<ApiResponseArrayInterface<AvailableValuesInterface>>(`${ApiEndpointEnums[endPoint as keyof typeof ApiEndpointEnums]}${param}`));
    return forkJoin(requests).pipe(
      map((responses) => responses.flatMap((response) => response.data.data)),
      tap((data) => {
        // console.log('Successfully retrieved values:', data);
      }),
      catchError((error) => {
        console.error('Error fetching available values');
        return of([]);
      }),
    );
  }
}
