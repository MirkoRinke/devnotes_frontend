import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-tech-tile',
  imports: [],
  templateUrl: './tech-tile.html',
  styleUrl: './tech-tile.scss',
})
export class TechTile {
  @Input() name!: string;
  @Input() counts!: number;
}
