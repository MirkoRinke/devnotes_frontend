import { AfterViewInit, Directive, ElementRef, HostListener, OnDestroy } from '@angular/core';

@Directive({
  selector: '[appAutoFocusDirective]',
})
export class AutoFocusDirective implements AfterViewInit, OnDestroy {
  private readonly focusableSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  private previouslyFocusedElement: HTMLElement | null = null;

  constructor(private readonly el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    this.previouslyFocusedElement = document.activeElement as HTMLElement;

    const preferredTarget = this.el.nativeElement.querySelector<HTMLElement>('[appAutoFocusTarget]');
    const elementToFocus = preferredTarget ?? this.el.nativeElement.querySelector<HTMLElement>(this.focusableSelector);

    if (elementToFocus) {
      elementToFocus.focus();
    } else {
      this.el.nativeElement.setAttribute('tabindex', '-1');
      this.el.nativeElement.focus();
    }
  }

  @HostListener('keydown.tab', ['$event'])
  onTab(event: Event): void {
    this.trapFocus(event as KeyboardEvent, false);
  }

  @HostListener('keydown.shift.tab', ['$event'])
  onShiftTab(event: Event): void {
    this.trapFocus(event as KeyboardEvent, true);
  }

  ngOnDestroy(): void {
    this.previouslyFocusedElement?.focus();
  }

  private trapFocus(event: KeyboardEvent, isShiftTab: boolean): void {
    const focusableElements = Array.from(this.el.nativeElement.querySelectorAll<HTMLElement>(this.focusableSelector));
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
