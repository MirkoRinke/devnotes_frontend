import { Directive, HostBinding, HostListener, input } from '@angular/core';

@Directive({
  selector: '[appAccessibleButtonDirective]',
})
export class AccessibleButtonDirective<T extends () => void> {
  public readonly accessibleButtonAction = input.required<T>();

  @HostBinding('attr.tabindex')
  public readonly tabindex = '0';

  @HostBinding('attr.role')
  public readonly role = 'button';

  @HostListener('click', ['$event'])
  public onClick(event: MouseEvent): void {
    event.stopPropagation();
    this.accessibleButtonAction()();
  }

  @HostListener('keydown', ['$event'])
  public onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      event.stopPropagation();
      this.accessibleButtonAction()();
    }
  }
}
