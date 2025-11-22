import { Injectable } from '@angular/core';
import { forkJoin, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import type { TileInterface } from '../interfaces/tile';
import type { ApiResponseArrayInterface } from '../interfaces/api-response';

import { ApiEndpointEnums } from '../enums/api-endpoint';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UsedTechnologiesService {
  constructor(private apiService: ApiService) {}

  getUsedTechnologies(params: Array<string>, endPoint: string): Observable<TileInterface[]> {
    const requests = params.map((param) =>
      this.apiService.get<ApiResponseArrayInterface<TileInterface>>(
        `${ApiEndpointEnums[endPoint as keyof typeof ApiEndpointEnums]}${param}`
      )
    );
    return forkJoin(requests).pipe(
      map((responses) => responses.flatMap((response) => response.data.data))
    );
  }
}
