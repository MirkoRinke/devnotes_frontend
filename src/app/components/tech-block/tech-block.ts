import { Component, Input } from '@angular/core';

import { TechTile } from '../tech-tile/tech-tile';

import type { Tile } from '../../interfaces/tile';
import type { ApiResponse } from '../../interfaces/api-response';

import { ApiService } from '../../services/api.service';
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

  constructor(private apiService: ApiService) {}

  tiles: Tile[] = [];

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
  }

  getTiles() {
    this.params.forEach((params) => {
      this.apiService
        .get<ApiResponse<Tile>>(
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
}
