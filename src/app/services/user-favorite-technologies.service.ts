import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import type { ApiResponseObjektInterface } from '../interfaces/api-response';
import type { UserProfileInterface } from '../interfaces/user-profile';

import { ApiEndpointEnums } from '../enums/api-endpoint';

import { ApiService } from './api.service';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class UserFavoriteTechnologiesService {
  private favoriteTechStackSubject = new BehaviorSubject<Array<string>>([]);
  favoriteTechStack$ = this.favoriteTechStackSubject.asObservable();
  private loaded = false;

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
  ) {}

  loadFavoriteTechStack() {
    if (this.loaded || !this.authService.isLoggedIn()) {
      return;
    }

    this.loaded = true;

    const options = {
      params: new HttpParams().set('select', 'favorite_techs'),
    };

    const url = ApiEndpointEnums.FAVORITE_TECH_STACK + this.authService.getCurrentUserId() + '?' + options;

    this.apiService.get<ApiResponseObjektInterface<UserProfileInterface>>(url).subscribe({
      next: (response) => {
        const favoriteTechs = response.data.data.favorite_techs ?? [];
        const stack = favoriteTechs.map((tech) => tech.name);
        this.favoriteTechStackSubject.next(stack);
        this.loaded = false;
      },
      error: (error) => {
        console.error('Error fetching user favorite tech stack:', error);
        this.loaded = false;
      },
    });
  }
}
