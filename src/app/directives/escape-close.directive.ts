import { Directive, EventEmitter, HostListener, Input, Output } from '@angular/core';

@Directive({
  selector: '[appEscapeCloseDirective]',
})
export class EscapeCloseDirective {
  @Input('appEscapeCloseEnabled') enabled = false;
  @Input('appEscapeClose') restoreFocusTo?: HTMLElement;

  @Output() escapePressed = new EventEmitter<void>();

  @HostListener('keydown.escape')
  onEscape(): void {
    if (!this.enabled) return;
    this.escapePressed.emit();
    this.restoreFocusTo?.focus();
  }
}
