import { Component, Input } from '@angular/core';

import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { SvgIconsService } from '../../services/svg.icons.service';

import type { PostInterface } from '../../interfaces/post';

@Component({
  selector: 'app-post-list-element',
  imports: [RouterLink, DatePipe],
  templateUrl: './post-list-element.html',
  styleUrl: './post-list-element.scss',
})
export class PostListElement {
  @Input() context: string | null = null;
  @Input() endPoint: string | null = null;

  @Input() post: PostInterface | null = null;

  @Input() selectedEntity: string | null = null;
  @Input() selectedEntityValue: string | null = null;
  @Input() selectedPostType: string | null = null;

  constructor(public svgIconsService: SvgIconsService) {}
}
