import { Component, Input, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import type { TerminalLineInterface } from '../../interfaces/post-form';

import { LocalDatePipe } from '../../pipes/local-date-pipe';

@Component({
  selector: 'app-terminal-log',
  imports: [LocalDatePipe],
  templateUrl: './terminal-log.html',
  styleUrl: './terminal-log.scss',
})
export class TerminalLog {
  @Input() terminalMessages: TerminalLineInterface[] = [];

  delayedMessages: TerminalLineInterface[] = [];
  currentTime: Date = new Date();

  @ViewChild('terminalLog') private terminalLogContainer!: ElementRef;

  private timeoutIds: number[] = [];

  public countMessagesByLevel(level: 'info' | 'error' | 'success' | 'system'): number {
    return this.delayedMessages.filter((message) => message.level === level).length;
  }

  ngOnInit() {
    this.currentTime = new Date();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['terminalMessages']) {
      this.currentTime = new Date();
      this.clearTimeouts();
      this.delayedMessages = [];
      this.pushDelayedMessage();
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  ngOnDestroy() {
    this.clearTimeouts();
  }

  /**
   * Pushes messages to the delayedMessages array with a staggered delay to create a typing effect.
   */
  private pushDelayedMessage(): void {
    this.terminalMessages.forEach((message, index) => {
      if (index === 0) {
        this.delayedMessages.push(message);
      } else {
        const timeoutId = setTimeout(() => {
          this.delayedMessages.push(message);
        }, index * 400);
        this.timeoutIds.push(timeoutId);
      }
    });
  }

  /**
   * Clears all timeouts to prevent memory leaks and unintended behavior when the component is destroyed or when new messages are received.
   */
  private clearTimeouts(): void {
    this.timeoutIds.forEach(clearTimeout);
    this.timeoutIds = [];
  }

  /**
   * Scrolls the terminal log to the bottom to ensure the latest messages are visible.
   */
  private scrollToBottom(): void {
    if (!this.terminalLogContainer) return;
    this.terminalLogContainer.nativeElement.scrollTop = this.terminalLogContainer.nativeElement.scrollHeight;
  }
}
