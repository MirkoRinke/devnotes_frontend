import { Component, signal, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header';
import { Footer } from './components/footer/footer';

import * as Prism from 'prismjs';
import 'prismjs/plugins/autoloader/prism-autoloader';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  protected readonly title = signal('devnotes_frontend');

  ngOnInit() {
    const prism = Prism as any;
    if (prism.plugins && prism.plugins.autoloader) {
      prism.plugins.autoloader.languages_path = 'assets/prism/components/';
    }
  }
}
