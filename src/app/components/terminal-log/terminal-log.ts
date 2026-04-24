import { Component, Input } from '@angular/core';
import type { TerminalLineInterface } from '../../interfaces/post-form';

@Component({
  selector: 'app-terminal-log',
  imports: [],
  templateUrl: './terminal-log.html',
  styleUrl: './terminal-log.scss',
})
export class TerminalLog {
  @Input() terminalMessages: TerminalLineInterface[] = [];
}
