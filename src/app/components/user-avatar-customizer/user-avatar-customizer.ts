import { Component } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { ApiService } from '../../services/api.service';
import { ApiErrorHandlingService } from '../../services/api-error-handling.service';
import { SvgIconsService } from '../../services/svg.icons.service';

import { UserControlRefreshService } from '../../services/user-control-refresh.service';

import { ApiEndpointEnums } from '../../enums/api-endpoint';

import type { BackendErrorResponseInterface, BusinessActionInterface } from '../../interfaces/error-handling';
import type { ApiResponseObjektInterface } from '../../interfaces/api-response';
import type { UserInterface } from '../../interfaces/user';

@Component({
  selector: 'app-user-avatar-customizer',
  imports: [],
  templateUrl: './user-avatar-customizer.html',
  styleUrl: './user-avatar-customizer.scss',
})

//TODO This is only the MVP Avatar System, before we implement the full Avatar System with items and customization, this is a temporary solution to allow users to select their avatar from a predefined set of avatars.
export class UserAvatarCustomizer {
  user: UserInterface | null = null;
  necessaryUserFields: string = 'display_name,avatar_mvp_id,role';

  currentAvatarID: number = 1;
  availableAvatars: number = 20;

  adminAvatarID: number = 1000;
  moderatorAvatarID: number = 1001;
  systemAvatarID: number = 1002;

  avatarMvpPath: string | null = null;

  isLoading: boolean = true;

  randomizeTimeout: ReturnType<typeof setTimeout> | null = null;
  landOnCorrectAvatar: boolean = false;
  randomizeCount: number = 10;

  constructor(
    private apiService: ApiService,
    public authService: AuthService,
    public userControlRefreshService: UserControlRefreshService,
    private apiErrorHandlingService: ApiErrorHandlingService,
    public svgIconsService: SvgIconsService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.randomizeAvatar();
    this.getUser();
  }

  ngOnDestroy() {
    if (this.randomizeTimeout) clearTimeout(this.randomizeTimeout);
  }

  /**
   * Fetches the current user's data from the API and updates the component's state accordingly.
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
        this.isLoading = false;
        this.user = response.data.data;
        this.landOnCorrectAvatar = true;
        this.setCurrentAvatarID();
        this.mvpAvatarPath();
      },
      error: (error) => {
        this.isLoading = false;
        const errorResponse: BackendErrorResponseInterface = error.error;
        const businessAction: BusinessActionInterface | null = this.apiErrorHandlingService.handleApiError(errorResponse) || null;
        if (businessAction?.messages?.validatorKey === 'UNKNOWN_ERROR') {
          this.router.navigate(['/bad-gateway']);
        }
      },
    });
  }

  /**
   * Sets the current avatar ID based on the user's avatar_mvp_id or defaults to 1 if not set.
   */
  setCurrentAvatarID(): void {
    this.currentAvatarID = this.validAvatarID();
  }

  /**
   * Resets the current avatar ID to the user's original avatar ID (or 1 if not set) and updates the avatar path accordingly.
   */
  public resetAvatar(): void {
    this.currentAvatarID = this.validAvatarID();
    this.mvpAvatarPath();
  }

  /**
   * Get the path for the user's MVP avatar
   *
   * @param user
   */
  mvpAvatarPath(): void {
    this.avatarMvpPath = `/avatar-mvp/mvp_${this.currentAvatarID}.webp`;
  }

  /**
   * Checks if the provided avatar ID is valid based on the defined standard and system avatar IDs.
   *
   * @returns The valid avatar ID, which is either the provided avatar ID if valid, or 1 if invalid.
   */
  validAvatarID(): number {
    const avatarMvpId = this.user?.avatar_mvp_id ?? 1;
    const isStandard = avatarMvpId && avatarMvpId >= 1 && avatarMvpId <= 20;
    const isSystem = avatarMvpId && (avatarMvpId === this.adminAvatarID || avatarMvpId === this.moderatorAvatarID || avatarMvpId === this.systemAvatarID);

    if (isStandard || isSystem) {
      return avatarMvpId;
    } else {
      return 1;
    }
  }

  /**
   * Switches the current avatar ID based on the provided direction ('prev' or 'next') and updates the avatar path accordingly.
   *
   * @param direction
   */
  public switchAvatar(direction: 'prev' | 'next'): void {
    const userRole = this.user?.role || null;
    const current = this.currentAvatarID;
    const isSpecialAvatar = current === this.adminAvatarID || current === this.moderatorAvatarID;

    if (direction === 'next') {
      if (isSpecialAvatar) {
        this.currentAvatarID = 1;
      } else if (current >= this.availableAvatars) {
        if (userRole === 'admin') this.currentAvatarID = this.adminAvatarID;
        else if (userRole === 'moderator') this.currentAvatarID = this.moderatorAvatarID;
        else this.currentAvatarID = 1;
      } else {
        this.currentAvatarID = current + 1;
      }
    } else {
      if (current <= 1) {
        if (userRole === 'admin') this.currentAvatarID = this.adminAvatarID;
        else if (userRole === 'moderator') this.currentAvatarID = this.moderatorAvatarID;
        else this.currentAvatarID = this.availableAvatars;
      } else if (isSpecialAvatar) {
        this.currentAvatarID = this.availableAvatars;
      } else {
        this.currentAvatarID = current - 1;
      }
    }

    this.mvpAvatarPath();
  }

  /**
   * Randomizes the current avatar ID by selecting a random number within the range of available avatars.
   * It ensures that the new avatar ID is different from the current one. The function can be called multiple times
   * in quick succession, with a delay of 100 milliseconds between each call, until a specified count is reached.
   * After reaching the count, it resets the randomization count to its initial value.
   */
  public randomizeAvatar(): void {
    const randomAvatarID = Math.floor(Math.random() * this.availableAvatars) + 1;
    this.currentAvatarID = randomAvatarID != this.currentAvatarID ? randomAvatarID : (randomAvatarID % this.availableAvatars) + 1;
    this.mvpAvatarPath();

    if (this.randomizeCount > 0) {
      this.randomizeCount--;
      this.randomizeTimeout = setTimeout(() => this.randomizeAvatar(), 100);
    } else {
      this.randomizeCount = 10;
      if (this.isLoading) {
        this.randomizeTimeout = setTimeout(() => this.randomizeAvatar(), 100);
      } else if (this.landOnCorrectAvatar) {
        this.landOnCorrectAvatar = false;
        this.currentAvatarID = this.user?.avatar_mvp_id || 1;
        this.mvpAvatarPath();
      }
    }
  }

  /**
   * Saves the currently selected avatar ID for the user by sending a PATCH request to the API.
   * If the current avatar ID or user ID is null, the function returns early. Upon a successful response, it refreshes the user's control state.
   * In case of an error, it handles the error using the ApiErrorHandlingService and navigates to a 'bad-gateway' page if an unknown error occurs.
   *
   * @returns
   */
  public saveAvatar(): void {
    const user_id = this.authService.getCurrentUserId();
    if (user_id === null) return;

    const url = `${ApiEndpointEnums.USER}${user_id}/`;

    const data = {
      avatar_mvp_id: this.currentAvatarID,
    };

    this.apiService.patch<ApiResponseObjektInterface<UserInterface>>(url, data).subscribe({
      next: (response) => {
        if (this.user) {
          const avatarMvpId = response.data.data.avatar_mvp_id;
          this.user.avatar_mvp_id = avatarMvpId;
        }

        this.mvpAvatarPath();
        this.userControlRefreshService.refreshSource$.next();
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
