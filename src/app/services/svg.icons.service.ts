import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

import { getFallbackIcon } from './data/fallback-icons';
import { getAppIcon } from './data/app-icons';
import { getLangIcon } from './data/lang-icons';
import { getTechIcon } from './data/tech-icons';
import { getPostTypeIcon } from './data/post-type-icons';
@Injectable({
  providedIn: 'root',
})
/**
 * Usage Example:
 *
 * In your component:
 * import { SvgIconsService } from 'src/app/services/svg.icons.service';
 *
 * constructor(private svgIconsService: SvgIconsService) {}
 *
 * In your template:
 *
 * <div [innerHTML]="svgIconsService.returnIcon('SVG_Element', 'CLASS_NAME')"></div>
 * Class name is optional, it will be set to the type if not provided.
 *
 * CSS Example:
 *
 *  You need to use ::ng-deep to style the SVG elements: Angular encapsulates styles by default.
 *
 * ::ng-deep .SVG_Element {
 *   width: 24px;
 * }
 */
export class SvgIconsService {
  constructor(private sanitizer: DomSanitizer) {}

  public returnIcon(type: string, className: string = type): SafeHtml {
    let typeLower = type.toLowerCase().replace(/[.\s]+/g, '_');

    const iconHtml = getAppIcon(type, className) || getLangIcon(typeLower, className) || getTechIcon(typeLower, className) || getPostTypeIcon(typeLower, className) || getFallbackIcon();

    return this.sanitizer.bypassSecurityTrustHtml(iconHtml);
  }
}
