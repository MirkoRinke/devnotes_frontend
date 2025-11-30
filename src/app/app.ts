import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageNavigation } from './components/page-navigation/page-navigation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PageNavigation],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  protected readonly title = signal('devnotes_frontend');
}
