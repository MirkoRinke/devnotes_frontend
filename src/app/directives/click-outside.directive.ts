import { Directive, ElementRef, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutsideDirective]',
})
export class ClickOutsideDirective {
  @Input() clickOutsideEnabled = false;

  @Output() clickOutside = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  @HostListener('document:click', ['$event.target'])
  onClick(target: EventTarget | null) {
    if (!this.clickOutsideEnabled) return;
    if (target && !this.el.nativeElement.contains(target)) {
      this.clickOutside.emit();
    }
  }
}
