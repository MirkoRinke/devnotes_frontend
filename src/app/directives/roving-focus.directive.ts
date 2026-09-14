import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appRovingFocusDirective]',
})
export class RovingFocusDirective {
  @Input('appInputFocusElements') inputFocusElements: string | null = null;

  private readonly defaultFocusElements: string = '[role="option"]';

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  @HostListener('keydown.arrowDown') onArrowDown() {
    this.move(1);
  }
  @HostListener('keydown.arrowUp') onArrowUp() {
    this.move(-1);
  }

  private move(direction: 1 | -1): void {
    const selector = this.inputFocusElements ? `${this.defaultFocusElements},${this.inputFocusElements}` : this.defaultFocusElements;
    const items = Array.from(this.el.nativeElement.querySelectorAll<HTMLElement>(selector));
    if (items.length === 0) return;
    const currentIndex = items.indexOf(document.activeElement as HTMLElement);
    const nextIndex = currentIndex === -1 ? (direction === 1 ? 0 : items.length - 1) : (currentIndex + direction + items.length) % items.length;
    items[nextIndex].focus();
  }
}
