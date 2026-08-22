import { Component, AfterViewInit, OnDestroy, HostListener, ElementRef, ViewChild, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ViewportScroller } from '@angular/common';

import { TranslatePipe } from '../../../i18n/translate-pipe';

import { Imprint } from '../imprint/imprint';
import { Privacy } from '../privacy/privacy';
import { Terms } from '../terms/terms';

@Component({
  selector: 'app-legal-mobile',
  imports: [RouterLink, Imprint, Privacy, Terms, TranslatePipe],
  templateUrl: './legal-mobile.html',
  styleUrl: './legal-mobile.scss',
})
export class LegalMobile implements AfterViewInit, OnDestroy {
  private linksRef: ElementRef<HTMLElement> | null = null;

  private rafId: number | null = null;

  private viewportScroller = inject(ViewportScroller);

  ngAfterViewInit(): void {
    this.setOffset();
  }

  /**
   * Resets the viewport scroller offset when the component is destroyed.
   */
  ngOnDestroy(): void {
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.viewportScroller.setOffset([0, 0]);
  }

  /**
   * Sets the reference to the links element.
   */
  @ViewChild('links') set linksRefSetter(content: ElementRef<HTMLElement>) {
    this.linksRef = content;
  }

  /**
   * Handles window resize events.
   */
  @HostListener('window:resize')
  public onResize(): void {
    this.setOffset();
  }

  /**
   * Sets the offset for the viewport scroller based on the height of the links element.
   *
   */
  private setOffset(): void {
    if (!this.linksRef) return;
    const el = this.linksRef.nativeElement;
    if (this.rafId) cancelAnimationFrame(this.rafId);
    this.rafId = requestAnimationFrame(() => {
      this.viewportScroller.setOffset([0, el.offsetHeight]);
    });
  }
}
