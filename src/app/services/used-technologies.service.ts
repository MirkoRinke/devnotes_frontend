import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import type { TileInterface } from '../interfaces/tile';
import type { ApiResponseArrayInterface } from '../interfaces/api-response';

import { ApiEndpointEnums } from '../enums/api-endpoint';

import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class UsedTechnologiesService {
  private usedTechnologiesSubject = new BehaviorSubject<TileInterface[]>([]);
  usedTechnologies$ = this.usedTechnologiesSubject.asObservable();

  constructor(private apiService: ApiService) {}

  getUsedTechnologies(params: Array<string>, endPoint: string) {
    params.forEach((param) => {
      this.apiService
        .get<ApiResponseArrayInterface<TileInterface>>(
          `${ApiEndpointEnums[endPoint as keyof typeof ApiEndpointEnums]}${params}`
        )
        .subscribe({
          next: (response) => {
            const newTiles = response.data.data;
            this.usedTechnologiesSubject.next(this.usedTechnologiesSubject.value.concat(newTiles));
          },
          error: (error) => {
            console.error('Error fetching posts:', error);
          },
        });
    });
  }
}
