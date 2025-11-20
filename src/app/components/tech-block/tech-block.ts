import { Component, Input } from '@angular/core';

import { TechTile } from '../tech-tile/tech-tile';

import type { TileInterface } from '../../interfaces/tile';

import { ApiEndpointEnums } from '../../enums/api-endpoint';

import { UserFavoriteTechnologiesService } from '../../services/user-favorite-technologies.service';
import { UsedTechnologiesService } from '../../services/used-technologies.service';

@Component({
  selector: 'app-tech-block',
  imports: [TechTile],
  templateUrl: './tech-block.html',
  styleUrl: './tech-block.scss',
  providers: [UsedTechnologiesService],
})
export class TechBlock {
  @Input() heading!: string;
  @Input() endPoint!: string;
  @Input() params!: Array<string>;

  constructor(
    private userFavoriteTechnologiesService: UserFavoriteTechnologiesService,
    private usedTechnologiesService: UsedTechnologiesService
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

    this.getUsedTechnologies();
    this.getUserFavoriteTechStack();
  }

  getUsedTechnologies() {
    this.usedTechnologiesService.getUsedTechnologies(this.params, this.endPoint);
    this.usedTechnologiesService.usedTechnologies$.subscribe((tiles) => {
      this.tiles = tiles;
    });
  }

  getUserFavoriteTechStack() {
    this.userFavoriteTechnologiesService.favoriteTechStack$.subscribe((stack) => {
      this.favoriteTechStack = stack;
    });
    this.userFavoriteTechnologiesService.loadFavoriteTechStack();
  }
}
