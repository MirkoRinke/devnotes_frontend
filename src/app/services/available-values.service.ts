import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type { AvailableValuesInterface } from '../interfaces/available-values';
import type { ApiResponseArrayInterface } from '../interfaces/api-response';

import { ApiEndpointEnums } from '../enums/api-endpoint';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class AvailableValuesService {
  constructor(private apiService: ApiService) {}

  getAvailableValues(params: Array<string>, endPoint: string): Observable<AvailableValuesInterface[]> {
    const requests = params.map((param) => this.apiService.get<ApiResponseArrayInterface<AvailableValuesInterface>>(`${ApiEndpointEnums[endPoint as keyof typeof ApiEndpointEnums]}${param}`));
    return forkJoin(requests).pipe(map((responses) => responses.flatMap((response) => response.data.data)));
  }
}
