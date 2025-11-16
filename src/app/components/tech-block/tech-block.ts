import { Component, Input } from '@angular/core';

import { TechTile } from '../tech-tile/tech-tile';

import type { TileInterface } from '../../interfaces/tile';
import type { ApiResponseArrayInterface } from '../../interfaces/api-response';

import { ApiEndpointEnums } from '../../enums/api-endpoint';

import { ApiService } from '../../services/api.service';
import { UserFavoriteTechStackService } from '../../services/user-favorite-tech-stack.service';

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

  constructor(
    private apiService: ApiService,
    private userFavoriteTechStackService: UserFavoriteTechStackService
  ) {}

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
    this.userFavoriteTechStackService.favoriteTechStack$.subscribe((stack) => {
      this.favoriteTechStack = stack;
    });
    this.userFavoriteTechStackService.loadFavoriteTechStack();
  }
}
