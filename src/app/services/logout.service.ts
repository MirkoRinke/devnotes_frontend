import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from './api.service';

import { ApiEndpointEnums } from '../enums/api-endpoint';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  constructor(
    private apiService: ApiService,
    private router: Router,
  ) {}

  logout() {
    this.apiService.post(ApiEndpointEnums.LOGOUT).subscribe({
      next: (response) => {
        this.clearLoginData();
        this.router.navigate(['/goodbye']);
      },
      error: (error) => {
        this.clearLoginData();
        this.router.navigate(['/goodbye']);
      },
    });
  }

  /**
   * Clears the login data (access token and user ID) from local storage, effectively logging the user out.
   */
  clearLoginData() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user_id');
  }
}
