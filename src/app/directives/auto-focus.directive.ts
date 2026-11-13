import { AfterViewInit, Directive, ElementRef, HostListener, OnDestroy, Input } from '@angular/core';
import { queryFocusableElements } from '../utils/dom-helper';

@Directive({
  selector: '[appAutoFocusDirective]',
})
export class AutoFocusDirective implements AfterViewInit, OnDestroy {
  @Input('appAutoFocusTrap') trap: boolean = true;

  private readonly focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  private previouslyFocusedElement: HTMLElement | null = null;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.previouslyFocusedElement = document.activeElement as HTMLElement;

    const preferredTarget = this.el.nativeElement.querySelector<HTMLElement>('[appAutoFocusTarget]');
    const elementToFocus = preferredTarget ?? queryFocusableElements(this.el.nativeElement, this.focusableSelector)[0];

    if (elementToFocus) {
      elementToFocus.focus();
    } else {
      this.el.nativeElement.setAttribute('tabindex', '-1');
      this.el.nativeElement.focus();
    }
  }

  ngOnDestroy(): void {
    this.previouslyFocusedElement?.focus();
  }

  @HostListener('keydown.tab', ['$event'])
  public onTab(event: Event): void {
    this.trapFocus(event as KeyboardEvent, false);
  }

  @HostListener('keydown.shift.tab', ['$event'])
  public onShiftTab(event: Event): void {
    this.trapFocus(event as KeyboardEvent, true);
  }

  private trapFocus(event: KeyboardEvent, isShiftTab: boolean): void {
    if (!this.trap) return;
    const focusableElements = queryFocusableElements(this.el.nativeElement, this.focusableSelector);
    if (focusableElements.length === 0) return;

    const first = focusableElements[0];
    const last = focusableElements[focusableElements.length - 1];

    if (isShiftTab && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!isShiftTab && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }
}
