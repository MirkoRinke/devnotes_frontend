import { Component, Input } from '@angular/core';

import { TechTile } from '../tech-tile/tech-tile';

import type { Tile } from '../../interfaces/tile';
import type { ApiResponse } from '../../interfaces/api-response';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-tech-block',
  imports: [TechTile],
  templateUrl: './tech-block.html',
  styleUrl: './tech-block.scss',
})
export class TechBlock {
  @Input() heading!: string;
  @Input() urls!: Array<string>;

  constructor(private apiService: ApiService) {}

  tiles: Tile[] = [];

  ngOnInit() {
    if (!this.urls || this.urls.length === 0) {
      console.error('URL input is required for TechBlock component.');
      return;
    }
    this.getTiles();
  }

  getTiles() {
    this.urls.forEach((url) => {
      this.apiService.get<ApiResponse<Tile>>(url).subscribe({
        next: (response) => {
          this.tiles = this.tiles.concat(response.data.data);
        },
        error: (error) => {
          console.error('Error fetching posts:', error);
        },
      });
    });
  }
}
