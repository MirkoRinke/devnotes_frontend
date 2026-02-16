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

  private favoriteUpdateSubject = new BehaviorSubject<Array<string>>([]);
  favoriteUpdate$ = this.favoriteUpdateSubject.asObservable();

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

    const url = `${ApiEndpointEnums.FAVORITE_TECH_STACK}${this.authService.getCurrentUserId()}?${options.params.toString()}`;

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

  /**
   * Adds a new tech to the user's favorite tech stack if it's not already present.
   *
   * @param techName The name of the tech to add to the favorite stack.
   */
  addTechToFavoriteStack(techName: string) {
    const currentStack = this.favoriteTechStackSubject.getValue();
    if (!currentStack.includes(techName)) {
      this.favoriteTechStackSubject.next([...currentStack, techName]);
    }
  }

  /**
   * Removes a tech from the user's favorite tech stack.
   *
   * @param techName The name of the tech to remove from the favorite stack.
   */
  removeTechFromFavoriteStack(techName: string) {
    const currentStack = this.favoriteTechStackSubject.getValue();
    this.favoriteTechStackSubject.next(currentStack.filter((name) => name !== techName));
  }

  /**
   * Updates the user's favorite tech stack by adding or removing a technology.
   * Only on the client side, the actual update to the backend is handled in the TechTile component.
   *
   * @param techName The name of the technology to add or remove from the favorite stack.
   */
  favoriteUpdate(techName: string) {
    const currentStack = this.favoriteUpdateSubject.getValue();
    if (!currentStack.includes(techName)) {
      this.favoriteUpdateSubject.next([...currentStack, techName]);
    } else {
      this.favoriteUpdateSubject.next(currentStack.filter((name) => name !== techName));
    }
  }
}
