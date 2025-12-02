import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

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
    const icons: { [key: string]: string } = {
      SVG_Element: /*html*/ `
      <svg class="${className}"></svg>
      `,
    };

    const iconHtml = icons[type] || '';
    return this.sanitizer.bypassSecurityTrustHtml(iconHtml);
  }
}
