import { Directive, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';

@Directive({
  selector: '[appClickOutsideDirective]',
})
export class ClickOutsideDirective implements OnInit, OnDestroy {
  @Input() clickOutsideEnabled = false;

  @Output() clickOutside = new EventEmitter<void>();

  constructor(private el: ElementRef) {}

  ngOnInit(): void {
    document.addEventListener('click', this.onDocumentClick, true);
  }

  ngOnDestroy(): void {
    document.removeEventListener('click', this.onDocumentClick, true);
  }

  private readonly onDocumentClick = (event: MouseEvent): void => {
    if (!this.clickOutsideEnabled) return;
    if (event.target && !this.el.nativeElement.contains(event.target)) {
      this.clickOutside.emit();
    }
  };
}
