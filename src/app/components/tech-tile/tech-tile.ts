import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-tech-tile',
  imports: [RouterLink],
  templateUrl: './tech-tile.html',
  styleUrl: './tech-tile.scss',
})
export class TechTile {
  @Input() name!: string;
  @Input() counts!: number;
  @Input() endPoint!: string;
  @Input() entity!: string;
}
