import { Component, Input } from '@angular/core';

import { RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';

import { SvgIconsService } from '../../services/svg.icons.service';

import { TranslatePipe } from '../../i18n/translate-pipe';

import type { PostInterface } from '../../interfaces/post';

import type { PostListParamsInterface } from '../../interfaces/post-list-params';

@Component({
  selector: 'app-post-list-element',
  imports: [RouterLink, DatePipe, TranslatePipe],
  templateUrl: './post-list-element.html',
  styleUrl: './post-list-element.scss',
})
export class PostListElement {
  @Input() context: PostListParamsInterface['context'] = null;
  @Input() endPoint: PostListParamsInterface['endPoint'] = null;
  @Input() selectedEntity: PostListParamsInterface['selectedEntity'] = null;
  @Input() selectedEntityValue: PostListParamsInterface['selectedEntityValue'] = null;
  @Input() selectedPostType: PostListParamsInterface['selectedPostType'] = null;

  @Input() post: PostInterface | null = null;

  constructor(public readonly svgIconsService: SvgIconsService) {}
}
