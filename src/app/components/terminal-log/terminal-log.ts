import { Component, Input, ViewChild, ElementRef, SimpleChanges } from '@angular/core';
import type { TerminalLineInterface } from '../../interfaces/post-form';

@Component({
  selector: 'app-terminal-log',
  imports: [],
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
    if (!this.terminalMessages.length) return;

    const initialMessages = [this.terminalMessages[0]];

    this.terminalMessages.slice(1).forEach((message, index) => {
      const timeoutId = setTimeout(
        () => {
          this.delayedMessages.push(message);
        },
        (index + 1) * 400,
      );
      this.timeoutIds.push(timeoutId);
    });

    this.delayedMessages = initialMessages;
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
