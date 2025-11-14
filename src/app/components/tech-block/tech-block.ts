import { Component, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';

import { TechTile } from '../tech-tile/tech-tile';

import type { TileInterface } from '../../interfaces/tile';
import type {
  ApiResponseArrayInterface,
  ApiResponseObjektInterface,
} from '../../interfaces/api-response';
import type { UserProfileInterface } from '../../interfaces/user-profile';

import { ApiService } from '../../services/api.service';
import { AuthService } from '../../services/auth-service';
import { ApiEndpointEnums } from '../../enums/api-endpoint';

@Component({
  selector: 'app-tech-block',
  imports: [TechTile],
  templateUrl: './tech-block.html',
  styleUrl: './tech-block.scss',
})
export class TechBlock {
  @Input() heading!: string;
  @Input() endPoint!: string;
  @Input() params!: Array<string>;

  constructor(private apiService: ApiService, private authService: AuthService) {}

  tiles: TileInterface[] = [];
  favoriteTechStack: Array<string> = [];

  ngOnInit() {
    if (!this.params || this.params.length === 0) {
      console.error(`URL input is required for TechBlock component ${this.heading}`);
      return;
    }

    if (!(this.endPoint in ApiEndpointEnums)) {
      console.error(`Invalid endPoint provided to TechBlock component ${this.heading}`);
      return;
    }

    this.getTiles();
    this.getUserFavoriteTechStack();
  }

  getTiles() {
    this.params.forEach((params) => {
      this.apiService
        .get<ApiResponseArrayInterface<TileInterface>>(
          `${ApiEndpointEnums[this.endPoint as keyof typeof ApiEndpointEnums]}${params}`
        )
        .subscribe({
          next: (response) => {
            const newTiles = response.data.data;
            this.tiles = this.tiles.concat(newTiles);
          },
          error: (error) => {
            console.error('Error fetching posts:', error);
          },
        });
    });
  }

  getUserFavoriteTechStack() {
    const options = {
      params: new HttpParams().set('select', 'favorite_languages'),
    };

    const url =
      ApiEndpointEnums.FAVORITE_TECH_STACK +
      this.authService.getCurrentUserId() +
      '?' +
      options.params.toString();

    this.apiService.get<ApiResponseObjektInterface<UserProfileInterface>>(url).subscribe({
      next: (response) => {
        const favoriteLanguages = response.data.data.favorite_languages ?? [];
        this.favoriteTechStack = favoriteLanguages.map((lang) => lang.name);
        console.log('Favorite Tech Stack:', this.favoriteTechStack, this.heading);
      },
      error: (error) => {
        console.error('Error fetching user favorite tiles:', error);
      },
    });
  }
}
