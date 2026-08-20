import { Component, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { ApiErrorHandlingService } from '../../services/api-error-handling.service';
import { UserControlRefreshService } from '../../services/user-control-refresh.service';

import { ApiEndpointEnums } from '../../enums/api-endpoint';

import type { BackendErrorResponseInterface, BusinessActionInterface } from '../../interfaces/error-handling';
import type { ApiResponseObjektInterface } from '../../interfaces/api-response';
import type { UserInterface } from '../../interfaces/user';
import { ControlUserBadge } from './control-user-badge/control-user-badge';

@Component({
  selector: 'app-user-control-area',
  imports: [ControlUserBadge],
  templateUrl: './user-control-area.html',
  styleUrl: './user-control-area.scss',
})
export class UserControlArea {
  private destroyRef = inject(DestroyRef);

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    private userControlRefreshService: UserControlRefreshService,
    private apiErrorHandlingService: ApiErrorHandlingService,
    private router: Router,
  ) {}

  public user: UserInterface | null = null;
  private readonly necessaryUserFields: string = 'display_name,avatar_items,avatar_mvp_id';

  ngOnInit(): void {
    this.subscribeRefresh();
  }

  /**
   * Subscribes to the `refresh$` observable from the `UserControlRefreshService`. When a refresh event is emitted, it calls the `getUser()` method to fetch the current user's data.
   * The subscription is automatically cleaned up when the component is destroyed, thanks to the `takeUntilDestroyed` operator.
   *
   * @returns
   */
  private subscribeRefresh() {
    this.userControlRefreshService.refresh$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.getUser());
  }

  /**
   * Fetches the current user's data from the API and updates the `user` property.
   * If an error occurs during the API call, it handles the error using the `ApiErrorHandlingService` and navigates to a "bad gateway" page if the error is unknown.
   *
   * @returns
   */
  private getUser(): void {
    const user_id = this.authService.getCurrentUserId();
    if (user_id === null) return;

    const options = {
      params: new HttpParams().set('select', this.necessaryUserFields),
    };

    const url = `${ApiEndpointEnums.USER}${user_id}` + '?' + options.params.toString();

    this.apiService.get<ApiResponseObjektInterface<UserInterface>>(url).subscribe({
      next: (response) => {
        this.user = response.data.data;
      },
      error: (error) => {
        const errorResponse: BackendErrorResponseInterface = error.error;
        const businessAction: BusinessActionInterface | null = this.apiErrorHandlingService.handleApiError(errorResponse) || null;
        if (businessAction?.messages?.validatorKey === 'UNKNOWN_ERROR') {
          this.router.navigate(['/bad-gateway']);
        }
      },
    });
  }
}
