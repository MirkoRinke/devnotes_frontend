import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from './api.service';

import { ApiEndpointEnums } from '../enums/api-endpoint';
import { AuthStorageService } from './auth-storage.service';

@Injectable({
  providedIn: 'root',
})
export class LogoutService {
  constructor(
    private apiService: ApiService,
    private router: Router,
    private authStorageService: AuthStorageService,
  ) {}

  logout() {
    this.apiService.post(ApiEndpointEnums.LOGOUT).subscribe({
      next: (response) => {
        this.authStorageService.clearLoginData();
        this.router.navigate(['/goodbye']);
      },
      error: (error) => {
        this.authStorageService.clearLoginData();
        this.router.navigate(['/goodbye']);
      },
    });
  }
}
